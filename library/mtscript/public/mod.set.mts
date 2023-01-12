[h: jarr = arg(0)]
[h: properties = arg(1)]
[h: modValue = arg(2)]
[h, if (argcount()>3): modType= arg(3); modType = "all"]
[h, if (argcount()>4): modReplace =arg(4); modReplace = 1]

[h: return (properties != "" && modValue != 0, "{}")]

[h, foreach (modProperty, properties), code: {
	[newModObject = json.set("{}", "property", modProperty, "value", modValue, "type", modType)]
	
	[h, if (jarr != "" && modReplace): 
		jarr = json.path.delete(jarr, strformat("*[?(@.type == '%{modType}' && @.property == '%{modProperty}')]"))]

	[h, if (jarr != ""): jarr = json.append(jarr, newModObject)]
}]

[h, if (jarr != ""): macro.return = jarr; macro.return = newModObject]
