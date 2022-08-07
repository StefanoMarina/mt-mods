[h: args = macro.args]
[h: rawobj = json.get(args, "rawjson")]
[h: abort( !json.contains(args, "close" ) )]

[h: assert ( json.type(rawobj) == "OBJECT", "Cannot open database: not a JSON object")]
[h: keys = json.fields(rawobj, ",")]

[h: assert( keys != "0" && listCount(keys)>1, "Cannot open database: Bad JSON")]

[h, foreach (key, keys): setLibProperty(key, json.get(rawobj, key), getMacroLocation())]

[r,g: "<p>Database succesfully imported.</p>"]