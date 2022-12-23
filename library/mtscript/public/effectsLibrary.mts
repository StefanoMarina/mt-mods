[h: allEffects = getLibProperty("effectsDB")]
[h, if (allEffects == ""): allEffects = "[]"]

[h: selection = -1]

[h, if (json.length(allEffects) >0), code: {
	[actionQuery = 	"action|Create new effect, Edit an effect, Remove an effect|Select action|RADIO"]
	
	[fxQuery = "selection|"+json.toList(json.path.read(allEffects, "*.name")) + "|Edit/Remove Effect|LIST"]
}; {
	[actionQuery = 	"action|Create new effect|Select action|RADIO"]
	[fxQuery ="jnk|<html><i>No effects available</i>.||LABEL|SPAN=TRUE"]	
}]
[h: abort (input("jnk|<html><b>What do you want to do?||LABEL|SPAN=TRUE",actionQuery,fxQuery) )]


[h, switch (action), code:
	case 0: {
		[effect = json.set("{}", "name", "new effect", "type", "effect", "effects", "[]")]
		[macro("effectEditor@"+getMacroLocation()): json.set("{}", "effect", effect, "tokenID", "##lib##")]
	};
	case 1: {
		[effect = json.get(allEffects, selection)]
		[macro("effectEditor@"+getMacroLocation()): json.set("{}", "effect", effect, "replaces", selection,
			"tokenID", "##lib##")]
	};
	case 2: {
		[assert (selection > -1, "No effect available.")]
		[setLibProperty("effectsDB", json.remove(allEffects, selection))]
	};
	default: {}
]
