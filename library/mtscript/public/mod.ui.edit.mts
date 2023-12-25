[h: argument = arg(0)]
[h: argType = json.type(argument)]

[h, if (json.type(argument)=="ARRAY"  && argCount()>1): 
	index = arg(1); 
	index = -1
]
	
[h: action = -1]

[h, switch (argType), code: 
	case "ARRAY" : {
		[arrayLen = json.length(argument)]
		[indexList = "[]"]
		
		[for (i,0, arrayLen), code: {
			[mod = json.get(argument, i)]
			[if (isMod(mod)==1): indexList = json.append(indexList, i)]
		}]
	
		[if (index == -1), code: {
			[requestType="visual"]
			[h: modList = ""]
			[h, foreach (index, indexList): modList = listAppend(modList, mod.toString(json.get(argument, index)))]

			[abort ( input (
				if (modList != "",
					strformat("index|%{modList}|Mod|RADIO"),
					"jnk|<html><i>No direct mod present.</i>||LABEL|SPAN=TRUE"
				),
				if (modList != "",
					"action|Add a new mod, Change this mod, Remove this mod,Remove all mods|Action|RADIO|VALUE=STRING",
					"action|Add a new mod|Action|RADIO|VALUE=STRING"
				)
			) )]

			
			[h, switch (action):
				case "Change this mod": mod = json.get(argument, json.get(indexList,index));
				case "Remove this mod": mod = "remove";
				case "Add a new mod": mod = mod.set("", "Prop", 1);
				case "Remove all mods": mod = "removeall";
			]
		
			[h, if (mod == "remove"): return (0, json.remove(argument, json.get(indexList,index)))]

			[h:'<!-- removeall -->']
			[h: purgeList ="[]"]
			[h, if (mod == "removeall"), foreach (elem, argument):  
				purgeList = if (json.contains(indexList,json.indexOf(argument,elem)),
							purgeList, json.append(purgeList, elem) 
			)]
			
			[h: return ( mod != "removeall", purgeList)]
			
		}; {
			[requestType="direct"]
			[mod = json.get(argument, index)]
		}]
	};
	case "OBJECT": {
		[if (json.isEmpty(argument)): mod = mod.set("", "Prop", 1);
			mod = argument]
	}
]

[h: json.toVars(mod, "mod")]

[h: list = listAppend("all, score", getLibProperty("supportedRolls"))]
[h: extras = getLibProperty("extraModProperties")]
[h, if (extras != ""), code: {
	[exObj = "{}"]
	
	[foreach (ex, extras), if (json.contains(mod,ex)): 
		exObj =  json.set(exObj, ex, json.get(mod, ex));
		exObj = json.set(exObj, ex, 0) 
	]
	[extraField =strformat("exObj|%s|Extra fields|PROPS|TYPE=JSON SPAN=TRUE",
		json.toStrProp(exObj) )] 
	
};{
	[exObj = "{}"]
	[extraField = "jnk|<html>&nbsp;||LABEL|SPAN=TRUE"]
}]

[h: abort ( input (
	strformat("modproperty|%{modproperty}|Property"),
	strformat("modvalue|%{modvalue}|Value"),
	strformat("modtype|%{list}|Type|LIST|VALUE=STRING SELECT=%d", listFind(list, modtype)),
	extraField
	) )]

[h: mod = json.merge (exObj,
			json.set(mod, "property", modproperty, "type", modtype, "value", modvalue)
		)]


[h: return (argType == "ARRAY", mod)]

[h: '<!-- if a specific index was set, return immediately-->']
[h, if (requestType == "direct"):  return (0, json.set( argument, index, mod))]

[h, if (action == "Add a new mod"):
	macro.return = json.append(argument, mod);
	macro.return = json.set(argument, json.get(indexList,index), mod)]