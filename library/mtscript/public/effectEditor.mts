[h: args = macro.args]
[h: json.toVars(args, "")]

[h, if (!json.contains(args, "effect")): effect = effect.new("New effect")]
[h, if (!json.contains(args, "tokenID")): tokenID ="##lib##"]

[h: rollTypes = listAppend("all, score", getLibProperty("supportedRolls"))]
[h: statesList = mod.pvt.getAvailableStates()]

[h, if (listCount(statesList)>0): 
	htmlStatesOptions = "<option default selected value=''>Select a state</option>"+listFormat(statesList, "%list", "<option value='%item'>%item</option>","");
	htmlStatesOptions  = ""
]

[h, if (rollTypes == ""), code: {
  [macro("Configure@this"): ""]
  [abort(0)]
}]

[h: OPTIONLIST = listFormat(rollTypes, "%list", "<option value='%item'>%item</option>","")]
[h: eventLink = macroLinkText("effectEditorUpdate@this")]

[h: extras = getLibProperty("extraEffectProperties")]
[h: modExtras = getLibProperty("extraModProperties")]
[h, if (modExtras != ""): pureObj = json.fromStrProp(replace(modExtras, ",", "=0;")+"=0"); pureObj = "{}"]

[dialog5("Effect editor", "width=600; height=450; title=Effect editor;input=1"):{
<html>
	<head>
	[r, macro("printCSS@this"()):""]
	[r, if (getLibProperty("cssOnly") != 0): '
	<style>
		
		input { background-color: transparent; border: none; border-bottom: 1px solid black; width: 100%; padding: 3px; margin: 0 }
		p {font-size: 12;}
		.hidden {display: none}
		table {border-collapse: collapse;}
		table tr:nth-child(even) {background-color: white}
		table tr:nth-child(odd) {background-color: lightgray}
	
		#effectsTable input, select {border: none; width: 100%; padding: 3px; }
		.footbar { text-align: center }
		.footbar button {width: 25%; margin: 2%}

		.hidden {display: none !important}
		.lt-container {width: 100%}

		#extrasTable {border: 1px solid gray; width: 100%; margin-top: 5px; margin-bottom: 5px}
		#extrasTable label {font-weight: bold; font-size: 14px; font-variant: small-caps }
	</style>
	'; '']

	<style>
	[r, if (modExtras == ""): '
		#effectsTable th:nth-child(4), #effectsTable td:nth-child(4) { display: none !important}
	';'']
	</style>
	
	<script>
	[r: '
	function showHelp(val) {
		if (val) {
			document.getElementById("table").classList.add("hidden");
			document.getElementById("help").classList.remove("hidden");
		} else {
			document.getElementById("table").classList.remove("hidden");
			document.getElementById("help").classList.add("hidden");
		}
	}
	
	function log(msg) {document.getElementById("log").innerHTML = msg;}
	']
	</script>
	</head>
	<body>
			<div id="table" style="">
	<form method="JSON" action="{eventLink}">
		<input type="hidden" name="tokenID" value="[r: tokenID]">
		
	[r, if (json.contains(args, "property")): strformat( "<input type='hidden' name='property' value='%s'>", json.get(args, "property")) ; ""]
		
	[r, if (json.contains(args, "replaces")): strformat("<input type='hidden' name='replaces' value='%s'>", string(json.get(args, "replaces")));""]
		<p id="log"></p>

		<!-- NAMES &amp; STUFF -->
		[r, if (statesList != ""), code: {
		  <table class="table lt-container">
			  <th>Effect name</th>
			  <td>
			  	<input 
			  		[r, if (json.contains(args, "disableName")): " disabled "; ""]
				  	name="name" value="[r: json.get(effect, 'name')]" placeholder="Effect name..." style="width:100%">
	  		  </td>
			  <th>State bind</th>
			  <td>
			  <select name="state-bind">
			  	[r, if (json.contains(effect, "state")):
			  		replace(htmlStatesOptions, strformat("value='%s'", 
			  			json.get(effect, "state")), 
			  			strformat("value='%s' selected", json.get(effect, "state"))
			  			);
			  		htmlStatesOptions
			  	]
			  	</select>
			  </td>
			  <th>Group</th>
			  <td>
			  [h: groupsList = getLibProperty("groupsList")]
			  <select name="group" [r, if (listCount(groupsList)==0): "class='hidden'" ; ""]>
			  	<option default value="">all</option>
				  [r, foreach (group, groupsList, ""): strformat(
				  		"<option value='%{group}' %s>%{group}</option>",
				  		if (group==json.get(effect, "group"), "selected", "")
				  		)]
			  	</select>
			  	<p class="[r, if (listCount(groupsList)<=0): ''; 'hidden']">No groups yet.</p>
			  </td>
		  </table>
		};{
		<div>
			<label>Input effect name</label>
			<input name="name" value="[r: json.get(effect, 'name')]" placeholder="Effect name...">
		</div>
		}]
		<!-- EXTRA FIELDS -->
		[r, if (extras != ""), code: {
			<table class="table" id="extrasTable">
				<tr>
				
				[r, foreach (ex, extras, ""): strformat('<td>
					<label>%{ex}</label></td>
					<td><input type="text" name="ex-%{ex}" value="%s"></td>
					%s
				', 
				json.get(effect, ex),
				if ( math.mod( (listFind(extras, ex)+1), 4) == 0, "</tr><tr>","")
				)]
				</tr>
				</table>

		};{}]

		<!-- MOD LIST -->
			<table class="table" id="effectsTable" style="width:100%; overflow-y: auto; height: 300px; margin-top: 10px">
			<thead>
				<th>Property</th>
				<th style="min-width: 15%">Roll type</th>
				<th>Mod</th>
				[r, foreach(modEx, modExtras,""): strformat("<th>%s</th>", capitalize(modEx))]
			</thead>
			<tbody>
			[h: effectsData = json.get(effect, "effects")]
			[h: len = json.length(effectsData)]
			
			[r, for (index, 0, len+(10-len), 1, ""), code: {
				[h, if (index < len): 
					element =  json.get(effectsData, index);
					element = json.set("{}", "property", "", "type", "", "value","")
				]
				[h: eltype = json.get(element, "type")]
				[h: stbind = if (json.contains(element, "statebind"), json.get(element, "statebind"), "")]
				
				<tr>
					<td><input type="text" name="prop-{index}" value="{json.get(element, 'property')}" placeholder="Enter 'all' or property"></td>
					<td>
						<select name="type-{index}" value="{eltype}">
						[r, if (eltype == ""): OPTIONLIST; replace(OPTIONLIST, strformat("'%{eltype}'>"), strformat("'%{eltype}' selected='selected'>")) ]
						</select>
		
					</td>
					<td><input type="text" name="value-{index}" value="{json.get(element, 'value')}" placeholder="0"></td>

					[r, foreach (modEx, modExtras): strformat("<td><input type='text' name='%{modEx}-%{index}' value='%s' placeholder='-'></td>",
					if (json.contains(element, modEx), json.get(element,modEx), "") )]
				</tr>
			}]
			</tbody>
			</table>
			<div class="footbar">
				<button class="btn" type="button" onclick="showHelp(1)" href="#">Help</button>
				<button class="btn" type="submit" value="submit" name="submit">OK</button>
				<button class="btn" type="submit" value="cancel" name="submit">Cancel</button>
			</div>
		</form>
		</div>
				
		<div id="help" class="hidden">
			<h2>Help</h2>
			<ul>
				<li><em>Effect Name</em>: the effect&#39;s name. case sensitive!</li>
				<li><em>State</em> : bind this effect to a state. call <code>mod.configure()</code> and set some state if you don&#39;t see this.</li>
			</ul>
			<p>As for the table:</p>
			<ul>
			<li><em>Property</em>: either one of a list (comma-separated) of token properties. Use <em>all</em> as a wildcard.</li>
			<li><em>Roll type</em>: specify a roll type, <em>score</em> for raw scores and  <em>all</em> for a wildcard. see <code>mod.configure()</code> to customize the list;</li>
			<li><em>Value</em> : a numeric, non-zero value. 0 will remove the mod.</li>
			</ul>
			<p>
				<button type="button" onclick="showHelp(0)" href="#">Close help</button>
			</p>
		</div>
	</body>
</html>
}]
