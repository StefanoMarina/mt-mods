[h: args = macro.args]
[h: abort (json.get(args, "submit" ) != "cancel")]

[h: replaces = if (json.contains(args, "replaces"), json.get(args, "replaces"), -1)]

[h: fxes = "[]"]
[h, count(10): fxes = mod.set(fxes,
	json.get(args, "prop-"+roll.count),
	json.get(args, "value-"+roll.count),
	json.get(args, "type-"+roll.count),
	0
)]

[h: '<!-- cleanse empty values -->']
[h: fxes = json.path.read(fxes, "*[?(!@.property != '' && @.value != 0)]")]
[h: assert(json.length(fxes)>0, "You have not selected a valid property buff!")]

[h: effect = effect.new(json.get(args, "name"), 
	if (json.contains(args, "state-bind") && json.get(args, "state-bind") != "",
		json.get(args, "state-bind"), ""),
		fxes,
		json.get(args, "group")
		)]

[h: target = json.get(args, "tokenID")]

[r, if (target == "##lib##"), code: {
	
	[h: allEffects = getLibProperty("effectsDB", getMacroLocation())]
	[h, if (allEffects == ""): allEffects = "[]"]
	[h: arrayNames = json.path.read(allEffects, "*.name", "ALWAYS_RETURN_LIST")]
	[h: nameIndex = json.indexOf(arrayNames, json.get(effect, "name"))]
	[h: exists = and (nameIndex > 1, nameIndex != replaces)]

	[h, if (exists): res = input("jnk|"+json.get(effect, "name")+" exists! overwrite?||LABEL|SPAN=TRUE"); res = 1]

	[h, if (!res), code: {
		[macro("effectEditor@this"): json.set(effect, "tokenID", tokenID)]
		[abort(0)]
	}]

	[h, if (res && exists): replaces = nameIndex]
	[if (replaces <0):
		allEffects= json.append(allEffects, effect);
		allEffects= json.set(allEffects, replaces, effect)
	]
	
	[h: setLibProperty("effectsDB", allEffects)]
};{
	[h: '<!-- token custom effect -->']
	[h: overWriteAll = if (replaces == "", 0, 1)]
	[h: property = json.get(args, "property")]

	[h: '<!-- name replace disabled -->']
	[h:	fxName = json.get(args, "name")]

	[h: spreadList= ""]
	[r, foreach (tok, target, ""), code: {
		[allEffects = json.getSafe( getProperty(property, tok), "ARRAY") ]
		[h: contains = effect.contains(allEffects, fxName)]

		[h, if ( contains && !overWriteAll) : res = input(
				"jnk|"+json.get(effect, "name")+" exists in "+tok+"! overwrite?||LABEL|SPAN=TRUE",
				"overWriteAll|"+overWriteAll+"|Overwrite All|CHECK"
		); res = 1]

		[h, if (contains) :	
			allEffects = effect.add(allEffects, effect, res);
			spreadList = listAppend(spreadList, tok)
		]
		
		[h: setProperty(property, allEffects, tok)]
		[r, g, if (contains): "<p>Edited effect for " + tok + "</p>"]
	}]

	[h: spread = listCount(spreadList)]
	
	[h, if (spread > 0): res = input (
			strformat("jnk|<html>%{spread} tokens do not have this effect. Spread the effect to them?<br/>This will replace other fx with the same name!|-|LABEL|SPAN=TRUE") ) ;
		res = 0]

	[h, if (res == 1), code: {
		[foreach (tok, spreadList, ""): mod.setEffect(effect, 1, property, tok)]
	}]
}]
