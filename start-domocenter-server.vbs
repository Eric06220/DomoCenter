Set WshShell = CreateObject("WScript.Shell")

WshShell.Run _
  "cmd /c cd /d C:\Users\ericf\Documents\GitHub\DomoCenter\domocenter-serveur && npm.cmd start", _
  0, _
  False
  