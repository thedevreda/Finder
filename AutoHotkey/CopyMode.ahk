toggle := false

CapsLock::
toggle := !toggle
TrayTip, Mode, % toggle ? "Copy/Paste Mode ON" : "Normal Mode ON", 1
return

#If toggle
c::Send ^c
v::Send ^v
#If