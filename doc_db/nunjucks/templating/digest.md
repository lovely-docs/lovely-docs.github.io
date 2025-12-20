# Templating

## Security Warning
Nunjucks does not sandbox execution. User-defined templates and user-injected content are unsafe—can expose sensitive data, remote code execution (server), and XSS vulnerabilities (client, even precompiled templates).

## File Extensions & Syntax Highlighting
Community standard: `.njk` extension. Syntax highlighting plugins available for Atom, Vim, Brackets, Sublime, Emacs, VSCode.

## Variables
Access context values with `{{ variable }}`. Supports dot notation and bracket syntax:
```jinja
{{ foo.bar }}
{{ foo["bar"] }}
```
Undefined/null values display nothing, including nested access: `{{ foo.bar.baz }}` outputs nothing if any part is undefined.

## Filters
Functions applied to variables with pipe operator, chainable:
```jinja
{{ foo | title }}
{{ foo | join(",") }}
{{ foo | replace("foo", "bar") | capitalize }}
```

## Template Inheritance
Define reusable blocks in parent templates, override in child templates:
```jinja
{# parent.html #}
{% block header %}Default content{% endblock %}
<section>{% block left %}{% endblock %}</section>

{# child.html #}
{% extends "parent.html" %}
{% block left %}Left content{% endblock %}
```

Use `super()` to include parent block content in child:
```jinja
{% block right %}
{{ super() }}
Additional content
{% endblock %}
```

Extends accepts expressions: `{% extends parentTemplate %}` or `{% extends name + ".html" %}`.

## Tags

### if/elif/else
```jinja
{% if condition %}
  content
{% elif other %}
  other content
{% else %}
  default
{% endif %}
```
Supports `and`, `or`, `not`, parentheses for grouping.

### for
Iterate arrays, objects, Maps, Sets, iterables:
```jinja
{% for item in items %}{{ item.title }}{% endfor %}
{% for key, value in object %}{{ key }}: {{ value }}{% endfor %}
{% for x, y, z in points %}Point: {{ x }}, {{ y }}, {{ z }}{% endfor %}
```

Optional `else` clause if collection is empty. Loop variables available:
- `loop.index` (1-indexed), `loop.index0` (0-indexed)
- `loop.revindex`, `loop.revindex0`
- `loop.first`, `loop.last`, `loop.length`

### asyncEach / asyncAll
For asynchronous templates with async loaders/filters. `asyncEach` is sequential, `asyncAll` renders items in parallel:
```jinja
{% asyncEach item in items %}
  {% include "item.html" %}
{% endeach %}

{% asyncAll item in items %}
  <li>{{ item.id | lookup }}</li>
{% endall %}
```

### macro
Define reusable template functions with default/keyword arguments:
```jinja
{% macro field(name, value='', type='text') %}
<input type="{{ type }}" name="{{ name }}" value="{{ value | escape }}" />
{% endmacro %}

{{ field('user') }}
{{ field('pass', type='password') }}
```
Cannot use async operations inside macros.

### set
Create/modify variables, supports multiple assignment and block capture:
```jinja
{% set username = "joe" %}
{% set x, y, z = 5 %}

{% set modal %}
  {% include 'modal.html' %}
{% endset %}
```
Top-level `set` modifies global context; inside scoped blocks (include, macro) modifies only current scope.

### extends
Specify base template for inheritance. Accepts expressions:
```jinja
{% extends "base.html" %}
{% extends parentTemplate %}
{% extends name + ".html" %}
```

### block
Define named sections for inheritance:
```jinja
{% block css %}
<link rel="stylesheet" href="app.css" />
{% endblock %}
```
Can be nested in loops. Child templates override with new content.

### include
Pull in other templates in place:
```jinja
{% include "item.html" %}
{% for item in items %}{% include "item.html" %}{% endfor %}
{% include "missing.html" ignore missing %}
```
Accepts expressions. Included templates have separate inheritance tree and block namespace. Use `ignore missing` to suppress errors.

### import
Load template and access exported values (macros, top-level `set` assignments):
```jinja
{% import "forms.html" as forms %}
{{ forms.label('Username') }}

{% from "forms.html" import field, label as description %}
{{ description('Username') }}

{% from "forms.html" import field with context %}
```

### raw / verbatim
Output special Nunjucks tags as plain text:
```jinja
{% raw %}
{{ this will not be processed }}
{% endraw %}
```
`verbatim` is identical, added for Twig compatibility.

### filter
Apply filter to block contents instead of piped value:
```jinja
{% filter title %}
may the force be with you
{% endfilter %}

{% filter replace("force", "forth") %}
may the force be with you
{% endfilter %}
```
Cannot use async operations inside.

### call
Call macro with block content available as `caller()`:
```jinja
{% macro add(x, y) %}
{{ caller() }}: {{ x + y }}
{% endmacro %}

{% call add(1, 2) -%}
The result is
{%- endcall %}
```
Outputs: "The result is: 3"

## Keyword Arguments
Functions, filters, macros accept keyword arguments converted to hash as last argument:
```jinja
{{ foo(1, 2, bar=3, baz=4) }}
```
Equivalent to JavaScript: `foo(1, 2, { bar: 3, baz: 4 })`.

Macros support default values and mixed positional/keyword arguments:
```jinja
{% macro foo(x, y, z=5, w=6) %}
{{ x }}, {{ y }}, {{ z }}, {{ w }}
{% endmacro %}

{{ foo(1, 2) }}           → 1, 2, 5, 6
{{ foo(1, 2, w=10) }}     → 1, 2, 5, 10
{{ foo(20, y=21) }}       → 20, 21, 5, 6
{{ foo(8, z=7) }}         → 8, , 7, 6
```

## Comments
```jinja
{# This is a comment #}
```
Completely stripped during rendering.

## Whitespace Control
Strip leading/trailing whitespace with `-`:
```jinja
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```
Outputs: "12345". Use `{%-` to strip before, `-%}` to strip after. Same for variables: `{{-` and `-}}`.

## Expressions

### Literals
- Strings: `"text"`, `'text'`
- Numbers: `40`, `30.123`
- Arrays: `[1, 2, "array"]`
- Dicts: `{ one: 1, two: 2 }`
- Boolean: `true`, `false`

### Math
`+`, `-`, `/`, `//` (integer division), `%` (remainder), `*`, `**` (power):
```jinja
{{ 2 + 3 }}       → 5
{{ 10/5 }}        → 2
{{ numItems*2 }}
```

### Comparisons
`==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`

### Logic
`and`, `or`, `not`, parentheses for grouping:
```jinja
{% if users and showUsers %}...{% endif %}
{% if i == 0 and not hideFirst %}...{% endif %}
{% if (x < 5 or y < 5) and foo %}...{% endif %}
```

### If Expression (Ternary)
```jinja
{{ "true" if foo else "false" }}
{{ "true" if foo }}
{{ baz(foo if foo else "default") }}
```
`else` is optional.

### Function Calls
```jinja
{{ foo(1, 2, 3) }}
```

### Regular Expressions
Prefix with `r`:
```jinja
{% set regExp = r/^foo.*/g %}
{% if regExp.test('foo') %}Foo!{% endif %}
```
Supported flags: `g` (global), `i` (case-insensitive), `m` (multiline), `y` (sticky).

## Autoescaping
If enabled, all output automatically escaped. Use `safe` filter to mark as safe:
```jinja
{{ foo }}           → &lt;span&gt;
{{ foo | safe }}    → <span>
```
If disabled, use `escape` filter to manually escape:
```jinja
{{ foo }}           → <span>
{{ foo | escape }}  → &lt;span&gt;
```

## Global Functions

### range([start], stop, [step])
Generate numbers from start (default 0) to stop (exclusive), incrementing by step (default 1):
```jinja
{% for i in range(0, 5) %}{{ i }},{% endfor %}
```
Outputs: `0,1,2,3,4`

### cycler(item1, item2, ...itemN)
Cycle through values:
```jinja
{% set cls = cycler("odd", "even") %}
{% for row in rows %}
  <div class="{{ cls.next() }}">{{ row.name }}</div>
{% endfor %}
```
Access current item with `cls.current`.

### joiner([separator])
Output separator (default ",") on all calls except first:
```jinja
{% set comma = joiner() %}
{% for tag in tags -%}
  {{ comma() }} {{ tag }}
{%- endfor %}
```
For tags `["food", "beer", "dessert"]` outputs: `food, beer, dessert`

## Builtin Filters

### abs
Absolute value: `{{ -3|abs }}` → `3`

### batch
Group items into lists: `{{ [1,2,3,4,5,6] | batch(2) }}` → `[[1,2], [3,4], [5,6]]`

### capitalize
First letter uppercase, rest lowercase: `{{ "This Is A Test" | capitalize }}` → `This is a test`

### center
Center in field: `{{ "fooo" | center }}` → `fooo`

### default(value, default, [boolean])
Alias: `d`. Return default if value is undefined (or falsy if boolean=true):
```jinja
{{ undefined_var | default("fallback") }}
{{ "" | default("fallback", true) }}
```

### dictsort
Sort dict, yield (key, value) pairs:
```jinja
{% for item in dict | dictsort %}{{ item[0] }}{% endfor %}
```

### dump
JSON.stringify with optional spacing:
```jinja
{{ items | dump }}
{{ items | dump(2) }}
{{ items | dump('\t') }}
```

### escape / e
HTML-escape `&`, `<`, `>`, `'`, `"`:
```jinja
{{ "<html>" | escape }}  → &lt;html&gt;
```

### first / last
Get first/last item or character:
```jinja
{{ [1,2,3] | first }}  → 1
{{ "abc" | last }}     → c
```

### float / int
Convert to float/int (0.0/0 on failure, override with first param):
```jinja
{{ "3.5" | float }}  → 3.5
{{ "3.5" | int }}    → 3
```

### forceescape
Enforce HTML escaping (may double-escape).

### groupby(attribute)
Group sequence by attribute, supports dot notation:
```jinja
{% for type, items in objects | groupby("type") %}
  {{ type }}: {% for item in items %}{{ item.name }}{% endfor %}
{% endfor %}

{% for year, posts in posts | groupby("date.year") %}
  {{ year }}: {% for post in posts %}{{ post.title }}{% endfor %}
{% endfor %}
```

### indent([spaces], [first_line])
Indent lines (default 4 spaces, don't indent first line):
```jinja
{{ "one\ntwo\nthree" | indent }}
{{ "one\ntwo\nthree" | indent(6) }}
{{ "one\ntwo\nthree" | indent(6, true) }}
```

### join([separator], [attribute])
Concatenate with separator (default empty string):
```jinja
{{ [1, 2, 3] | join }}           → 123
{{ ['foo', 'bar'] | join(",") }} → foo,bar
{{ objects | join(",", "name") }}
```

### length
Length of array/string or key count in object:
```jinja
{{ [1,2,3] | length }}  → 3
{{ "test" | length }}   → 4
```

### list
Convert to list of characters:
```jinja
{% for i in "foobar" | list %}{{ i }},{% endfor %}
```
Outputs: `f,o,o,b,a,r,`

### lower / upper
Convert case:
```jinja
{{ "fOObAr" | lower }}  → foobar
{{ "foo" | upper }}     → FOO
```

### nl2br
Replace newlines with `<br />`:
```jinja
{{ "foo\nbar" | nl2br }}  → foo<br />\nbar
```

### random
Select random value from array.

### reject / select
Filter by test (odd, even, divisibleby, etc.):
```jinja
{% set numbers=[0, 1, 2, 3, 4, 5] %}
{{ numbers | reject("odd") | join }}    → 024
{{ numbers | select("even") | join }}   → 024
{{ numbers | reject("divisibleby", 3) | join }}  → 1245
```

### rejectattr / selectattr
Filter objects by attribute test (single-argument form):
```jinja
{% set foods = [{tasty: true}, {tasty: false}] %}
{{ foods | rejectattr("tasty") | length }}  → 1
{{ foods | selectattr("tasty") | length }}  → 1
```

### replace(old, new, [count])
Replace substring:
```jinja
{{ "123456" | replace("4", ".") }}           → 123.56
{{ "aaabbbccc" | replace("a", "x", 2) }}    → xxabbbccc
{{ "aaabbbccc" | replace("ab", "x", 2) }}   → aaxbbccc
```

### reverse
Reverse string or array:
```jinja
{{ "abcdef" | reverse }}  → fedcba
{% for i in [1, 2, 3] | reverse %}{{ i }}{% endfor %}  → 3 2 1
```

### round([digits], [method])
Round number (method: "floor", etc.):
```jinja
{{ 4.5 | round }}           → 5
{{ 4 | round(0, "floor") }} → 4
{{ 4.12346 | round(4) }}    → 4.1235
```

### safe
Mark as safe (won't be escaped with autoescaping enabled):
```jinja
{{ "foo http://example.com/ bar" | urlize | safe }}
```

### slice(count)
Slice into lists:
```jinja
{% for items in [1,2,3,4,5,6,7,8,9] | slice(3) %}
  {% for item in items %}{{ item }}{% endfor %}
{% endfor %}
```
Outputs 3 groups of 3 items.

### sort([reverse], [caseSens], [attr])
Sort with JavaScript sort, optionally by attribute:
```jinja
{{ array | sort }}
{{ array | sort(true) }}
{{ array | sort(false, true) }}
{{ objects | sort(false, false, "name") }}
```

### string
Convert to string:
```jinja
{% for i in 1234 | string | list %}{{ i }},{% endfor %}
```
Outputs: `1,2,3,4,`

### striptags([preserve_linebreaks])
Strip SGML/XML tags, normalize whitespace:
```jinja
{{ text | striptags }}
{{ text | striptags(true) | escape | nl2br }}
```

### sum
Sum array items:
```jinja
{{ [1,2,3] | sum }}  → 6
```

### title
Capitalize first letter of each word:
```jinja
{{ "foo bar baz" | title }}  → Foo Bar Baz
```

### trim
Strip leading/trailing whitespace:
```jinja
{{ "  foo " | trim }}  → foo
```

### truncate([length], [cut], [ellipsis])
Truncate string (default 255 chars, append "..."):
```jinja
{{ "foo bar" | truncate(3) }}                    → foo(...)
{{ "foo bar baz" | truncate(6, true, "?") }}    → foo ba ?
```

### urlencode
URL-escape for UTF-8:
```jinja
{{ "&" | urlencode }}  → %26
```

### urlize([length], [truncate])
Convert URLs to clickable links:
```jinja
{{ "foo http://example.com/ bar" | urlize | safe }}
{{ "http://mozilla.github.io/" | urlize(10, true) | safe }}
```

### wordcount
Count words:
```jinja
{{ "Hello World" | wordcount }}  → 2
```
