Emails.json always on update.

Make sure to download the lastest version
===============================================================

Create sheet called: ECP-DATABASE
Create two pages: MainReminders and WorkflowTasks
Create headers: Main : pn	| steps & Workflow: id	| part	| hours	 | country |	type | end	| finished
Go to extention > Apps Script > and paste this script :

  const SPREADSHEET_ID = "1wv6dR5mVXQmEGO_RKjgCXWb7yA7CivlIuAkG4se7t9M"; //SPREADSHEET ID FROM URL

function doGet(e){
  const sheetName = e.parameter.sheet; // "MainReminders" or "WorkflowTasks"
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const results = data.map(row => {
    let obj = {};
    headers.forEach((h,i)=>obj[h]=row[i]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(results))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  const params = JSON.parse(e.postData.contents);
  const sheetName = params.sheet;
  const payload = params.payload; // array of objects
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  
  // Clear and write headers
  sheet.clearContents();
  const headers = Object.keys(payload[0] || {});
  sheet.appendRow(headers);
  
  payload.forEach(obj=>{
    const row = headers.map(h=>obj[h]);
    sheet.appendRow(row);
  });
  
  return ContentService.createTextOutput(JSON.stringify({status:"ok"}))
    .setMimeType(ContentService.MimeType.JSON);
}

Deploy > New deployment > Web App: Me and Who can access: Anyone
===============================================================
✅Step 1: Install AutoHotkey

✅ Step 2 — Find Your Script File

Go to where you saved your script (maybe Desktop).

Look for something like:

copyMode.ahk

Right-click the file.

Click Edit Script
(If you don’t see that, click Open with → Notepad.)

✅ Step 3 — Delete Old Code

Select everything inside (Ctrl + A).

Press Delete.

Now the file should be completely empty.

✅ Step 4 — Paste the New Code

Copy this EXACT code and paste it inside:

toggle := false

CapsLock::
toggle := !toggle
TrayTip, Mode, % toggle ? "Copy/Paste Mode ON" : "Normal Mode ON", 1
return

#If toggle
c::Send ^c
v::Send ^v
#If
✅ Step 5 — Save the File

Click File

Click Save

Close Notepad

✅ Step 6 — Run the Script

Double-click the .ahk file again.

You should now see the green H icon in the bottom-right.

🎮 How To Use It

Press CapsLock → Copy/Paste mode ON

Press CapsLock again → Back to normal typing

Press C → Copy (when ON)

Press V → Paste (when ON)
