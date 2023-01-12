[h: arrID = arg(0)]
[h: fxname = arg(1)]
[h, if (argCount()>2): tokenID = arg(2); tokenID = ""]
[h, if (argCount()>3): mapID = arg(2); mapID = getCurrentMapName()]

[h, if (json.type(arrID) != "ARRAY"), code: {
	[jarr = getProperty(arrID, tokenID, mapID); jarr = arrID]	
	[h: resolvedArray = effect.resolve(jarr)]
	[h: state = json.path.read(resolvedArray , strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')].state"), "ALWAYS_RETURN_LIST")]
	[h, if (json.length(state)>0): state = json.get(state, 0); state = ""]
	[h, if (tokenID != ""  && state != ""): setState(state, 0, tokenID, mapID)]
	[h: jarr = json.path.delete(jarr, strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')]"))]
	[h: setProperty(arrID,  jarr, tokenID, mapID)]
}; {
	[h: jarr = json.path.delete(arrID, strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')]"))]
}]


[h: macro.return = jarr]