[h: propName = arg(0)]
[h: modProperty = arg(1)]
[h, if (argCount()>2): scope= arg(2); scope = "all"]
[h, if (argCount()>3): tokenID = arg(3); tokenID = currentToken()]
[h, if (argCount()>4) : map = arg(4); map = getCurrentMapName()]

[h: prop = getProperty(propName, tokenID, map)]
[h, if (json.type(modProperty) == "UNKNOWN"): modProperty = getProperty(modProperty, tokenID, map)]

[h: '<!-- do not look for score mods if prop is not a number -->']
[h: scoreValue = mod.getScore(propName, if (isNumber(prop), modProperty, ""), tokenID, map)]
[h: propMod = mod.get(modProperty, propName, scope, 0)]

[h, if (isNumber(propMod) && isNumber(scoreValue)):
	macro.return = scoreValue+propMod;
	macro.return = scoreValue + if (startsWith(propMod, "+") || startsWith(propMod, "-"),
	propMod, "+" + propMod)]
