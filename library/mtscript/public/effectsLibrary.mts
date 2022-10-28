[h: allEffects = getLibProperty("effectsDB")]
[h, if (allEffects == ""): allEffects = "[]"]

[h: selection = -1]

[h: list = "Create new effect,Edit an effect,Remove an effect"]

[h, if (json.length(allEffects) >0), code: {
	[fxQuery = "selection|"+json.toList(json.path.read(allEffects, "*.name")) + "|Edit/Remove Effect|LIST"]
};{
	[fxQuery ="jnk|<html><i>No effects in the database found.</i>||LABEL|SPAN=TRUE"]
	[list = listGet(list,0)]
}]


[h: res = input(
	"jnk|<html><b>What do you want to do?||LABEL|SPAN=TRUE",
	strformat("action|%{list}|Select action|RADIO|VALUE=STRING"),
	fxQuery)
]

[h: abort(res)]

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
	default: {}
]

