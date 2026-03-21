/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ECP Panel — Google Apps Script  (Code.gs)                  ║
 * ║                                                              ║
 * ║  SETUP:                                                      ║
 * ║  1. Open your Google Sheet                                   ║
 * ║  2. Extensions → Apps Script                                 ║
 * ║  3. Paste this entire file, replacing any existing code      ║
 * ║  4. Save (Ctrl+S)                                            ║
 * ║  5. Run setupSheets() once to create the required tabs       ║
 * ║  6. Deploy → New Deployment                                  ║
 * ║     - Type:       Web App                                    ║
 * ║     - Execute as: Me                                         ║
 * ║     - Access:     Anyone                                     ║
 * ║  7. Copy the deployment URL into index.html → API_URL        ║
 * ║                                                              ║
 * ║  IMPORTANT: Every time you edit this script, do              ║
 * ║  Deploy → Manage Deployments → Edit → New Version           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  Sheet tabs created automatically:
 *
 *  MainReminders  →  id | part | hours | country | type | end | finished | user
 *  WorkflowTasks  →  pn | steps | user
 */

// ── Sheet names & column headers ──────────────────────────────
var HEADERS = {
  "MainReminders": ["id","part","hours","country","type","end","finished","user"],
  "WorkflowTasks": ["pn","steps","user"]
};

// ── Ensure sheet exists with correct headers ───────────────────
function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(HEADERS[name]);
    sh.setFrozenRows(1);
    var hRange = sh.getRange(1, 1, 1, HEADERS[name].length);
    hRange.setFontWeight("bold");
    hRange.setBackground("#1C1C1C");
    hRange.setFontColor("#FFFFFF");
    SpreadsheetApp.flush();
  }
  return sh;
}

// ══════════════════════════════════════════════════════════════
//  GET  →  ?sheet=NAME&user=EMAIL
//  Returns JSON array of all rows for that user in that sheet
// ══════════════════════════════════════════════════════════════
function doGet(e) {
  try {
    var shName = ((e.parameter || {}).sheet || "").trim();
    var user   = ((e.parameter || {}).user  || "").trim().toLowerCase();

    if (!shName || !HEADERS[shName]) {
      return jsonOut({ error: "Unknown or missing sheet param" });
    }

    var sh   = getOrCreateSheet(shName);
    var vals = sh.getDataRange().getValues();

    if (vals.length <= 1) return jsonOut([]); // no data rows

    var hdrs    = vals[0].map(function(h){ return String(h).trim(); });
    var userCol = hdrs.indexOf("user");
    var out     = [];

    for (var r = 1; r < vals.length; r++) {
      var row = vals[r];
      // Skip completely empty rows
      if (row.every(function(c){ return c === "" || c === null || c === undefined; })) continue;
      // Filter by user
      if (userCol >= 0) {
        var rowUser = String(row[userCol]).trim().toLowerCase();
        if (rowUser !== user) continue;
      }
      var obj = {};
      hdrs.forEach(function(h, i){ obj[h] = row[i]; });
      out.push(obj);
    }

    return jsonOut(out);

  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

// ══════════════════════════════════════════════════════════════
//  POST  →  body (text/plain) = { sheet, user, payload: [...] }
//  Full-replace strategy: delete all rows for this user, re-insert
// ══════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var body    = JSON.parse(e.postData.contents);
    var shName  = (body.sheet   || "").trim();
    var user    = (body.user    || "").trim().toLowerCase();
    var payload = Array.isArray(body.payload) ? body.payload : [];

    if (!shName || !HEADERS[shName]) {
      return jsonOut({ error: "Unknown or missing sheet" });
    }
    if (!user) return jsonOut({ error: "Missing user" });

    var sh      = getOrCreateSheet(shName);
    var hdrs    = HEADERS[shName];
    var userCol = hdrs.indexOf("user");

    // ── Delete existing rows for this user (scan bottom-up) ──
    var last = sh.getLastRow();
    for (var r = last; r >= 2; r--) {
      if (userCol >= 0) {
        var v = sh.getRange(r, userCol + 1).getValue();
        if (String(v).trim().toLowerCase() === user) {
          sh.deleteRow(r);
        }
      }
    }

    // ── Append payload rows ──
    var written = 0;
    payload.forEach(function(rowObj) {
      rowObj.user = user; // enforce correct user field
      var arr = hdrs.map(function(h){
        var val = rowObj[h];
        if (val === undefined || val === null) return "";
        return val;
      });
      sh.appendRow(arr);
      written++;
    });

    SpreadsheetApp.flush();

    return jsonOut({ ok: true, written: written });

  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

// ── JSON response helper ───────────────────────────────────────
function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Run once manually to create tabs ──────────────────────────
function setupSheets() {
  Object.keys(HEADERS).forEach(function(name){ getOrCreateSheet(name); });
  Logger.log("Done. Sheets created: " + Object.keys(HEADERS).join(", "));
}
