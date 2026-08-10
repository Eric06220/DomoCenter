Set WshShell = CreateObject("WScript.Shell")

WshShell.Run _
  "cmd /c cd /d C:\Users\ericf\Documents\GitHub\DomoCenter\domocenter-v4 && npm.cmd run dev -- --host", _
  0, _
  False
  