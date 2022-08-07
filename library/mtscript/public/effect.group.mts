[h: groupname= arg(0)]
[h, if (listCount(groupName)>1):
	query = strformat("@.group in %s", string(json.fromList(groupname)));
	query = strformat("@.group == '%{groupname}'")
]

[h, if (argCount()>1): jarr = arg(1); jarr = getLibProperty("effectsDB")]
[h:	macro.return = json.path.read(jarr, strformat("*[?(%{query} && @.type=='effect')]", "ALWAYS_RETURN_LIST"))]
		
