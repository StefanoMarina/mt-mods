[h: vars = "statesList, cssList, supportedRolls, cssOnly, groupsList"]
[h: jobj = "{}"]
[h: location = getMacroLocation()]

[h, foreach (v, vars): jobj = json.set(jobj, v, getLibProperty(v))]

[h: json.toVars(jobj, "")]

[h: PTAG= "<p style='width: 350px'>"]

[h: welcomeTab = strformat("jnk|<html><h2>Welcome</h2>%{ptag}Welcome to <i>Mod</i> additional component.</p>"
+ "%{ptag}Please go through all of the tabs and set the component's requirements.</p>"
+ "%{ptag}Remember, you can always all <i>mod.configure()</i> to reopen this panel.</p>"
+ "%{ptag}The only part needed to change is the <i>States</i> part, otherwise you can keep all the defaults.</p>"
+ "%{ptag}See README.md on the git page for more info.</p>|-|LABEL|SPAN=TRUE")]

[h: cssTab = strformat( "jnkTitle|<html><h3>CSS</h3>" +
	"%{ptag}Here graphic options are set. You may leave the defaults.</p>" +
	"%{ptag}Add any macro in <i>macro@location</i> form as a <i>,</i> list for CSS link|-|LABEL|SPAN=TRUE ## " +
	"cssList|"+cssList+"|CSS List|TEXT ## " +
	"cssOnly|"+cssOnly+"|<html>Use internal CSS (suggested)|CHECK"
)]

[h: bindTab = strformat("jnkTitle|<html><h3>Effects</h3><h4>Binds</h4>" +
"%{ptag}To enable automatic state management, you have to write in a list <br>which state you want to be automated." +
"%{ptag}<i>all</i> and <i>score</i> are reserved keywords.|-|LABEL|SPAN=TRUE ## " +
"statesList|%{statesList}|States|TEXT ## " +
"jnkTitle2|<html><h4>Groups</h4>" +
"%{ptag}Groups allow easy searching and classification of effects, i.e. <i>Combat</i> or <i>Spells</i>. Add groups as a comma separated list. <i>all</i> is reserved|-|LABEL|SPAN=TRUE ##" +
"groupsList|%{groupsList}|Groups|TEXT"
)]

[h: rollTab = strformat("jnkTitle|<html><h3>Supported rolls</h3>" +
"%{ptag}Roll scopes are roll types, used to discriminate between buffs (+1 to check is not +1 to score)</p>"+
"%{ptag}<i>all</i> and <i>score</i> are reserved keywords.|-|LABEL|SPAN=TRUE ## " +
"supportedRolls|"+supportedRolls+"|Supported rolls|TEXT"
)]

[h: dbTAB = strformat("jnkTitle|<html><h3>Database</h3>" +
"%{ptag}Here you can export or import your configuration. This can be useful if you want to export your mods into a new campaign or a safe backup just in case.||LABEL|SPAN=TRUE ## " +
"action|Don't do anything, Open Database|Select|RADIO"
)]

[h: abort ( input (
	"tab0|WELCOME||TAB", welcomeTab,
	"tab1|CSS||TAB", cssTab,
	"tab2|Effects||TAB", bindTab,
	"tab3|Rolls||TAB", rollTab,
	"tab4|Data||TAB", dbTAB
) ) ]

[h: jobj = json.merge(jobj, json.fromStrProp(tab0 , "##"))]
[h: jobj = json.merge(jobj, json.fromStrProp(tab1, "##"))]
[h: jobj = json.merge(jobj, json.fromStrProp(tab2, "##"))]
[h: jobj = json.merge(jobj, json.fromStrProp(tab3, "##"))]

[h: jobj = json.remove(jobj, "")]
[h, if (cssList == 0): jobj = json.set(jobj, "cssList","")]

[h, foreach (v, vars): setLibProperty(v, json.get(jobj, v))]

[h, if (action == 1): execLink (macroLinkText("openDatabase@this", "self"))]