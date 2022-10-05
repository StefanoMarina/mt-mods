[h: fx = arg(0)]
[h: value = arg(1)]
[h: property = arg(2)]
[h, if (argCount()>3): tokenID = arg(3); tokenID = currentToken()]
[h, if (argCount()>4): map = arg(4); map = getCurrentMapName()]

[h: prop = getProperty(property, tokenID, map)]
[h, if (prop == ""): prop = "[]"; assert(json.type(prop)=="ARRAY", "mod.setEffect: bad property type.")]

[h: contains = -1]

[h, if (json.type(fx)=="UNKNOWN"), code: {
	[if (value): 
		fx = effect.get(fx, 0); 
		fx = effect.get(fx, 0, prop)
	]
};{}]

[h: '<!-- resolve any reference -->']
[h: rfx = effect.resolve(fx)]

[h: log.debug(string(fx))]
[h: log.debug(string(rfx))]

[h, if (json.type(rfx) == "ARRAY"), code: {
	[return(json.length(rfx)>0, 0)]
	[rfx = json.get(rfx, 0)]
}]

[h: fxname = json.get(fx, "name")]
[h: contains = effect.contains(prop, fxname)]

[h, if (value) : 
	prop =  if (contains, prop, json.append(prop, fx));
	prop = effect.remove(prop, fxname)
]

[h: setProperty(property, prop, tokenID, map)]

[h: state = json.get(rfx, "state")]
[h, if (state != ""): setState(state, value, tokenID, map)]

[h: macro.return = if (contains && value, 0, 1)]