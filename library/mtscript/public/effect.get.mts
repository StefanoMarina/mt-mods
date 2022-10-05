[h: fxname= arg(0)]
[h, if (argCount()>1) : index= arg(1); index = -1]
[h, if (argCount()>2): jarr = arg(2); jarr = getLibProperty("effectsDB")]

[h, if (index == -1):
	macro.return = json.path.read(jarr, strformat("*[?(@.name == '%{fxname}' && @.type=='effect')]", "ALWAYS_RETURN_LIST"));
	macro.return = json.get( json.path.read(jarr, strformat("*[?(@.name == '%{fxname}' && @.type=='effect')]", "ALWAYS_RETURN_LIST")) , index)
]
		
