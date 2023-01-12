[h: assert(isGM(), "Sorry, only gm may open this window!")]

[h: '<!-- this is data model version, not library version -->']
[h:fullObj = "{'version': '1.0'}"]

[h: vars = "binds, cssList, supportedRolls,forceString,forceSortMethod,groupsList,cssOnly,effectsDB,extraEffectProperties,extraModProperties"]

[h, foreach (var, vars): fullObj = json.set(fullObj, var, getLibProperty(var))]

[dialog("Database IO", "width=480; height=480; input=1"): {
<html>
<head>
<style> [r: '
	p {font-size: 10px}
	']
</style>
</head>	
<body>
<h2>Mod Database</h2>
<p><b>Save</b>: Copy and paste into a .json file the content of the text area and press <i>Close</i>.</p>
<p><b>Load</b>: Copy and paste the content of a .json file into the text area and press <i>Import</i>.</p>
<hr/>
<p>Note: when importing, be sure no extra white space (like tabs, newlines) are present. Linearize the json object.</p>
<form method="JSON" action="[r: macroLinkText('openDatabaseUpdate@this','self')]">
	<div style="width: 100%; text-align: center">
		<input type="submit" name="close" value="Close">
	<input type="submit" name="import" value="Import">
	</div>
	<div style="width:100%; padding: px">
	<textarea name="rawjson" style="width:100%; border: 1px solid black; " rows="40" cols="80" >[r: string (fullObj) ]</textarea>
	</div>
</form>
</body>
</html>
}]
