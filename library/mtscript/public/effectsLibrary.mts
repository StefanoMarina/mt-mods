[h: allEffects = getLibProperty("effectsDB")]
[h, if (allEffects == ""): allEffects = "[]"]

[h: selection = -1]

[h, if (json.length(allEffects) >0), code: {
	[actionQuery = "Create new effect, Edit an effect, Remove an effect"]
	[fxQuery = "selection|"+json.toList(json.path.read(allEffects, "*.name")) + "|Edit/Remove Effect|LIST"]
}; {
	[actionQuery = 	"Create new effect"]
	[fxQuery ="jnk|<html><i>No effects available</i>.||LABEL|SPAN=TRUE"]	
}]

[h: actionQuery= listAppend(actionQuery, "Configure Lib:Mod,Import/Export database")]
	
[h: abort (input("jnk|<html><b>What do you want to do?||LABEL|SPAN=TRUE",strformat("action|%{actionQuery}|Select action|RADIO|VALUE=STRING"),fxQuery) )]


[h, switch (action), code:
	case "Create new effect": {
		[effect = json.set("{}", "name", "new effect", "type", "effect", "effects", "[]")]
		[macro("effectEditor@"+getMacroLocation()): json.set("{}", "effect", effect, "tokenID", "##lib##")]
	};
	case "Edit an effect": {
		[effect = json.get(allEffects, selection)]
		[macro("effectEditor@"+getMacroLocation()): json.set("{}", "effect", effect, "replaces", selection,
			"tokenID", "##lib##")]
	};
	case "Remove an effect": {
		[assert (selection > -1, "No effect available.")]
		[setLibProperty("effectsDB", json.remove(allEffects, selection))]
	};
	case "Configure Lib:Mod": {
		[mod.configure()]
	};
	case "Import/Export database": {
		[mod.openDB()]
	};
	default: {}
]
