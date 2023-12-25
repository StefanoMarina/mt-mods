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

[h: '<!-- quit if requesting to disable a non existent fx -->']
[h: return( value || fx != "", 0)]

[h: '<!-- on global effect, resolve any reference -->']
[h, if (value || json.contains(fx, "ref")): rfx = effect.resolve(fx); rfx = fx]

[h, if (json.type(rfx) == "ARRAY"), code: {
	[return(json.length(rfx)>0, 0)]
	[rfx = json.get(rfx, 0)]
}]

[h: assert( json.type(fx) == "OBJECT", "mod.setEffect: bad object " + string(fx))]
[h: fxname = json.get(fx, "name")]
[h: contains = effect.contains(prop, fxname)]

[h, if (value) : 
	prop =  if (contains, prop, json.append(prop, fx));
	prop = effect.remove(prop, fxname, tokenID, map)
]

[h: setProperty(property, prop, tokenID, map)]

[h: state = json.get(rfx, "state")]
[h, if (state != ""): setState(state, value, tokenID, map)]

[h: macro.return = if (contains && value, 0, 1)]