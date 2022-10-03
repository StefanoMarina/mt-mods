[h: jarr = arg(0)]
[h: fxname = arg(1)]
[h, if (argCount()>2): tokenID = arg(2); tokenID = ""]

[h: return (json.type(jarr) == "ARRAY", 0)]
[h: jarr = effect.resolve(jarr)]

[h: state = json.path.read(jarr, strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')].state"), "ALWAYS_RETURN_LIST")]
[h, if (json.length(state)>0): state = json.get(state, 0); state = ""]

[h, if (tokenID != ""  && state != ""): setState(state, 0, tokenID)]
[h: macro.return = json.path.delete(jarr, strformat("*[?(@.type == 'effect' && @.name == '%{fxname}')]"))]
