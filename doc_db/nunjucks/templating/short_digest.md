# Templating

## Core Concepts
- **Variables**: `{{ var }}`, `{{ obj.prop }}`, `{{ obj["prop"] }}`
- **Filters**: `{{ val | filter }}`, chainable: `{{ val | filter1 | filter2 }}`
- **Template Inheritance**: Parent defines `{% block name %}...{% endblock %}`, child uses `{% extends "parent.html" %}` and overrides blocks. Use `{{ super() }}` to include parent content.

## Control Flow
```jinja
{% if cond %}...{% elif cond %}...{% else %}...{% endif %}
{% for item in items %}...{% else %}empty{% endfor %}
{% for x, y in pairs %}...{% endfor %}
```
Loop variables: `loop.index`, `loop.index0`, `loop.first`, `loop.last`, `loop.length`.

## Template Composition
- **include**: `{% include "file.html" %}` (separate render, separate blocks)
- **import**: `{% import "file.html" as obj %}` (access exported macros/sets)
- **macro**: `{% macro name(arg1, arg2=default) %}...{% endmacro %}`
- **set**: `{% set var = value %}` or `{% set var %}...{% endset %}`

## Expressions
- **Math**: `+`, `-`, `*`, `/`, `//`, `%`, `**`
- **Comparison**: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`
- **Logic**: `and`, `or`, `not`, parentheses
- **Ternary**: `{{ "yes" if cond else "no" }}`
- **Regex**: `r/pattern/flags`

## Whitespace & Comments
- Strip whitespace: `{%-` and `-%}` around tags/variables
- Comments: `{# comment #}`

## Key Filters
**Type conversion**: `int`, `float`, `string`, `list`
**String**: `upper`, `lower`, `capitalize`, `title`, `trim`, `replace`, `escape`, `urlencode`, `urlize`
**Array**: `join`, `first`, `last`, `length`, `reverse`, `sort`, `slice`, `batch`, `sum`
**Advanced**: `groupby(attr)`, `select/reject(test)`, `selectattr/rejectattr(attr)`, `dictsort`, `default(val)`, `round`, `indent`, `truncate`, `wordcount`

## Global Functions
- `range(start, stop, step)`: Generate number sequence
- `cycler(val1, val2, ...)`: Cycle through values
- `joiner(sep)`: Output separator except first call

## Security
⚠️ **No sandboxing**: Don't use user-defined templates or inject user content into template definitions (RCE/XSS risk).
