[h: obj = arg(0)]

[h: return (json.type(obj)=="OBJECT", -1)]
[h: return ( json.contains(obj, "type"), -1 )]
[h, if (json.contains(obj, "effects") && json.get(obj,"type") == "effect"): return(0, 0) ]
[h: return (json.contains(obj, "property") && json.contains(obj, "value"), -1)]
[h: macro.return = 1]
