[h: fxname= arg(0)]
[h, if (argCount()>1): jarr = arg(1); jarr = getLibProperty("effectsDB")]
[h, if (argCount()>2) : index= arg(2); index = -1]

[h, if (index = -1):
	macro.return = json.path.read(jarr, strformat("*[?(@.name == '%{fxname}' && @.type=='effect')]", "ALWAYS_RETURN_LIST"));
	macro.return = json.get( json.path.read(jarr, strformat("*[?(@.name == '%{fxname}' && @.type=='effect')]", "ALWAYS_RETURN_LIST")) , 0)
]
		
