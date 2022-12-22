[h: prop = arg(0)]
[h, if (argCount()>1): jarr = arg(1); jarr=""]
[h, if (argCount()>2): tokenID = arg(2); tokenID = currentToken()]
[h, if (argCount()>3): mapID= arg(3); mapID = getCurrentMapName()]

[h: propValue = getProperty(prop, tokenID, mapID)]
[h, if (jarr != "" && json.type(jarr) == "UNKNOWN"): jarr = getProperty(jarr, tokenID, mapID)]

[h, if (jarr != ""): propValue = propValue +  mod.get(jarr, prop, "score")]

[h: libdata = getLibProperty("binds")]
[h, if (json.type(libdata) != "ARRAY"): libdata = "[]"]
[h: query = json.path.read(libdata, strformat("*[?(@.prop == '%s')].table", prop), "ALWAYS_RETURN_LIST")]

[h, if (json.length(query)>0): 
	macro.return = table (json.get(query,0), propValue);
	macro.return = propValue
]