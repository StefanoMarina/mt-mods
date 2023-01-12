[h: jarr = arg(0)]
[h, if (argCount()>1): database = arg(1); database = getLibProperty("effectsDB", getMacroLocation())]

[h, if (json.type(jarr)=="ARRAY"), code: {
	[h: refs = json.path.read(jarr, "*[?(@.type=='effect' && @.ref)]", "ALWAYS_RETURN_LIST, AS_PATH_LIST, SUPPRESS_EXCEPTIONS")]
	[h: return (!json.isEmpty(refs), jarr)]
	
	[h:'<!-- reading as an array again, saves time as json is parsed once -->']
	[h: names = json.path.read(jarr, "*[?(@.type=='effect' && @.ref)].ref", "ALWAYS_RETURN_LIST, SUPPRESS_EXCEPTIONS")]
	[h: preFxDb = "{}"]
	[h: len = json.length(names)]
	
	[h: return (len > 0, jarr)]

	[h: '<!-- purge database and turn it into a map -->']
	[h: lintList = json.unique(names)]
	[h: database = json.path.read( database, strformat("*[?(@.type == 'effect' && @.name in %{lintList})]"), "ALWAYS_RETURN_LIST")]
	[h, foreach (entry, database): preFxDb= json.set(preFxDb, json.get(entry, "name"), entry)]

	[h, for (i,0, len), code: {
		[name = json.get(names, i)]
		[if (json.contains(preFxDb, name)):
			jarr = json.path.set(jarr, json.get(refs, i), json.get(preFxDb, name)) ;
			log.warn("effect.resolve: Warning! cannot find reference to effect '" + name +"'")
		]
	}]
	[h: macro.return = jarr]
};{
	[h, if (json.contains(jarr, "ref")):
 		macro.return = effect.get(json.get(jarr, "ref"), 0, database);
 		macro.return = jarr
 	]
}]


