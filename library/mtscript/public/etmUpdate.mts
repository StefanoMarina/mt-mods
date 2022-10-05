[h: args = macro.args]
[h: json.toVars(macro.args, "")]

[h, switch (action), code:
	case "Add" : {
		[h: fxname = json.get(args, "add-effect")]
		[h: assert(fxname != "0", "Not an effect.")]
		
		[h, if (json.contains(args, "addAsReference")): fxname = effect.asReference(fxname)]
		
		[h, foreach (tok, tokenID): mod.setEffect(fxname, 1, property, tok)]

		[h:  broadcast(strformat("<p>%s added %s to %{tokenID}.</p>", getPlayerName(),
		if (json.type(fxname)=="OBJECT", json.get(fxname,"name"), fxname )), "gm-self")]
	
		[macro("effectsTokenManager@this"): args]
	};
	case "Custom": {
		[h: effect = effect.new("new custom effect")]
		[macro("effectEditor@this"): json.set(args, "tokenID", tokenID, "editMode", 0, "effect", effect)]
	};
	case "Edit": {
		[h: allEffects = "[]"]
		[h, foreach (tok, tokenid):	
			allEffects = if (json.length(allEffects)==0, 
			json.path.read ( if (hasProperty(property, tok),
								getProperty(property, tok),
								"[]"),
							strformat("*[?(@.type=='effect' && @.name=='%{effect}')]"), "ALWAYS_RETURN_LIST"),
			allEffects)]
		[h: assert(json.length(allEffects)>0, "Could not find " + effect)]
		[h: effect = json.get(allEffects, 0)]
		
		[macro("effectEditor@this"): json.set(args, "disableName", 1, "replaces",json.get(effect,"name"),  "tokenID", tokenid, "effect", effect)]
	};
	case "Remove" :	 {
		[h, foreach (tok, tokenID): mod.setEffect(effect, 0, property, tok)]
		[h:  broadcast(strformat("<p>%s removed effect %{effect} on %{tokenID}.</p>", getPlayerName()), "gm-self")]
		[macro("effectsTokenManager@"+getMacroLocation()): args]
	};
	default: {}
]

