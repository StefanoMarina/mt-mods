[h: argument = arg(0)]
[h: argType = json.type(argument)]

[h, if (json.type(argument)=="ARRAY"  && argCount()>1): index = arg(1); index = -1]
[h: action = -1]

[h, switch (argType), code: 
	case "ARRAY" : {
		[if (index == -1), code: {
			[h: modList = ""]
			[h, foreach (mod, argument): modList = listAppend(modList, mod.toString(mod))]
		
			[abort ( input (
				strformat("index|%{modList}|Mod|RADIO"),
				"action|Change this mod, Remove the mod, Add a new mod|Action|RADIO"
			) )]
		
			[h, switch (action):
				case 0: mod = json.get(argument, index);
				case 1: mod = "remove";
				case 2: mod = mod.set("", "Prop", 1)
			]
		
			[h: return (mod != "remove", json.remove(argument, index))]
		}; {
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

[h: abort ( input (
	strformat("modproperty|%{modproperty}|Property"),
	strformat("modvalue|%{modvalue}|Value"),
	strformat("modtype|%{list}|Type|LIST|VALUE=STRING SELECT=%d", listFind(list, modtype))
	) )]

[h: mod = json.set(mod, "property", modproperty, "type", modtype, "value", modvalue)]

[h, if (argType == "ARRAY"):
	macro.return = if (action == 2, json.append(argument, mod), json.set(argument, index, mod));
	macro.return = mod
]