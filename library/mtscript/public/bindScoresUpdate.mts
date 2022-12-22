[h: args = macro.args]
[h: tables = getTableNames()]

[h: newBindTable = "[]"]

[h, foreach (tab, tables), code: {
	[tabInputName = replace(tab, "[^\\w\\d]","_")]
	[tabValue = json.get(args, strformat("%{tabInputName}-binds"))]
	[if (tabValue != ""), code : {
		[foreach (prop, tabValue): newBindTable = json.append(newBindTable, json.set("{}", "prop", prop, "table", tab))]
	}]
}]

[h: setLibProperty("binds", newBindTable)]

[r, g: "Updated binds."]