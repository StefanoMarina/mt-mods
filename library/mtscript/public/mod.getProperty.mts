[h: propName = arg(0)]
[h: modProperty = arg(1)]
[h, if (argCount()>2): scope= arg(2); scope = "all"]
[h, if (argCount()>3): tokenID = arg(3); tokenID = currentToken()]
[h, if (argCount()>4) : map = arg(4); map = getCurrentMapName()]

[h: prop = getProperty(propName, tokenID, map)]
[h, if (json.type(modProperty) == "UNKNOWN"): modProperty = getProperty(modProperty, tokenID, map)]

[h: '<!-- do not look for score if prop is not a number -->']
[h, if (isNumber(prop)): 
	scoreValue = mod.getScore(propName, modProperty, tokenID, map); 
	scoreValue= prop
]

[h: elements = mod.getElements(modProperty, propName, scope)]
[h: return (!json.isEmpty(elements), scoreValue)]

[h: '<!-- force value -->']
[h: forcings = replace(
	json.toList(json.path.read(elements, "*[?(@.value =~ /^=.*/)].value")),
	"=", "")
]

[h, if (forcings != ""), code: {
	[forcings = listSort(forcings,getLibProperty("forceSortMethod"))]
	[scoreValue = listGet(forcings, 0)]
}]
[h: '<!-- retrieve buff-->']
[h: propMod = mod.get(elements, propName, scope, 0, 1)]

[h: return (propMod != 0, scoreValue)]

[h: '<!-- evaluate expression -->']
[h, if (isNumber(propMod) && isNumber(scoreValue)):
	exp = scoreValue+propMod;
	exp = scoreValue + if (!matches(propMod, "^[\\d\\w].*"), propMod, "+" + propMod)]
	
[h, if (!getLibProperty("forceString") && matches (exp, "[\\{\\}\\[\\]\\(\\)\\d\\.\\+\\-\\*\\/]+")):
	macro.return = eval(exp);
	macro.return = exp
]