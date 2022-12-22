[h: '<!-- this will reset the whole library! -->']
[h: setLibProperty("version", 103)]
[h: vars = "cssList, groupsList"]

[h, foreach (var, vars): setLibProperty(var, "")]

[h: setLibProperty("supportedRolls", "attack, check, damage, save")]

[h: setLibProperty("cssOnly", 1)]
[h: setLibProperty("binds", "[]")]
[h: setLibProperty("effectsDB", "[]")]

[macro("Configure@this"): ""]
