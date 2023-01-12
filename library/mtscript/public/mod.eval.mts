[h: expression = arg(0)]
[h: modID = arg(1)]
[h: scope = arg(2)]
[h, if (argCount()>3): tkID = arg(3); tkID = currentToken()]
[h, if (argCount()>4): mapID = arg(4); mapID = getCurrentMapName()]

[h: assert(tkID != "", "mod.eval: cannot process without a token")]

[h: props = getPropertyNamesRaw()]
[h, foreach (prop, props): expression = 
	replace ( expression, strformat("\\b(i?)%{prop}\\b"), mod.getProperty(prop, modID, scope, tkID, mapID) ) ]

[h, if (!getLibProperty("forceString") && matches (expression, "^[ \\{\\}\\[\\]\\(\\)\\d\\.\\+\\-\\*\\/]+\$")):
	macro.return = eval(expression);
	macro.return = expression
]
