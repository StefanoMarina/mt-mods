[h, if (argCount()==1), code: {
	[jarr = getLibProperty("effectsDB")]
	[groupname = arg(0)]
};{
	[jarr = effect.resolve(arg(0))]
	[groupname = arg(1)]
}]

[h, if (listCount(groupName)>1):
	query = strformat("@.group in %s", string(json.fromList(groupname)));
	query = strformat("@.group == '%{groupname}'")
]

[h:	macro.return = json.path.read(jarr, strformat("*[?(%{query} && @.type=='effect')]", "ALWAYS_RETURN_LIST"))]
		
