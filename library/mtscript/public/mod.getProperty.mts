[h: propName = arg(0)]
[h: modProperty = arg(1)]
[h, if (argCount()>2): scope= arg(2); scope = "all"]
[h, if (argCount()>3): tokenID = arg(3); tokenID = currentToken()]
[h, if (argCount()>4) : map = arg(4); map = getCurrentMapName()]

[h: prop = getProperty(propName, tokenID, map)]
[h, if (json.type(modProperty) == "UNKNOWN"): modProperty = getProperty(modProperty, tokenID, map)]
[h: macro.return = mod.getScore(propName, modProperty, tokenID, map) + mod.get(modProperty, propName, scope, 0)]