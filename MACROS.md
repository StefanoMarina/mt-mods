# Macro Reference

Version 1.0.0

I apologize for inconsistencies between each macro explaination.

When `[]` or `{}` is near a parameter, this means a json array or a json object is expected as a parameter.

When a parameter has a =_something_ , i.e. `token=currentToken()`, this means the parameter will resolve to that value if not specified.

## Macro List

### Mod macros
[mod.get](#mod.get)

[mod.getProperty](#mod.getProperty)

[mod.getScore](#mod.getScore)

[mod.set](#mod.set)

[mod.ui.edit](#mod.ui.edit)

### Effect macros

[effect.add](#effect.add)

[effect.contains](#effect.contains)

[effect.get](#effect.get)

[effect.group](#effect.group)

[effect.new](#effect.new)

[effect.remove](#effect.remove)

[effect.ui.manage](#effect.ui.manage)

[mod.setEffect](#mod.setEffect)

### General macros

[mod.toString](#mod.toString)

[mod.ui.bindScore](#mod.ui.bindScore)

### Private macros

json.getSafe

This is for internal use only and may be deprecated in the future. basically, returns an empty object or array if a non-json is passed as a parameter.

## Macro description

<a id="effect.add"></a>
### effect.add

```
effect.add(jarr[], fx)
effect.add(jarr[], fx, replace=0)
```

Stores into `jarr` a new effect, either retrieving it from the global database or by creating from scratch.

##### Parameters

*   jarr: where to store the object.
*   fx: either a string for the effect name or an effect object to be added.
*   replace: replace the effect if a similar effect is found on `jarr`. The effect will be stacked otherwise.

##### Remarks

This is most useful as a quick way to add fxes from the database. however,

json path search is case-sensitive, so `bless` is different from `Bless`. Same for any properties.

The name property is used to look inside the general DB when `effects` is not set.

##### Returns

The expanded `jarr` array.

<a id="effect.contains"></a>
### effect.contains

Utility to check an effect presence on a json narray.
```
effect.contains(jarr, effectName)
```

##### Parameters

*   jarr: a valid json array
*   effect: either a json effect object, a or a string with an existing effect on the token or an effect on the global database.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

##### Returns

1 if the effect is present, 0 otherwise.

<a id="effect.get"></a>

### effect.get
```
	effect.get(name)
	effect.get(name, jarr[])
```

returns a json object from jarr with all modifiers present for an effect. If an effect has multiple entries, all entries are returned.

##### Parameters

* name: effect name.
* jarr : array where to look up for `name`. If not specified, the global DB is searched instead.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

##### Returns

a json array with all the effects returned.

<a id="effect.group"></a>
### effect.group

	effect.get(name)
	effect.get(name, jarr[])

Searches all effects in `jarr[]` or the global database belonging to the same group.

##### Parameters

* name: one or more group name(s), as a comma-separated list.
* jarr : array where to look up for `name`. If not specified, the global DB is searched instead.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

##### Returns

a json array with all the effects returned.

<a id="effect.new"></a>
### effect.new
```
effect.new(name)
effect.new(name, state)
effect.new(name, state, effects[], group)
```

Creates a new effect json object.

##### Parameters

* `name`: Effect name.
* `state`: State to be bind to the effect. Empty string ("") for no state.
* `effects`: a json array containing _mods_ to be bound to the effect. Valid options are a json array, a single json mod object, or an empty string.
* `group`: a string for the effect's group.

##### Remarks

While this is a simple call to json.set, it is to be preferred to raw json object handling as this can be used to easily expand effects, by overriding the function with `defineFunction()`.

##### Returns

a new json effect object .

<a id="effect.remove"></a>
### effect.remove

```
effect.remove(jarr, name, tokenID)
```

Removes an effect. Note that this will remove ALL effects with that name.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

Call mod.updateStatuses() to enable/disable statuses for a mod. if tokenID is specified, and the removed effect has a state, the state will be removed.

##### Returns

modified jarr.

<a id="effect.ui.manage"></a>
### effect.ui.manage

```
effect.ui.manage()
effect.ui.manage(tok, prop, title="Effect Manager", access="auto", group)
```

This function opens a GUI editor to manage mods. This function may open the global effect library to the GM, if no selection is made, a specific editor to a _jarray_ or may show in bulk a mod property to a list of tokens (comma separated).

##### Parameters

* `tok`: a string list (,) of tokens.
* `prop`: only when parameter 0 is _tok_, the property to read. The property must be a valid json array.
* `title`: when specified, allows customization of the tile.
* `access`: Access clearance. see remarks. default value is "auto", which is "full" for gms and "view-only" for players.
* `group`: only when access is _add-group_, a comma-separated list of groups to show.

##### Remarks

This GUI will prevent any unauthorized access to token properties. GM may edit any token, but any unowned token from `tok` will be stripped. The function will silently quit if no vald tokens remain on the list. the GUI may be customized with CSS (see `mod.configure`) Access mode allows user to define how much control on the gui is shown:

* `view-only`: default for players, allows no modification.
* `add-group`: allows add and remove from a specific group. `group` parameter must be specified.
* `add-all`: allows add and remove from any group.
* `full`: allows full control, including customization & edit

<a id="mod.get"></a>
### mod.get

```
mod.get(jarr[], name,type="all", otherwise=0)
```

Gets the current mod for current token or token id. 0 is returned by default is the mod is not present. _type_ determines the mod category.

##### Parameter

* `jarr` : the arry to look into
* `name` : property or score nome
* `type` : list separated by comma (,) of all requested roll types. Use 'all' for global scope properties.
* `otherwise` : value to return if no mods is found

##### Returns

a numerical mod or the _otherwise_ parameter.

##### Examples

Find from jarr any bonus/malus to fear saving throws:

``mod = mod.get(jarr, "fear", "save", 0)``

Find any bonus to thac0:

``mod = mod.get(jarr, "thac0", "all", 0)``

<a id="mod.getProperty"></a>
### mod.getProperty

```
mod.getProperty(property, modProperty[], scope="all", token="currentToken()", map="currentMap()")
```

Returns a property with all modifications applied. Property is first converted with _mod.getScore_, then modified by a _mod.get_call using _scope_.

##### Parameters

* `property`: token property name.
* `jarr`: any mod pool you want to apply. You may use a _string_ instead of an array to trigger a `getProperty` on `token` parameter.
* `scope`:may be any scope, "all" will search for all modifiers bound to that property.
* `token`, `map`: as in getProperty()

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

this will automatically convert any score into their mods. scope cannot be 'score'. if you want to get the pure attribute, do getProperty(property)+mod.get(property, "score").

##### Returns

A numerical value.

<a id="mod.getScore"></a>
### mod.getScore

```
mod.getScore(prop, jarr="")
mod.getScore(prop, jarr="", tokenID=currentToken, map=getCurrentMap())
```

Gets, modifies and return a property bound as a score. searches for a table with `name` and gets the actual bonus/modifier. If it is not present, the raw value is returned.

##### Parameters

* `prop`: the **name** of the property you want to change.
* `jarray` : a json array with pure "score" mods. Pass empty string to avoid ("").
* `tokenID` : the token, if different from the current token;
* `map` : where to find `tokenID`, if specified.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

Scores have their own mod scope, the _score_. Any **direct** mod to the property value will be looked upon the "score" mod category.

Note that this will automatically call **mod.get** with the score mod, so you do not need to manually call it. You may avoid this by passing "" as jarr.

##### Returns

Either a modified score or the original attribute value.

##### Examples

Let's assume you have bound the Strength property to a 3.5 table, so 12=>+1, 18=>+3.

```
[h: setProperty("STR", 18)]
[r: mod.getScore("STR", "")]
```

will return 3. Get the STR modifier, use the 'mods' property:

`mod.getScore("STR", mods)`

<a id="mod.set"></a>
### mod.set
```
	mod.set(jarr[], properties, value, scope="all", replace=1)
```
##### Parameters

* `jarr[]`: a json array with other mods. if null (""), the plain object will be returned.
* `properties`: a **list (comma-separated)** containing property names to be buffed. The special keyword "all" will affect anything of the type.
* `value`: a numeric value different from 0.
* `scope`: use this to force specific buffs, such as "check" or "save". keyword "all" means buff everytime
* `replace`: only if jarr is not null, replace any buff to the same property and type.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

Passing "" as first parameter is useful to just create mods.

Note that replace will not replace a specific mod when passing 'all' as a scope, but will replace any mod with "all" scope instead.

By passing _all_ as a property, all queries to the same type will trigger this mod. Be careful not to add "all" both as a property and a scope or the mod will be always applied.

Be careful when mixing mods and effects. queries may return bad results or replace the wrong mod.

##### Returns

the new mod or jarr.

##### Examples

+5 to Strength checks:

`mods = mod.set(mods, "Strength", 5, "check")`

-1 to anything using the Attack property:

`mods = mod.set(mods, "Attack", -1)`

Just create a "+1 to Strength and Intelligence saves" mod:

` mod = mod.set("", "Strength, Intelligence", -1, "save")`

-1 To all checks:

` mod = mod.set("", "all", -1, "check")`

<a id="mod.setEffect"></a>
### mod.setEffect

```
mod.setEffect(effect, value, property, tokenID=currentToken, map=getCurrentMapName())
```

Sets an effect mimicking the setState function.

##### Parameters

* `effect`: either a json effect object, a or a string with an existing effect on the token or an effect on the global database.
* `value`: either 1 (enable, default) or 0 (disable/remove);
* `property`: name of the property containing a json array for effects.
* `tokenID`: token to be effected with this state. defaults to current Token.
* `map`: map where the token is. defaults to current map.

##### Remarks

json path search is case-sensitive, so _bless_ is different from _Bless_. Same for any properties.

This will automatically add or remove (depending on _value_) an effect to a property _property_ inside a token.

Effect may be a custom effect (see effect.add) or a string for an existing effect.

This functions will check out if _effect_ has a state bound to it, and will turn the effect on or off depending on _value_. the state will be set even if the property already conatins such effect.

##### Returns

Returns 1 if the operation was possibile (the effect wasn't present before adding or was present before removing).

<a id="mod.toString"></a>
### mod.toString

```
mod.string(mod{})
```

Turns a mod object into a human readable string.

##### Parameters

* `mod`: a json mod object.

##### Returns

A string.

<a id="mod.bindScores"></a>
### mod.ui.bindScores

`mod.ui.bindScores()`

This function will call the _Score to table_ bind editor.

<a id="mod.ui.edit"></a>
### mod.ui.edit

```
mod.ui.edit(mod)
mod.ui.edit(jarr)
mod.ui.edit(jarr, index)
```

Graphical editor for a mod.

##### Parameters

* `mod` - name of a mod , a json mod object or an empty json object "{}".
* `jarr`· - an array containing any mods.
* `index` - required with jarr, the index of the mod you intend to edit.

##### Remarks

Setting a value of **0** will remove the mod from jarr.

##### Returns

if `mod` has been passed as an argument, it returns the new mod object. otherwise `jarr` is returned.

