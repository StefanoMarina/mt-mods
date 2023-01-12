
# Macro Reference

Version 1.1.0

I apologize for inconsistencies between each macro explaination. From version 1.1.0, this file is generated automatically.

When `[]` or `{}` is near a parameter, this means a json array or a json object is expected as a parameter.

When a parameter has a =_something_ , i.e. `token=currentToken()`, this means the parameter will resolve to that value if not specified.

## Macro List
[effect.add](#effect.add)
    
[effect.asReference](#effect.asReference)
    
[effect.contains](#effect.contains)
    
[effect.get](#effect.get)
    
[effect.group](#effect.group)
    
[effect.new](#effect.new)
    
[effect.remove](#effect.remove)
    
[effect.resolve](#effect.resolve)
    
[effect.ui.manage](#effect.ui.manage)
    
[getModProperty](#getModProperty)
    
[getScore](#getScore)
    
[isMod](#isMod)
    
[json.getSafe](#json.getSafe)
    
[mod.eval](#mod.eval)
    
[mod.get](#mod.get)
    
[mod.getElements](#mod.getElements)
    
[mod.getInterfaceProperty](#mod.getInterfaceProperty)
    
[mod.getProperty](#mod.getProperty)
    
[mod.getScore](#mod.getScore)
    
[mod.pvt.getAvailableStates](#mod.pvt.getAvailableStates)
    
[mod.set](#mod.set)
    
[mod.setEffect](#mod.setEffect)
    
[mod.setForceString](#mod.setForceString)
    
[mod.toString](#mod.toString)
    
[mod.ui.bindScores](#mod.ui.bindScores)
    
[mod.ui.edit](#mod.ui.edit)
    

## Macro Description

[]{#effect.add}

### effect.add

Stores into `jarr` a new effect, either retrieving it from the global
database or by creating from scratch.

#### Usage

` effect.add(jarr[], fx) effect.add(jarr[], fx, replace=0)`

#### Parameters

-   `jarr[]`: a json array where the object will be stored.
-   `fx`: either a string for the effect name or an effect json object
    to be added.
-   `replace`: if true (1), macro will replace any effect with a similar
    effect inside `jarr`. The effect will be stacked otherwise.

#### Remarks

This is most useful as a quick way to add fxes from the database.
however, json.path search is case-sensitive, so `bless` is different
from `Bless`. Same goes for any properties.

The name property is used to look inside the general DB when `effects`
is not set.

#### Returns

The expanded `jarr` array.

[]{#effect.asReference}

### effect.asReference

A wrap-up to create an *effect reference* to a global effect. This
ensures object integrity.

#### Usage

`effect.asReference(fxName)`

#### Parameters

-   `fxName`: name of the global effect

#### Remarks

This creates an effect reference to a global effect instead of a real
effect, meaning the array must be resolved againt references before
retrieving all mods. this is done automatically by `mod.get`, see
`effect.resolve` for more info.

json path search is case-sensitive, so `bless` is different from
`Bless`. Same for any properties.

#### Returns

a json *Effect reference* object.

[]{#effect.contains}

### effect.contains

Utility to check if an effect is inside a json narray.

#### Usage

`   effect.contains(jarr, effectName)`

#### Parameters

-   `jarr`: a valid json array
-   `effect`: either a json effect object, a or a string with an
    existing effect on the token or an effect on the global database.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*.Same for any properties.

#### Returns

1 if the effect is present, 0 otherwise. []{#effect.get}

### effect.get

Returns a json list of effects matching `name`. If an effect has
multiple entries, all entries are returned.

#### Usage

`     effect.get(name)     effect.get(name, index = -1)     effect.get(name, index = -1, jarr[])`

#### Parameters

-   `name`: effect name.
-   `index`: which effect from the list. defaults to -1, which means the
    whole array will be returned. Set it to 0 to avoid returning an
    array when you are sure only one effect is present (for example,
    when querying the database).
-   `jarr`: array where to look up for `name`. If not specified, the
    global DB is searched instead.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*.

Despite being called effect.get, this returns a json array, even if a
single instance is found. If you are sure only one index is present,
always set index to 0.

Same for any properties.

#### Returns

a json array with all the effects returned.

[]{#effect.group}

### effect.group

Searches all effects in jarr\[\] or the global database belonging to the
same group.

#### Usage

`     effect.get(name)     effect.get(name, jarr[])`

#### Parameters

-   `name`: one or more group name(s), as a comma-separated list.
-   `jarr `: array where to look up for `name`. If not specified, the
    global DB is searched instead.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

#### Returns

a json array with all the effects returned.

[]{#effect.new}

### effect.new

Creates a new effect json object.

#### Usage

` effect.new(name) effect.new(name, state) effect.new(name, state, effects[], group)`

#### Parameters

-   `name`: Effect name.
-   `state`: State to be bind to the effect. Empty string (\"\") for no
    state.
-   `effects`: a json array containing *mods* to be bound to the effect.
    Valid options are a json array, a single json mod object, or an
    empty string.
-   `group`: a string for the effect\'s group.

#### Remarks

While this is a simple call to json.set, it is to be preferred to raw
json object handling as this can be used to easily expand effects, by
overriding the function with `defineFunction()`.

#### Returns

a new json effect object . []{#effect.remove}

### effect.remove

Removes an effect from an array or a token. Note that this will remove
ALL effects with that name.

#### Usage

` effect.remove(jarr, fxname) effect.remove(property, fxname, tokenID, mapID)`

#### Parameters

-   `jarr[]`: a json array containing effects.
-   `property`: name of the proprerty containing a json array.
-   `tokenID`: (optional) name of the token containing `property`.
-   `mapID`: (optional) name of the map containing `tokenID`.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

The first form will simply remove an effect using jsonpath. The second
form, which requires `tokenID`,will update the property and disable any
effect bound to the effect.

#### Returns

modified `jarr`.[]{#effect.resolve}

### Effect.resolve

Turns any *effect reference* into a full effect json object.
` effect.resolve(jarr) effect.resolve(jarr, database = "") effect.resolve(reference) effect.resolve(reference, database = "")`

#### Parameters

-   `jarray`: if the first parameter is a valid json mod/fx array, the
    whole array will be resolved;
-   `reference`: if the first paramater is a valid effect reference json
    object, only that object will be resolved.
-   `database`: optional, the database to use for reference resolution,
    if \"\" it will be the global database.

#### Remarks

This function is called automatically by mod.get but may be called by
any functions that requires a full parse-able db.

This function should be called only if you are using *effect
references*, otherwise it is meaningless. Any resolved reference is
stored locally and won\'t respond to global database changes anymore.

#### Returns

A json array with all references turned into a full effect object.

[]{#effect.ui.manage}

### mod.ui.manage

Opens a GUI editor to manage mods.

If no token is opened, the global library is opened instead (GM Only).

` effect.ui.manage() effect.ui.manage(tok, prop, title="Effect Manager", access="auto", group)`

#### Parameters

-   `tok`: a string list (,) of tokens.
-   `prop`: only when parameter 0 is *tok*, the property to read. The
    property must be a valid json array.
-   `title`: when specified, allows customization of the tile.
-   `access`: Access clearance. see remarks. default value is \"auto\",
    which is \"full\" for gms and \"view-only\" for players.
-   `group`: only when access is *add-group*, a comma-separated list of
    groups to show.

#### Remarks

This GUI will prevent any unauthorized access to token properties. GM
may edit any token, but any unowned token from `tok` will be stripped.

The macro will silently quit if no vald tokens remain on the list. the
GUI may be customized with CSS (see `mod.configure`)

Access mode allows user to define how much control on the gui is shown:

-   `view-only`: default for players, allows no modification.
-   `add-group`: allows add and remove from a specific group. `group`
    parameter must be specified.
-   `add-all`: allows add and remove from any group.
-   `full`: allows full control, including customization & edit

[]{#getModProperty}

### getModProperty

Returns a property value or property expression using the default mod
property.

#### Usage

`mod.getProperty(property, scope)`
`mod.getProperty(property, scope, token)`
`mod.getProperty(property, token, map)`

#### Parameters

-   `property`: name of the property that you want to retrieve. beware
    of case-sensitiveness.
-   `scope`: the context you need this mod, i.e. check or save. Defaults
    to *all*.
-   `token`: Token id. Defaults to `currentToken()`.
-   `map`: Map id. Defaults to `getCurrentMapName()`.

#### Remarks

Much like `mod.getProperty`, this macro will return a numeric value if
the result mod is a mathematical expression and `forceString` is set to
**0**.

#### Returns

The modified value or a string expression to be evaluated.[]{#getScore}

### getScore

Modifies a pure attribute score (as in d20\'s 3-18 attributes) and
returns the roll modifier from the appropriate table.

#### Usage

` getScore(property) getScore(property, tokenID) getScore(property, tokenID, mapID)`

#### Parameters

-   `property`: the **name** of the attribute score property.
-   `tokenID`: target token. defaults to `currentToken`.
-   `mapID`: target token map. defaults to `getCurrentMapName`.

#### Remarks

for this function to work you need to check out `mod.ui.bindScores`.

Scores, like table keys, should be numeric only in nature\
- a string modifier will result in an error.

#### Returns

Either a modified score or the original attribute value. if Any mod
resulting in a string instead of a number will return a string with all
mods.

#### See also

`mod.getScore`

[]{#isMod}

### isMod

Similar to json.type, returns a number detecting mod type.

#### Usage

`   isMod(object)`

#### Returns

1 if the object is a mod, 0 if it is an effect, -1 if it is not either a
mod or an effect.[]{#json.getSafe}json.getSafe(value, type) returns an
empty array or object if value is not of type.[]{#mod.eval}

### mod.eval

Create a new mod object inside a mod array.

#### Usage

`mod.eval(expression, mod[], scope)`
`mod.eval(expression, modProperty, scope)`
`mod.eval(expression, modProperty, scope, token)`
`mod.eval(expression, modProperty, scope, token, map)`[]{#mod.get}

### mod.get

Returns the current modifier for a property or id inside a mod array.

#### Usage

`   mod.get(jarr[], name)   mod.get(jarr[], name, type)   mod.get(jarr[], name, type="all", otherwise=0, optimize=0)`

#### Parameters

-   ` jarr `: the arry to look into
-   ` name `: property or score nome
-   ` type `: list separated by comma (,) of all requested roll types.
    Use \'all\' for global scope properties.
-   ` otherwise `: value to return if no mods is found
-   `optimize`: by passing 1, this will consider `jarr` as it was
    already called from a `getElements()` query. This is used internally
    to avoid resolving and filtering multiple times.

#### Remarks

As of 1.1.0, `mod.get` will return a unparsed string if any non
mathematical sign is found.

This will return the operators (\* and /) first, and any other value
then. Any other type of mod (i.e. value forcing) will be ignored as this
is supposed to return any *buff*.

#### Returns

A number or a string expression with all the mods found or the original
value.

#### Examples

Find from jarr any bonus/malus to fear saving throws:
`mod = mod.get(jarr, "fear", "save", 0)` Find any bonus to thac0:
`mod = mod.get(jarr, "thac0", "all", 0)`

[]{#mod.getElements}

### mod.getElements

[Introduced in 1.1.0]{.small}

Gets the current mod json objects from `jarr[]`. an empty array is
returned by default is no mod is present./

#### Usage

`mod.get(jarr[], name,type="all")`

#### Parameters

-   `jarr`: the arry to look into
-   ` name `: property or score nome
-   ` type `: list separated by comma (,) of all requested roll types.
    Use \'all\' for global scope properties.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

This macro is useful if you plan to do multiple searches using active
effects, as it reduces the effect array size.

#### Returns

A json array with all mod objects matching the query.

[]{#mod.getInterfaceProperty}

### mod.getInterfaceProperty

Returns the property name for the mods as set in `mod.configure`.

#### Returns

The name of the property.[]{#mod.getProperty}

### mod.getProperty

Returns a property with all modifications applied. Unlike `mod.get` this
will take value forcing into account.

#### Usage

`   mod.getProperty(name, modProperty, scope)   mod.getProperty(name, jarr[], scope)      mod.getProperty(name, modProperty, scope, tokenID, mapID)   mod.getProperty(name, jarr[], scope, tokenID, mapID)`

#### Parameters

-   `name`: name of the property to be looked upon.
-   `modProperty`: Property containing a json array from a token.
-   `jarr[]`: a json array which will be used instead of `modProperty`.
-   `scope`:may be any scope, \"all\" will search for all modifiers
    bound to that property.
-   `tokenID`: target token. defaults to `currentToken`.
-   `mapID`: target token map. defaults to `getCurrentMapName`.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

`mod.getProperty` will first attemp to handle the property as a score.
So, strength will be turned into a modifier, armor class will not. Then,
he tries to apply any forcing to the value. The forcing algorithm may be
defined using `mod.configure()`. Then any other mods are applied.

If the value of `property` is a string, no score translation will be
attempted.

#### Returns

Either a numeric value or a string representing all mods.

If any mod or forcing is non numerical or an operation, a string is
returned.

[]{#mod.getScore}

### mod.getScore

Modifies a pure attribute score (as in d20\'s 3-18 attributes) and
returns the roll modifier from the appropriate table.

#### Usage

` mod.getScore(property) mod.getScore(property,attributeMods[]) mod.getScore(property,attributeModProperty, tokenID, mapID)`

#### Parameters

-   `property`: the **name** of the attribute score property.
-   `attributeModProperty `: name of the property containing mods. Pass
    empty string to avoid (\"\").
-   `attributeMods[] `: external json array containing mods. Pass empty
    string to avoid (\"\").
-   `tokenID`: target token. defaults to `currentToken`.
-   `mapID`: target token map. defaults to `getCurrentMapName`.

#### Remarks

for this function to work you need to check out `mod.ui.bindScores`.

json path search is case-sensitive, so *bless* is different from
*Bless*. Same goes for any property.

Passing a mod array will call **mod.get** with the *score*type, so you
do not need to manually call it.

Scores, like table keys, should be numeric only in nature\
- a string modifier will result in an error.

#### Returns

Either a modified score or the original attribute value. if Any mod
resulting in a string instead of a number will return a string with all
mods.

#### Examples

Let\'s assume you have bound the Strength property to a 3.5 table, so
12=\>+1, 18=\>+3.
` [h: setProperty("STR", 18)] [r: mod.getScore("STR")]` will return 3.
Get the STR modifier, use the \'mods\' property:
`mod.getScore("STR", mods)`

[]{#mod.pvt.getAvailableStates}

### mod.pvt.getAvailableStates

Returns a list of available states, grabbed from `getInfo`.

#### Returns

A comma separated string list.

[]{#mod.set}

### mod.set

Create a new mod object inside a mod array.

#### Usage

`   mod.set("", properties, value)   mod.set("", properties, value, scope, replace)   mod.set(jarr[], properties, value)     mod.set(jarr[], properties, value, scope, replace)`

#### Parameters

-   `jarr[]`: a json array with other mods. if null (\"\"), the plain
    object will be returned.
-   `properties`: a **list (comma-separated)** containing property names
    to be buffed. The special keyword \"all\" will affect anything of
    the type.
-   `value`: a numeric value different from 0.
-   `scope`: use this to force specific buffs, such as \"check\" or
    \"save\". keyword \"all\" means buff everytime
-   `replace`: only if jarr is not null, replace any buff to the same
    property and type.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

Passing \"\" as first parameter is useful to just create mods.

Note that replace will not replace a specific mod when passing \'all\'
as a scope, but will replace any mod with \"all\" scope instead.

By passing *all* as a property, all queries to the same type will
trigger this mod. Be careful not to add \"all\" both as a property and a
scope or the mod will be always applied.

Be careful when mixing mods and effects. queries may return bad results
or replace the wrong mod.

#### Returns

the new mod or jarr.

#### Examples

+5 to Strength checks: `mods = mod.set(mods, "Strength", 5, "check")` -1
to anything using the Attack property:
`mods = mod.set(mods, "Attack", -1)` Just create a \"+1 to Strength and
Intelligence saves\" mod:
` mod = mod.set("", "Strength, Intelligence", -1, "save")` -1 To all
checks: ` mod = mod.set("", "all", -1, "check")`

[]{#mod.setEffect}

### mod.setEffect

Sets an effect on a token, enabling a state if necessary.

#### Usage

` mod.setEffect(effect, value, property) mod.setEffect(effect, value, property, tokenID) mod.setEffect(effect, value, property, tokenID, map)`

#### Parameters

-   `effect`: either a json effect object, a or a string with an
    existing effect on the token or an effect on the global database.
-   `value`: either 1 (enable, default) or 0 (disable/remove);
-   `property`: name of the property containing a json array for
    effects.
-   `tokenID`: token to be effected with this state. defaults to current
    Token.
-   `map`: map where the token is. defaults to current map.

#### Remarks

json path search is case-sensitive, so *bless* is different from
*Bless*. Same for any properties.

This will automatically add or remove (depending on *value*) an effect
to a property *property* inside a token.

Effect may be a custom effect (see effect.add) or a string for an
existing effect.

This functions will check out if *effect* has a state bound to it, and
will turn the effect on or off depending on *value*. the state will be
set even if the property already conatins such effect.

#### Returns

Returns 1 if the operation was possibile (the effect wasn\'t present
before adding or was present before removing). []{#mod.setForceString}

### mod.setForceString

sets if mod evaluations should return a formula or a number.

#### Usage

` mod.setForceString(forceString)`

#### Parameters

-   `forceString`: 1 if all macros should return a string, 0 otherwise.

#### Remarks

This value may be set also in `mod.configure`. []{#mod.toString}

### mod.toString

Turns a mod object into a human readable string.

#### Usage

` mod.string(mod{})`

#### Parameters

-   `mod`: a json mod object.

#### Returns

A string.[]{#mod.ui.bindScores}

### mod.ui.bindScores

This function will call the *Score to table* bind editor.

#### Usage

`mod.ui.bindScores()` []{#mod.ui.edit}

#### mod.ui.edit

` mod.ui.edit(mod) mod.ui.edit(jarr[]) mod.ui.edit(jarr[], index)`
Graphical editor for a mod.

#### Parameters

-   `mod`: name of a mod , a json mod object or an empty json object
    \"{}\".
-   `jarr`: an array containing any mods.
-   `index`: required with jarr, the index of the mod you intend to
    edit.

#### Remarks

Setting a value of **0** will remove the mod from jarr.

#### Returns

if `mod` has been passed as an argument, it returns the new mod object.
otherwise `jarr`is returned.
