[manual.txt](https://github.com/user-attachments/files/26229363/manual.txt)
🔥 Firebase setup — step by step
Step 1 — Create project

Go to console.firebase.google.com
Click Add project → name it (e.g. ecp-panel) → Create

Step 2 — Enable Authentication

Left sidebar → Build → Authentication
Click Get started
Under Sign-in method tab → click Email/Password → toggle Enable → Save

Step 3 — Enable Realtime Database

Left sidebar → Build → Realtime Database
Click Create Database → choose region → Start in test mode → Enable

Step 4 — Get your config

Click ⚙️ (top-left gear) → Project settings
Scroll to Your apps → click the </> web icon → register app
Copy the firebaseConfig object shown

Step 5 — Paste config into index.html
Find this block near the top of the <script> section:
jsconst FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  ...
};
```
Replace every `"YOUR_..."` with the real values from Step 4.

### Step 6 — Place files together & open
```
📁 your-folder/
   ├── index.html
   └── data.json
Open index.html in a browser (use VS Code Live Server or any local server — direct file:// won't work with Firebase).



Step 1 — Create a Firebase project

Go to console.firebase.google.com
Click "Add project" → give it a name (e.g. ecp-panel) → Continue
Disable Google Analytics if you don't need it → Create project

Step 2 — Enable Realtime Database

In the left sidebar → Build → Realtime Database
Click Create Database
Choose a region (e.g. us-central1) → Next
Start in Test mode (allows all reads/writes for 30 days) → Enable

Step 3 — Get your config

Click the gear icon (⚙️) → Project settings
Scroll to "Your apps" → click the </> (Web) icon
Register app (name it anything) → you'll see a config like:

jsconst firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ecp-panel.firebaseapp.com",
  databaseURL: "https://ecp-panel-default-rtdb.firebaseio.com",
  projectId: "ecp-panel",
  ...
};
Step 4 — Paste config into index.html
Open index.html, find this block near the top of the <script>:
jsconst FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  ...
```
Replace each `"YOUR_..."` value with the values from Step 3.

**Step 5 — Place files in the same folder**
```
📁 your-folder/
   ├── index.html
   └── data.json
Open index.html in a browser (or serve it with a local server like VS Code Live Server).



Step 1 — Open your project
Go to console.firebase.google.com → click your project (ecp-panel)
Step 2 — Go to Realtime Database Rules
Left sidebar → Build → Realtime Database → click the Rules tab at the top
Step 3 — Replace the rules
You'll see something like this (the expiring test mode rule):
json{
  "rules": {
    ".read": "now < 1234567890000",
    ".write": "now < 1234567890000"
  }
}
Replace it with this — it allows only logged-in users to read/write:

{
  "rules": {
    "reminders": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "workflows": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
