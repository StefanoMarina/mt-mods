
[h: args = macro.args]
[h: tokenID = json.get(args, "tokenID")]
[h: property = json.get(args, "property")]

[h, if (tokenID == '##renew##'): tokenID = getTokenNames(",", json.set("{}", "owned", if (isGM(), "any", "self"), "selected", 1 ))]

[h, if (tokenID == ""), code: {
	[closeDialog("modConfigure")]
	[abort(0)]
}]


[h: access = lower(json.get(args, "access"))]

[h, if (access == "add-group"):
	libFxNames = json.path.read( effect.group (json.get(args, "group") ), "*.name", "ALWAYS_RETURN_LIST");
	libFxNames = if (access != "view-only", json.path.read(getLibProperty("effectsDB"), "*.name", "ALWAYS_RETURN_LIST"),
		"[]")
]

[h: fxes = "[]"]

[h, foreach (tk, tokenID): fxes = json.union(fxes, json.getSafe(getProperty(property, tk), "ARRAY"))]
[h: fxnames = json.path.read(fxes, "*[?(@.type == 'effect')].name", "ALWAYS_RETURN_LIST")]

[h: fxdata = "{}"]
[h: fxnames = json.unique(fxnames)]

[h: fxes = effect.resolve(fxes)]

[h, foreach (fxentry, fxnames), code: {
	[fxelements = json.path.read(fxes, strformat("*[?(@.type == 'effect' && @.name == '%{fxentry}')].effects.*"), "ALWAYS_RETURN_LIST")]
	[fxtext = ""]
	[foreach (fxelem, fxelements): fxtext = fxtext + strformat("%s%s",
		if (json.indexOf(fxelements, fxelem) == 0, "", ", "),
		mod.toString(fxelem)
	)]
	[fxdata = json.set(fxdata, fxentry, fxtext)]
}]

[dialog5("modConfigure", "title="+json.get(args, "title")+"; width=600; height=400; input = 1"): {

<html>
<head>
    <link rel="onChangeSelection" type="macro" href="[r: macroLinkText('effectsTokenManager@'+getMacroLocation(), 'all', json.set(args, 'tokenID', '##renew##'))]">

	[r, macro("printCSS@"+getMacroLocation()):""]
	
	<style>
	[r, if (getLibProperty("cssOnly") != 0): strformat('
			.table { width: 100% }
			.lt-cell-20 {width: 20%}
			.lt-cell-30 {width: 20%}
			.lt-cell-70 {width: 70%}
			.lt-cell-80 {width: 80%}
			.btn {min-width: 10% }
			h1, h3 {text-align:center}
			select {width: 80%;	padding: 5px 10px }
			'); ""]
	</style>

<script>
[r:'
	function onRadioSelection() {
		document.getElementById("btnRemove").disabled = false;
		document.getElementById("btnEdit").disabled = false;
	}
']
</script>
</head>
<body>
<h1>[r: json.get(args, "title")]</h1>
<h3>[r: tokenID]</h3>
<form method="JSON" action="[r:macroLinkText('etmUpdate@'+getMacroLocation())]">

	<input type="hidden" name="tokenid" value="[r:tokenID]">
	<input type="hidden" name="title" value="[r:json.get(args, 'title')]">
	<input type="hidden" name="property" value="[r:json.get(args, 'property')]">

	[r, if (access != "view-only"), code: {
	<div class="lt-container" style="text-align:center">
		<input class="btn" name="action" type="submit" value="Add">
		<input id="btnRemove" class="btn" name="action" type="submit" value="Remove" disabled>
		[r, if (access == "full"): strformat('
		<input class="btn" name="action" type="submit" value="Custom">
		<input id="btnEdit" class="btn" name="action" type="submit" value="Edit" disabled>
		'); ""]
	</div>
	<table class="lt-container">
	<tr>
		<td class="lt-cell-30"><h4>Add new effect</h4></td>
		<td class="lt-cell-70 formControl">
			<select style="width: 100%" name="add-effect">
				<option value="0" disabled default>Select an effect</option>
			[r, foreach (name, libFxnames, "</option>"): strformat("<option value='%{name}'>%{name}")]
			</select>
		</td>
	</tr>
	<tr>
	<td colspan="2"><label for="chkRef"><input name="addAsReference" id="chkRef" type="checkbox" value="1" checked>Add effect as reference</label></td>
	</tr>
	</table>
	};{}]
	
	<table class="table">
	[r, foreach (entry, fxdata, ""), code: {
		<tr>
		<th><input onchange="onRadioSelection();" style="float:left" type="radio" name="effect" value="[r: entry]"></th>
		<th class="lt-cell-20"><label>[r: entry]</label></th>
		<td class="lt-cell-80"><em>[r: json.get(fxdata, entry)]</em></td>
		</tr>
	}]
	</table>
</form>
</body>
}]
