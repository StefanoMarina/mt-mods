[h: assert( isGM(), "Sorry, score to table binding requires GM access")]

[h: modData = getLibProperty("binds")]
[h, if (json.type(modData)!="ARRAY"): modData = "[]"]
[h: tables = getTableNames()]

[h: dbase = "[]"]

[h, foreach (tab, tables), code: {
  [binds = json.path.read(modData, strformat("*[?(@.table == '%{tab}')]"), "ALWAYS_RETURN_LIST")]
  [dbase = json.append(dbase, json.set("{}", "tab", tab, "binds", json.toList(binds)))]
}]

[h: len = listCount(tables)]

[dialog5("Score bind", "title=Score bind; width=600; height=300; title=Score bind editor; input=1"): {
<html>
<head>[r, macro("printCSS@"+getMacroLocation()):""]</head>
<body>
	<p><small>Enter properties that will be bound to a table in the text field, with comma, i.e. "STR, DEX, CON."</small></p>
	<p><small>Please remember that json parsing is <b>case sensitive</b>.</small></p>
	<form method="JSON" action="[r: macroLinkText('bindScoresUpdate@'+getMacroLocation(), 'self')]">
	<table style="width: 100%">
		[h: firstTable = listGet(tables, 0)]
		[r, for (index, 0, len, 1, ""), code: {
			[h: tab = listGet(tables, index)]
			[h: binds = json.toList (json.path.read(modData, strformat("*[?(@.table == '%{tab}')].prop"), "ALWAYS_RETURN_LIST"))]
			[h: tabInputName = replace(tab, "[^\\w\\d]","_")]
			<tr><td> 
				<label>[r:tab]</label>
			</td>
			<td><input name="{tabInputName}-binds" value="{binds}"></td>
			</tr>
		}]
	</table>
	<div style="text-align:center"><button type="submit" name="submit" value="Submit">Submit</button></div>
	</form>
</body>
</html>
}]
