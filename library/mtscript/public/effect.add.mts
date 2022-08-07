[h: jarr = arg(0)]
[h: fxArg = arg(1)]
[h, if (argCount()>2): fxReplace = arg(2); fxReplace = 1]

[h: effects = "[]"]
[h: arglen = argCount()]

[h, if (json.type(fxArg) == "UNKNOWN"), code: {
	[h: fxlib = getLibProperty("effectsDB", getMacroLocation())]
	[h, if (json.type(fxlib) !="ARRAY"): fxlib = "[]"]

	[h: fxobjQ = json.path.read(fxlib, strformat("*[?(@.name == '%{fxname}')]"), "ALWAYS_RETURN_LIST")]
	[assert(json.length(fxobjQ)>0, "effect.add: No such effect")]
	
	[h: fxobj = json.get(fxobjQ, 0)]
};{
	[h: fxobj = fxArg]
}]

[h, if (fxReplace): 
	jarr = json.path.delete(jarr, 
		strformat("*[?(@.type == 'effect' && @.name == '%s')]", json.get(fxobj, "name")))]

[h: macro.return = json.append(jarr, fxobj)]
