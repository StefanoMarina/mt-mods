[h: mod = arg(0)]

[h: json.toVars(mod, "mod")]
[h, if (isNumber(modValue)): modPrint = "%+d"; modPrint = "%s"]

[h: macro.return = strformat(modPrint+" to %{modProperty} %s",
	modValue,
	if (!listContains("all, score", modType), modType + "s", "")
)]

		