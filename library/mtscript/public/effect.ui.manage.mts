[h: assert(argCount() || isGM(), "You don't have the rights to call this function")]
[h, if (argCount()>2): title = arg(2); title="Effect editor"]
[h, if (argCount()>3): access = arg(3); access = if (isGM(), "full", "view-only")]
[h, if (argCount()>4): group = arg(4); group ="all")]

[h, if (!argCount() && isGM()), code: {
	[macro("effectsLibrary@this"): ""]	
	[abort(0)]
}]

[h: assert(argcount()>=2, getMacroName() + " requires at least 2 parameters or none")]
	
[h, if (!isGM()), code: {
	[tokenList = arg(0)]
	[finalList = ""]
	[pname = getPlayerName()]
	[foreach (tok, tokenList): finalList = if ( isOwner(pname, tok), listAppend(finalList, tok), finalList)]
	[params = json.set("{}", "tokenID", finalList)]
}; {
	[params = json.set("{}", "tokenID", arg(0))]
}]

[h: params = json.set(params, "title", title, "property", arg(1), "access", access, "group", group)]
[h, macro("effectsTokenManager@this"): params]
