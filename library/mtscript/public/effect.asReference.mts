[h: fxName = arg(0)]
[h: assert( effect.contains(getLibProperty("effectsDB"), fxName), "cannot refer to global fx "+fxName+": unknown effect")]

[h: macro.return = json.set("{}", "name", fxName, "ref", fxName, "type", "effect")]