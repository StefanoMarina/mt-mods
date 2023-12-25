[h: vars = "cssList, defModProperty, supportedRolls, cssOnly, groupsList, forceString, forceSortMethod, extraEffectProperties, extraModProperties"]

[h: jobj = "{}"]
[h: location = getMacroLocation()]

[h, foreach (v, vars): jobj = json.set(jobj, v, getLibProperty(v))]

[h: json.toVars(jobj, "")]

[h: PTAG= "<p style='width: 400px'>"]
[h: OTAG= "<p style='width: 400px margin-bottom:5px'>"]

[h: welcomeTab = strformat("jnk|<html><h2>Welcome</h2>%{ptag}Welcome to <i>Mod</i> additional component.</p>"
+ "%{ptag}Please go through all of the tabs and set the component's requirements.</p>"
+ "%{ptag}Remember, you can always all <i>mod.configure()</i> to reopen this panel.</p>"
+ "%{ptag}You can actually keep all the defaults. See README.md on the git page for more info.</p>"
+"<h3>Check out the <i>Configuration</i> tab and start customizing!</h3>"
+"<p>Also, check out mod.openDB to import-export your campaign data.</p>|-|LABEL|SPAN=TRUE")]

[h: cssTab = strformat( "jnkTitle|<html><h4>CSS</h4>" +
	"%{ptag}Here graphic options are set. You may leave the defaults.</p>" +
	"%{ptag}Add any macro in <i>macro@location</i> form as a <i>,</i> list for CSS link|-|LABEL|SPAN=TRUE ## " +
	"cssList|"+cssList+"|CSS List|TEXT ## " +
	"cssOnly|"+cssOnly+"|<html>Use internal CSS (suggested)|CHECK"
)]

[h: bindTab = strformat("jnkTitle|<html><h3>Property behaviour</h3>"+
"%{otag}You may select how to handle certain behaviours from buff stacking here.</p>||LABEL|SPAN=TRUE##"+
"forceString|%{forceString}|Always return an expression instead of value|CHECK##"+
"forceSortMethod|A+,A-,N-|Sort force multiple values|RADIO|ORIENT=H SELECT=%d ##" +
"defModProperty|%{defModProperty}|<html>Default property##"+
"jnk|<html>%{ptag}<small>(Default property works on interface and getModProperty only, please ensure is <code>[]</code> by default)||LABEL|SPAN=TRUE##"+
"jnkTitle2|<html><h3>Effect groups</h3>"+
"%{ptag}Groups allow easy searching and classification of effects, i.e. <i>Combat</i> or <i>Spells</i>. Add groups as a comma separated list. <i>all</i> is reserved|-|LABEL|SPAN=TRUE ##" +
"groupsList|%{groupsList}|Groups|TEXT"
, listFind("A+,A-,N-", forceSortMethod))]

[h: rollTab = strformat("jnkTitle|<html><h3>Supported rolls</h3>" +
"%{ptag}Roll scopes are roll types, used to discriminate between buffs (+1 to check is not +1 to score)</p>"+
"%{ptag}<i>all</i> and <i>score</i> are reserved keywords.||LABEL|SPAN=TRUE ## " +
"supportedRolls|"+supportedRolls+"|Supported rolls|TEXT"
)]

[h: advancedTab= strformat("jnkTitle|<html><h3>Extra fields</h3>"+
"%{ptag}You may set extra json fields for effects and mods here. <b>All keys must be lower case and without spaces</b>.</p>||LABEL|SPAN=TRUE##"+
"extraEffectProperties|%{extraEffectProperties}|Extra effect keys##"+
"extraModProperties|%{extraModProperties}|Extra mod keys##"
)]

[h: abort ( input (
	"tab0|WELCOME||TAB", welcomeTab,
	"tab1|Configuration||TAB", bindTab+"##"+rollTab,
	"tab2|Look & Feel||TAB", cssTab,
	"tab3|Advanced||TAB", advancedTab
) ) ]


[h: jobj = json.merge(jobj, json.fromStrProp(tab0 , "##"), json.fromStrProp(tab1, "##"),
	json.fromStrProp(tab2, "##"),json.fromStrProp(tab3, "##") )]
	
[h: jobj = json.remove(jobj, "")]
[h: jobj= json.set(jobj, "forceSortMethod", listGet("A+,A-,N-", forceSortMethod))]

[h, foreach(txtVar, "cssList,extraModProperties,extraEffectProperties"), 
	if (json.get(jobj,txtVar)==0): jobj = json.set(jobj, txtVar,""); jobj = json.set(jobj, txtVar,eval(txtVar))
]

[h, foreach (v, vars): setLibProperty(v, json.get(jobj, v))]
