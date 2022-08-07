[h: mod = arg(0)]

[h: macro.return = strformat("%+d to %s %s",
	json.get(mod, "value"),
	json.get(mod, "property"),
	if (!listContains("all, score", json.get(mod, "type")), 
		json.get(mod, "type") + "s", "")
		)]

		