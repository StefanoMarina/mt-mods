[h, if (argCount()>1): state = arg(1); state = ""]
[h, if (argCount()>2): fxes = arg(2); fxes = "[]"]
[h, if (argCount()>3): group = arg(3); group = ""]

[h, switch (json.type(fxes)):
	case "UNKNOWN" : fxes = "[]";
	case "OBJECT" : fxes = json.append("[]", fxes);
	default: "" ]

[h: macro.return = json.set("{}",
	"type", "effect",
	"group", group,
	"name", arg(0),
	"state", state,
	"effects", fxes)
]
