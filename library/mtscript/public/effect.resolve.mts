[h: jarr = arg(0)]

[h: refs = json.path.read(jarr, "*[?(@.type=='effect' && @.ref)]", "ALWAYS_RETURN_LIST, AS_PATH_LIST, SUPPRESS_EXCEPTIONS")]
[h: return (!json.isEmpty(refs), jarr)]

[h:'<!-- reading as an array again, saves time as json is parsed once -->']
[h: names = json.path.read(jarr, "*[?(@.type=='effect' && @.ref)].ref", "ALWAYS_RETURN_LIST, SUPPRESS_EXCEPTIONS")]
[h: preFxDb = "{}"]
[h: len = json.length(names)]

[h: '<!-- todo: shouldn we assume that most effects won_t have the same name? -->']
[h, for (i,0, len), code: {

	[name = json.get(names, i)]
	[if (!json.contains(preFxDb, name)): preFxDb = json.set(preFxDb, name, json.get(effect.get(name),0))]
	[jarr = json.path.set(jarr, json.get(refs, i), json.get(preFxDb, name))]
}]

[h: macro.return = jarr]

