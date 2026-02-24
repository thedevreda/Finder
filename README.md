Emails.json always on update.

Make shure to download the lastest version

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
