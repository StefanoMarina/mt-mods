[h: jarr = effect.resolve(arg(0))]

[h: modName = arg(1)]
[h, if (argCount()>2): modType = arg(2); modType = "all"]
[h, if (argCount()>3): otherwise = arg(3); otherwise = 0]

[h: '<!-- assert valid type -->']
[h: modList = replace( string( json.fromList(modType)), "\\x{00022}", "'") ]
[h, if (listContains(modType, "all")): query= "@.type != 'score'"; query = "@.type in %{modList}"]
[h: query= strformat(query)]

[h: '<!-- if mod type is "all", disable "all" for property name, otherwise everything is added -->']
[h, if (modType == "all"): 
	propertyQuery = "==  '%{modName}'";
	propertyQuery = "in ['all','%{modName}']"
]
[h: propertyQuery = strformat(propertyQuery)]

[h: query= strformat(".[?(@.property %{propertyQuery} && %{query})]")]

[h: '<!- retrieve all valid mods -->']
[h: propMods = json.path.read(jarr, "*"+query, "ALWAYS_RETURN_LIST")]
[h: fxMods = json.path.read(jarr, strformat("*.effects.*%{query}"), "ALWAYS_RETURN_LIST")]
[h: macro.return = json.merge(propMods, fxMods)]