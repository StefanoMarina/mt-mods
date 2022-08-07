[h: fxname= arg(0)]
[h, if (argCount()>1): jarr = arg(1); jarr = getLibProperty("effectsDB")]
[h:	macro.return = json.path.read(jarr, strformat("*[?(@.name == '%{fxname}' && @.effects)]", "ALWAYS_RETURN_LIST"))]
		
