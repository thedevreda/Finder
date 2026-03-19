// ================================================================
//  ECP Panel — Google Apps Script Backend
//  Paste this entire file into your Apps Script editor
//  and deploy as a Web App (Execute as: Me, Access: Anyone)
// ================================================================

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // <-- Replace this

// Sheet names — must match exactly in your Google Sheet
const SHEETS = {
  MainReminders : "MainReminders",
  WorkflowTasks : "WorkflowTasks"
};

// ================================================================
//  GET — load data filtered by user
// ================================================================
function doGet(e) {
  try {
    const sheet = e.parameter.sheet;
    const user  = e.parameter.user || null;

    if (!sheet || !SHEETS[sheet]) {
      return jsonResponse({ error: "Unknown sheet: " + sheet });
    }

    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ws    = ss.getSheetByName(SHEETS[sheet]);
    const rows  = ws.getDataRange().getValues();

    if (rows.length <= 1) {
      return jsonResponse([]);
    }

    const headers = rows[0].map(h => String(h).trim());
    const data    = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = row[idx]; });

      // Filter by user if provided
      if (user && obj.user && String(obj.user).toLowerCase() !== String(user).toLowerCase()) {
        continue;
      }

      data.push(obj);
    }

    return jsonResponse(data);

  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ================================================================
//  POST — save data for a specific user
//  Body: { sheet: "SheetName", user: "username", payload: [...] }
// ================================================================
function doPost(e) {
  try {
    const body      = JSON.parse(e.postData.contents);
    const sheetName = body.sheet;
    const user      = body.user || null;
    const payload   = body.payload || [];

    if (!sheetName || !SHEETS[sheetName]) {
      return jsonResponse({ error: "Unknown sheet: " + sheetName });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ws = ss.getSheetByName(SHEETS[sheetName]);

    // Step 1: Read all existing rows
    const allRows = ws.getDataRange().getValues();
    const headers = allRows.length > 0 ? allRows[0].map(h => String(h).trim()) : [];

    // Step 2: Keep rows that belong to OTHER users
    let otherUserRows = [];
    if (allRows.length > 1) {
      const userColIdx = headers.indexOf("user");
      for (let i = 1; i < allRows.length; i++) {
        const rowUser = userColIdx >= 0 ? String(allRows[i][userColIdx]).toLowerCase() : "";
        if (!user || rowUser !== String(user).toLowerCase()) {
          otherUserRows.push(allRows[i]);
        }
      }
    }

    // Step 3: Build headers if sheet was empty
    let newHeaders = headers.length > 0 ? headers : [];
    if (newHeaders.length === 0 && payload.length > 0) {
      newHeaders = Object.keys(payload[0]);
    }
    if (!newHeaders.includes("user")) {
      newHeaders.push("user");
    }

    // Step 4: Build new rows for this user
    const newUserRows = payload.map(obj => {
      return newHeaders.map(h => {
        if (h === "user") return user || "";
        return obj[h] !== undefined ? obj[h] : "";
      });
    });

    // Step 5: Clear and rewrite entire sheet
    ws.clearContents();
    ws.appendRow(newHeaders);

    const allDataRows = [...otherUserRows, ...newUserRows];
    if (allDataRows.length > 0) {
      ws.getRange(2, 1, allDataRows.length, newHeaders.length).setValues(allDataRows);
    }

    return jsonResponse({ success: true, saved: newUserRows.length });

  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ================================================================
//  HELPER — JSON response
// ================================================================
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
//  SETUP — Run this ONCE to create sheets with correct headers
//  Go to: Apps Script editor → Run → setupSheets
// ================================================================
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const configs = [
    {
      name    : "MainReminders",
      headers : ["id","part","hours","country","type","end","finished","user"]
    },
    {
      name    : "WorkflowTasks",
      headers : ["pn","steps","user"]
    }
  ];

  configs.forEach(cfg => {
    let ws = ss.getSheetByName(cfg.name);
    if (!ws) {
      ws = ss.insertSheet(cfg.name);
      Logger.log("Created sheet: " + cfg.name);
    } else {
      Logger.log("Sheet already exists: " + cfg.name);
    }
    if (ws.getLastRow() === 0) {
      ws.appendRow(cfg.headers);
      ws.getRange(1, 1, 1, cfg.headers.length)
        .setFontWeight("bold")
        .setBackground("#e8f0fe");
      Logger.log("Headers written for: " + cfg.name);
    }
  });

  Logger.log("Setup complete!");
}
