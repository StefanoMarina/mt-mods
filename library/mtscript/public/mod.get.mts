[h: jarr = arg(0)]
[h: modName = arg(1)]
[h, if (argCount()>2): modType = arg(2); modType = "all"]
[h, if (argCount()>3): otherwise = arg(3); otherwise = 0]
[h, if (argCount()>4): optimized = arg(4); optimized = 0]

[h, if (!optimized): propMods = mod.getElements(jarr, modName, modType); propMods = jarr]
[h: return(!json.isEmpty(propMods), otherwise)]

[h: '<!-- split into pure values and operations -->']
[h: pureValues = json.path.read(propMods, "*[?(@.value =~ /^[^\\*\\/\\=].*/)].value")]
[h: operations = json.path.read(propMods, "*[?(@.value =~ /^[\\*\\/].*/)].value")]

[h: exp = strformat("%s%s%s",
	json.toList(operations, ""),
	if (json.isEmpty(operations), "", "+"),
	json.toList(pureValues, "+")
	)]
[h: exp = replace(exp, "\\+(\\-|\\+)", "\1")]

[h, if (matches (exp, "[\\{\\}\\[\\]\\(\\)\\d\\.\\+\\-]+")):
	macro.return = eval (string(exp));
	macro.return = string (exp)
]

