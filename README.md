# Lib:Mod

A maptool library with low-level macros for mods, buffs, scores and effects.

Something that most games have in common is numbers, and the need to temporarely
change them. Using a +1 sword in all d20-based games will improve by 1 the roll
for attack and damages. In modern d20, having a score of 12 on Strength means
having +1 to any roll including strength. Receveing the "blessed" state will grant
a similar +1 to any attack.

Since this is poorly covered in maptool, I have decided to create this library
to cover such modifiers. Note that those are low level macros, with command line
support, meaning they are really useful in creating frameworks, less useful in
direct gameplay.

JSON is my game, so all data is handled as json. Note that jsonpath is used a lot,
and any json request is **strictly case-sensitive**, so an object with _field_ is not
an object with _FIELD_. be careful or sanitize your requests.

Despite being low-level, simple GUI management is included, in the form of dialog5s.

## Installation

- Lib:Token: just add the token on your campaign, impersonate and press ``onCampaignLoad`` or save/reload the campaign.
- Add-on (Experimental): add the addon .zip file via the file menu, and cross your fingers. clone this repo and do the necessary changes if necessary.

**IMPORTANT** At the time I write this (october 2022), add-ons are considered not stable for gameplay. I **strongly** suggest you start with the drag'n'drop token library, and
move to the add-on when it is more stable. Also, There are probably a lot of bugs still to be found out in the addon version.

If you are cloning this repo, zip all files (root dir as zip root dir) to create an add-on. 

The first time you enable this mod, the configuration panel should open. if not, do ``{mod.configure()}`` . if this command does not work, then
you are on your own (sorry :( ).

### Messing with the configuration

Let's check out what can be configured.

Any String List you will stumble upon is comma-separated, no option for custom lists will be provided. '0' means empty string.
 
- **CSS**: you can embed css files/macro into the dialogs. add the macros in _macro@lib_ format.
- **Use internal CSS** (default: yes) : you may force-removal any of the css present. This will mess the dialogs. But who knows, maybe you need it.
- <a id="srt"><a>**Supported rolls**: sometimes you want to give +1 to a check, sometimes you want to give it only to a saving throw. The already present roll types are simple suggestions. _all_ is reserved to skip roll type, while _score_ is used to elaborate between _score buffs_ (i.e. 15+1=16) from _roll buffs_) (i.e.12=+1+, henche +2 ).
- **Effect groups**: You may create groups here, this will help sorting effects or even placing limits (i.e. 2E only allows 1 magical effect to any mod).

### Suitable properties

Now, where to store your mods and effects? you may use any property you want. a **Mod property** is expected to be a **json array** (`[]`), but with
some experimentation they can be put anywhere.

### Database

While you can just dump a getLibProperty on all properties, a fancy database utility is provided. This utility will serialize the lib token into a json object,
to be saved or changed. Access is done via the _Configure_ panel.

<a id="mod"></a>
## Mods

Mods are the basic objects of this library. A mod is a description of a buff, _give +1 to Strength on checks_ or _give +1 on fear saving throws_. 

a mod is a json object respecting the following schema:

```json
{
  "property" : _all_|string,
  "type" : _all_|_score_|string,
  "value" : number
}
```

- **type**: this may be _all_, _score_ or any [supported roll type](#srt) described in the configuration.
- **property**: the property you want to be buffed. this does not really need to match a property, it can be a keyword or anything.
- **value**: the numeric buff.

Of course, being a json object, you may add any other field you want.

### Useful macros

use ``mod.set`` to create a mod and store it on an array, ``mod.get`` to find how much buff the property has.
normal json functions may be used to manage the objects. ``mod.getProperty`` will work as ``getProperty`` but will
retrieve an already buffed value, depending on what property you feed to it.

Finally, ``mod.ui.edit`` is a simple, easy way to create or edit mods or mod properties.

## Scores

d20 system has the infamous six attributes, Strength, Dexterity, etc. They are not used directly, but provide a bonus/malus on checks and other stuff. This is a simple way to handle such modifiers. 

Note that this has, of course, its own limits. For example, in older editions the same score was bound to more than one table. d20 modern has a more linear approach that may be easier (i.e. ``floor(stat/2-5)`` ). You may override the ``mod.getScore`` function or just modify your score first and then use ``mod.get`` to buff it.

### Useful macros
First, you create a table containing the exact conversion for your scores. then, use ``mod.ui.bindScores`` to open a bind dialog. Add as a list the properties you
want to be automatically translated to a bonus. This way, any ``mod.getProperty`` call will **automatically** turn your score into a bonus before modifying it.

``mod.getScore`` is not just a call to ``table()``. Instead, it allows to get the modifier from the attribute score with a json array containing mods and effects.
in a way, is just like calling ``table ( getProperty()+getMod(score+all) )``.

## Effects

Basically, an effect is a set of mods applied under the same name, and with a bindable Status. d20's _Bless_ is a good example. You have an effect ("blessed"), and two mods (+1 to fear checks, +1 to attack rolls).

Here is the schema for effects:

```json
{
  "name" : string,
  "type" : _effect_,
  "state" : string,
  "group": string,
  "effects": [
    {mod}, ...
  ]
}
```

- **name** : the name of your effect:
- **type** :this attribute is there to ease json path searching. Just like mods, you may add any other attribute you want;
- **state**: any campaign available state.  Note that, while configuration requires you to create a state list, you may set any existing state;
- **group**: a keyword to simplify effect queries;
- **effects**: this json array is actually a series of [mod objects](#mod). 

Like mods, you will need an __effect property__ , which is a mod property for effects. Again, this is just a json array.

### The effects database

Effects are handled less console-ish and more gui. ``effect.ui.manage()``, without parameters, will open the effect library database.
You may add, change or remove any effect from here. the global "library" property **effectsDB** is used to store the json array.

The effect editor has a built-in editor interface. ``effect.ui.edit()`` will allow you to edit an existing mod. Unfortunately, only token effects and
library effects may be edited via the gui editor.

Library effects may be assigned to properties using ``effect.add()`` and passing just the name. However, the effect object is stored inside the token
property, so if you change the global effect, this won't change already assigned effects.

### The effect token manager

The effect token manager is called via ``effect.ui.manage()``, by passing the token and the mod property as parameters. This manager allows you to add/remove
library effects to a token, but also to create custom effects on the spot.

The manager GUI supports multiple selections and should change selection accordingly. For "security" reasons, only GM may change effects to non-owned tokens. 
There is an _access_ parameter to``effect.ui.manage`` that allows you to select how much control, from view-only to blocking custom effects, to restrict effects to a certain group.
 
### Other useful macros

``mod.setEffect()`` is the main function here. This will take an existing effect (either an object or a name from the database), and will handle status enabling/disabling for you, should the effect be bind to a state. 

``effect.new()`` is to be preferred to json.set as it will ensure the effect object is schema-compatible. ``effect.add`` and ``effect.remove`` will handle multiple entries, by forcing replacing or stack. ``effect.get``, ``effect.contains`` and ``effect.group`` are useful for queries. 

## Effect reference

An **effect reference** is a simple json object that points to a dabatase effect instead of containing all the information. Now, why such thing would exists? Simple: to handle global effect changes. Let's say you want to use your ~~rac~~ archetype modifiers as effects, and add them to a token instead of modifying each stat every time. Now imagine you misspelled something, or simply want to add another feature. With effect reference, you only need to change a global effect - all other effect will change automatically.

```json
{
  "name" : name of the effect - can be different than the reference
  "ref" : name of the effect which this object refers to.
}
```

### Useful macros
``effect.asReference`` will create a json object with your reference, while ``effect.resolve`` will resolve any json array or reference towards a database. note that ``mod.get`` and ``effect.remove`` already call ``effect.resolve`` towards the global database.



## Cookbook

## Basics

We'll use default settings for roll types.

We will create a mod property. Do "Edit > Campaign preferences" and add a new property, "mods", with a default value of `[]`.

`mods : []`

Click Update, then Ok;

There, now we have a default mod property.

### Creating a Spell effect

Let's say we want to create a _Blessed_ status on 3.5.

This will assume you have an _Attack_ property , _Will_, and a _mods_ property, representing attack and bonus to will saves and fear.

Let's say your Attack property is 0.

1. we open `effect.ui.manage()`;
2. _Create a new Effect_;
3. On the editor, write _Blessed_ as the name, and add the following rows:
  - _Attack_ , _all_ rolls, +1;
  - _Fear_, _save_ rolls, +1.
4. Click ok;

The effect is now ready. 

5. Impersonate a token;
6. do `mod.setEffect("Blessed", 1, "mods");

The character is now blessed. 

Now, `getProperty("Attack")` will return 0, while `mod.getProperty("Attack", mods)` (without the quotes, as the parameter is passed directly), we'll get +1.

Calling `mod.setEffect("Blessed", 0, "mods") will remove the effect.

What if we want to do a save vs. fear?

`mod.getProperty("Will", mods)+mod.get(mods, "Fear", "save")`

This will ensure that any general mod to Will saves (none at the moment) will be counted. What this string do is this:

- Will + any mod to will + any mod for the non-existent "Fear" property - Lib:Mod does not actually require the property to exist when calling mod.get.

### More complex effects

1. Remove the effect from the token `mod.setEffect("Blessed", 0, "mods")`.

Now, let's bind to the state _Other3_ our effect. We may do it from command line or, more easily, from the gui.

2. open configuration, `{mod.configure()}`;
3. on the _Effects_ tab, under _Binds_, add "Other3" to the list (or remove the 0).
4. Add "Spells" to the _Groups_ list (or replace the 0);
5. Click ok;

Now let's change our global status.

4. `{effect.ui.manage()}`, select "Blessed", and click "Edit";
5. on "State Bind", "Other3" is now selectable - select it;
6. Set "Spells" as the group and click ok;

7. Set effect from the token: `mod.setEffect("Blessed", 1, "mods")`.
8. Voilà! The status is now automatically set. Try the opposite to automatically remove.

### Equipment mods example

Let's say your character equips a bracelet that gives +2 to AC. There are several ways to achieve this.

Now, you have a property called _braceletMods_ , or maybe a json object _equipmentMods_ will all sort of sources.

Case 1 (braceletMods)

Mod properties are always json arrays, so first thing first you empty your property = `{braceletMods = "[]"}`

1. Impersonate your token.

2. `{braceletMods = json.append("[]", mod.ui.edit("{}"))}`

3. set AC as the property, 2 as the value, _all_ as the roll type.

now, let's say you want all your properties checked out before modding:

`{mod.getProperty("AC", json.merge(mods, braceletMods), "all")}`

will return 2.

### Dumping stuff

This will quickly return any and all mod from a given property. mod property _mods_ is used as an example.

```
[h: allMods = json.path.read(mods, "*[?(@.property)]", "ALWAYS_RETURN_LIST")]
[h: allMods = json.merge(allMods, json.path.read(mods, "*[?(@.type=='effect')].effects.*", "ALWAYS_RETURN_LIST"))]
[r, foreach (mod, allMods, "<br/>"): mod.toString(mod)]
```

## Usage tips

### So many properties!

A _mod property_ is supposed to be a json array. however, if you are using buffs or mods, you may also use json objects, with 
fields representing mod groups. Here is an example of an EquipmentMods property with a +2 protection bracelet:

```json
{
  "bracelet" : [{"property" : "AC", "value": 2, "type" : "all"}]
}
```

`mod.getProperty()` will return +1 to the AC. This does not work with effects, as they are nested deeper.

This way, you can just `json.set` your property and reset the mods.

Property reduction is not necessary, but the more the mods are condensed in the same property, the faster the query gets. When using multiple properties, use ``json.merge`` to merge all the arrays, before using a mod macro.


### Speeding up

The following will create an instant mod set with +1 to attack rolls and +1 to damage. damage property is fictious, so you can roll
i.e. `1d8+mod.getProperty("Strength", "mods")+mod.get(mods, "damage", "attack") to get any modifier to damage.`

```
{mod.set("[]", "Attack, damage", 1, "attack")}
```

A GM should resort to **custom effects** only on a last minute basis. Ensure all the most common effects are present before releasing your framework.

### Customizing objects

Remember, json objects may have any number of attributes. ``effect.new`` creates a new effect, returning a json object. Let's say you use only 1 property
called `mods` and you want to handle equipment and spell effects on the same property. You may do so using groups or adding a new property, to be used with
jsonpath.

```
[h: blessedState = json.set( json.get ( effect.get("Blessed"), 0 ) , "source", "FriendlyToken")]
[h: bracelets = json.set (mod.set ("", "AC", 2, "all"), "source", "bracelet" ) ]
[h: mods = effect.add(mods, blessedState, 1)]

[h: '<!-- remove any previous bracelet -->']
[h: mods = json.path.delete (mods, "*[?(@.source == 'bracelet')]")]

[h: mods = json.append(mods, bracelets)]
```

## Macro reference

See MACROS.md for a full reference.



