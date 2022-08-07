[h: jarr = arg(0)]
[h: fxname = arg(1)]

[h: assert ( json.type(jarr) == "ARRAY", "effect.contains: not a json array.")]

[h: macro.return = gt ( json.length(
	json.path.read (jarr, strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')]"))
	), 0)]