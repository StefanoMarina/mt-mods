[h: jarr = effect.resolve(arg(0))]

[h: modName = arg(1)]
[h, if (argCount()>2): modType = arg(2); modType = "all"]
[h, if (argCount()>3): otherwise = arg(3); otherwise = 0]

[h: '<!-- assert valid type -->']
[h: modList = replace( string( json.fromList(modType)), "\\x{00022}", "'") ]
[h, if (listContains(modType, "all")): query= "@.type != 'score'"; query = "@.type in %{modList}"]
[h: query= strformat(query)]

[h: propQuery= strformat(".[?(@.property in ['all','%{modName}'] && %{query})]")]

[h: '<!- retrieve all valid mods -->']
[h: propMods = json.path.read(jarr, "*"+propQuery, "ALWAYS_RETURN_LIST")]
[h: fxMods = json.path.read(jarr, strformat("*.effects.*%{propQuery}"), "ALWAYS_RETURN_LIST")]
[h: macro.return = json.merge(propMods, fxMods)]