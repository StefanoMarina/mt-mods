# CHANGELOG

# 1.1.0

- New add-on build system using Perl.
- Database now stores its own data version instead of library version.
- Database is accessed via `mod.openDB()` instead of `Configure`.
- Addon release is now under .mtlib
- No property is exported (version can be accessed via `getInfo('w1.lmod')`
- Minor changes in effect library gui.
- Mods may now be strings! String mods will return the whole expression instead of an `eval`.
- Configure and database now called from effect library.
- Custom effect properties;
- Custom mod properties;
- Basic macro set for simple management
- mod.eval and a bunch of new macros;
- Operations (*2 , /2) or force value (=2)

### 1.0.3
- States are now centralized via `mod.pvt.getAvailableStates`. No need to set up a custom list.

### 1.0.2

- New "reference" effects
- fixed missing reference token on custom effect editing
