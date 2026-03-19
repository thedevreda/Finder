📋 How to Set It Up — Step by Step
Step 1 — Get your Spreadsheet ID

Open your Google Sheet
Look at the URL: https://docs.google.com/spreadsheets/d/THIS_PART/edit
Copy that ID

Step 2 — Open Apps Script

In your Google Sheet, click Extensions → Apps Script
Delete everything in the editor
Paste the entire Code.gs content
On line 7, replace YOUR_SPREADSHEET_ID_HERE with your actual ID

Step 3 — Run Setup (creates the sheets)

At the top dropdown, select setupSheets
Click ▶ Run
It will ask for permissions — click Allow
This creates MainReminders and WorkflowTasks sheets with the correct columns including the user column

Step 4 — Deploy as Web App

Click Deploy → New deployment
Click the gear ⚙ next to "Type" → select Web App
Set Execute as: Me
Set Who has access: Anyone
Click Deploy
Copy the Web App URL

Step 5 — Update panel.html

Open panel.html
Find line: const API_URL = "https://script.google.com/..."
Replace the URL with your new deployment URL

Step 6 — Every time you edit the script

Go to Deploy → Manage deployments → Edit → New version → Deploy
You must create a new version for changes to take effect
