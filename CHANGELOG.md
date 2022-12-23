# CHANGELOG

## 1.1

# 1.1.0

- Fixed addon events.
- CHANGELOG.md now available.
- New add-on build system using Perl.
- Database now stores its own data version instead of library version.
- Database is accessed via `mod.openDB()` instead of `Configure`.
- Addon release is now under .mtlib
- No property is exported (version can be accessed via `getInfo('w1.lmod')`

# 1.0

### 1.0.3
- States are now centralized via `mod.pvt.getAvailableStates`. No need to set up a custom list.

### 1.0.2

- New "reference" effects
- fixed missing reference token on custom effect editing
