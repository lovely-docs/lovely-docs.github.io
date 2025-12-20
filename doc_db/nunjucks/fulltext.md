

## Pages

### api
Complete API reference: simple API (render, renderString, compile, configure), Environment class, loaders (FileSystem, Web, NodeResolve, custom), precompiling, custom filters (sync/async with keyword args), custom tags/extensions (sync/async), async rendering, autoescaping, syntax customization, security warning against user-defined templates.

# API

## Security Warning

Nunjucks does not sandbox execution. **Do not run user-defined templates or inject user-defined content into template definitions**. On the server, this exposes attack vectors for accessing sensitive data and remote code execution. On the client, this exposes XSS vulnerabilities even for precompiled templates (mitigable with strong CSP).

## Simple API

### render
```js
var res = nunjucks.render('foo.html');
var res = nunjucks.render('foo.html', { username: 'James' });
nunjucks.render('async.html', function(err, res) {});
```
Renders template by name with optional context. Returns result or calls callback.

### renderString
```js
var res = nunjucks.renderString('Hello {{ username }}', { username: 'James' });
```
Renders raw string instead of loading a template.

### compile
```js
var template = nunjucks.compile('Hello {{ username }}');
template.render({ username: 'James' });
```
Compiles string into reusable Template object.

### configure
```js
nunjucks.configure('views');
nunjucks.configure('/views'); // browser: absolute URL
nunjucks.configure({ autoescape: true });
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
var env = nunjucks.configure('views');
```
Configures template location and options. Returns Environment instance.

Options:
- **autoescape** (default: true) - escape dangerous characters
- **throwOnUndefined** (default: false) - throw on null/undefined output
- **trimBlocks** (default: false) - remove trailing newlines from blocks
- **lstripBlocks** (default: false) - remove leading whitespace from blocks
- **watch** (default: false) - reload templates on change (requires chokidar)
- **noCache** (default: false) - never cache, recompile each time
- **web** - browser config:
  - **useCache** (default: false) - cache templates forever
  - **async** (default: false) - load templates asynchronously
- **express** - express app to install to
- **tags** - custom syntax for tags

**Warning**: Simple API always uses most recent `configure` call. Use explicit environment instead: `var env = nunjucks.configure(...); env.render(...)`

### installJinjaCompat
```js
nunjucks.installJinjaCompat()
```
Adds experimental Jinja compatibility: `True`/`False` constants, Python slice syntax, Python-style array/object methods.

## Environment

Central object handling templates, loading, inheritance, and includes.

### constructor
```js
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), { autoescape: false });
var env = new nunjucks.Environment([new nunjucks.FileSystemLoader('views'), new MyCustomLoader()]);
var env = new nunjucks.Environment(new nunjucks.WebLoader('/views'));
```
Takes loaders (single or array) and options. Loaders default to current directory/URL if null.

### render / renderString
```js
var res = env.render('foo.html');
var res = env.render('foo.html', { username: 'James' });
env.render('async.html', function(err, res) {});
var res = env.renderString('Hello {{ username }}', { username: 'James' });
```

### addFilter / getFilter
```js
env.addFilter('shorten', function(str, count) {
    return str.slice(0, count || 5);
});
var filter = env.getFilter('shorten');
```
Add custom filter or retrieve existing. Returns env for chaining.

### addExtension / removeExtension / getExtension / hasExtension
```js
env.addExtension('MyExt', new MyExtension());
env.removeExtension('MyExt');
var ext = env.getExtension('MyExt');
if(env.hasExtension('MyExt')) { }
```

### addGlobal / getGlobal
```js
env.addGlobal('siteName', 'My Site');
var val = env.getGlobal('siteName');
```
Add global value available to all templates. Returns env for chaining.

### getTemplate
```js
var tmpl = env.getTemplate('page.html');
var tmpl = env.getTemplate('page.html', true); // eager compile
env.getTemplate('async.html', function(err, tmpl) {});
```
Retrieve template by name. Optionally eager compile or use async callback.

### express
```js
var app = express();
env.express(app);
app.get('/', function(req, res) {
    res.render('index.html');
});
```
Install nunjucks as express rendering engine. Returns env for chaining.

### opts.autoescape
```js
if(env.opts.autoescape) { /* ... */ }
```
Boolean property indicating if autoescaping is enabled globally.

### 'load' event
```js
env.on('load', function(name, source, loader) {
    // name: template name (String)
    // source: { src, path, noCache }
    // loader: Loader instance
});
```
Emitted when loader retrieves template source.

## Template

Handles compiling and rendering template strings. Usually managed by Environment.

### constructor
```js
var tmpl = new nunjucks.Template('Hello {{ username }}');
tmpl.render({ username: "James" }); // -> "Hello James"
```
Takes template string, optional Environment, optional path for debugging, optional eagerCompile flag.

### render
```js
tmpl.render(context, [callback])
```
Render with optional context. Returns result or calls callback.

## Loaders

Load templates from various sources.

### FileSystemLoader (node only)
```js
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['views', 'templates']));
```
Loads from filesystem. Options:
- **watch** - auto-update on file change (requires chokidar)
- **noCache** - recompile every time

### NodeResolveLoader (node only)
```js
new nunjucks.NodeResolveLoader([opts])
```
Loads using node's `require.resolve`. Same options as FileSystemLoader.

### WebLoader (browser only)
```js
var env = new nunjucks.Environment(new nunjucks.WebLoader('/views'))
```
Loads from URL (same domain). Options:
- **useCache** (default: false) - cache forever
- **async** (default: false) - load asynchronously

Automatically uses precompiled templates if available.

### Custom Loader
```js
function MyLoader(opts) { }
MyLoader.prototype.getSource = function(name) {
    return { src: '...', path: '...', noCache: false };
};

// For tracking updates:
var MyLoader = nunjucks.Loader.extend({
    init: function() { /* setup watching */ },
    getSource: function(name) { /* load template */ }
});

// For async:
var MyLoader = nunjucks.Loader.extend({
    async: true,
    getSource: function(name, callback) {
        callback(err, { src: '...', path: '...' });
    }
});
```
Create object with `getSource(name)` method returning `{ src, path, noCache }`. Extend `nunjucks.Loader` to emit 'update' events. Add `async: true` for async loaders (callback-based).

**Warning**: With async loaders, can't load templates inside `for` loops. Use `asyncEach` tag instead.

## Browser Usage

### Precompiling

```bash
nunjucks-precompile views > templates.js
nunjucks-precompile views/base.html >> templates.js
```

Precompile templates to JavaScript. Load precompiled file on page and system automatically uses them.

Options: `-a foo,bar,baz` for async filter names.

### Recommended Setup #1: Precompile in production only
1. Load nunjucks.js
2. Render templates dynamically during development
3. Precompile templates for production

### Recommended Setup #2: Always precompile
1. Use grunt/gulp task to watch and auto-precompile
2. Load nunjucks-slim.js (8K, no compiler) and templates.js
3. Same code for dev and production

### precompile API
```js
var env = new nunjucks.Environment();
env.addExtension('MyExtension', new MyExtension());
env.addFilter('asyncFilter', function(val, cb) { }, true);
nunjucks.precompile('/dir/to/views', { env: env });
```
Programmatically precompile. Options:
- **name** - template name (required for string, optional for file)
- **asFunction** - generate callable function
- **force** - keep compiling on error
- **env** - Environment (gets extensions and async filters)
- **include** / **exclude** - file/folder filters
- **wrapper** - `function(templates, opts)` to customize output format

### precompileString
```js
nunjucks.precompileString(str, [opts])
```
Same as precompile but for raw string.

## Asynchronous Support

Use async API when custom filters/extensions make async calls or using async loaders.

```js
nunjucks.render('foo.html', function(err, res) {
   // check err and handle result
});
```

**Rules for async templates:**
- Always use async API (callback-based render)
- Async filters/extensions must be known at compile-time (specify when precompiling)
- With async loaders, can't load templates in `for` loops - use `asyncEach` tag instead

## Autoescaping

```js
var env = nunjucks.configure('/path/to/templates', { autoescape: false });
```
By default, all output is escaped. Set `autoescape: false` to disable.

## Customizing Syntax

```js
var env = nunjucks.configure('/path/to/templates', {
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  }
});
```
Templates then use: `<% for item in items %> <$ item $> <% endfor %>`

## Custom Filters

```js
var env = new nunjucks.Environment();
env.addFilter('shorten', function(str, count) {
    return str.slice(0, count || 5);
});
```
Usage: `{{ message|shorten }}` or `{{ message|shorten(20) }}`

### Keyword Arguments
```js
env.addFilter('foo', function(num, x, y, kwargs) {
   return num + (kwargs.bar || 10);
});
```
Usage: `{{ 5 | foo(1, 2) }}` → 15, `{{ 5 | foo(1, 2, bar=3) }}` → 8

Positional args must come before keyword args.

### Asynchronous Filters
```js
env.addFilter('lookup', function(name, callback) {
    db.getItem(name, callback);
}, true); // third arg: true for async

env.renderString('{{ item|lookup }}', function(err, res) {
    // do something with res
});
```
Callback signature: `callback(err, res)`. When precompiling, specify async filter names with `-a`.

## Custom Tags / Extensions

```js
function RemoteExtension() {
    this.tags = ['remote'];

    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        var body = parser.parseUntilBlocks('error', 'endremote');
        var errorBody = null;

        if(parser.skipSymbol('error')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endremote');
        }

        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
    };

    this.run = function(context, url, body, errorBody) {
        var id = 'el' + Math.floor(Math.random() * 10000);
        var ret = new nunjucks.runtime.SafeString('<div id="' + id + '">' + body() + '</div>');
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4) {
                if(ajax.status == 200) {
                    document.getElementById(id).innerHTML = ajax.responseText;
                }
                else {
                    document.getElementById(id).innerHTML = errorBody();
                }
            }
        };

        ajax.open('GET', url, true);
        ajax.send();

        return ret;
    };
}

env.addExtension('RemoteExtension', new RemoteExtension());
```
Usage: `{% remote "/stuff" %} content {% error %} error content {% endremote %}`

Extension object needs `tags` array and `parse` method. Parser methods:
- `parseSignature([throwErrors], [noParens])` - parse arguments
- `parseUntilBlocks(names)` - parse content until block in names array

Use `CallExtension` node to call extension method at runtime with parsed args and content blocks.

### Asynchronous Extensions
```js
this.run = function(context, url, body, errorBody, callback) {
   // do async stuff and then call callback(err, res)
};
```
Use `CallExtensionAsync` node instead. Callback signature: `callback(err, res)`.

When precompiling, must install extensions at compile-time using precompiling API.


### getting-started
Installation (npm/browser), basic configuration and rendering, Express integration, security warning about user-defined templates, browser file selection (full vs slim).

## Security Warning

Nunjucks does not sandbox execution. User-defined templates and user-injected content are unsafe:
- Server: exposes attack vectors for sensitive data access and remote code execution
- Client: exposes XSS vulnerabilities even in precompiled templates (mitigable with CSP)

## Installation

Node.js:
```
npm install nunjucks
npm install nunjucks chokidar  # for watch mode
```

Browser: Download [nunjucks.js](files/nunjucks.js) or [nunjucks.min.js](files/nunjucks.min.js) for full library (20K min/gzipped), or [nunjucks-slim.js](files/nunjucks-slim.js) / [nunjucks-slim.min.js](files/nunjucks-slim.min.js) for precompiled templates only (8K min/gzipped).

Supports all modern browsers and Node.js versions currently maintained by Node.js Foundation.

## Basic Usage

Configure and render a string:
```js
nunjucks.configure({ autoescape: true });
nunjucks.renderString('Hello {{ username }}', { username: 'James' });
```

Load templates from files:
```js
nunjucks.configure('views', { autoescape: true });
nunjucks.render('index.html', { foo: 'bar' });
```

In Node, `'views'` is a filesystem path. In browser, it's a relative/absolute URL.

Express integration:
```js
var app = express();
nunjucks.configure('views', { autoescape: true, express: app });
app.get('/', function(req, res) {
    res.render('index.html');
});
```

## Browser Usage

Include as script tag:
```html
<script src="nunjucks.js"></script>
```

Or as AMD module:
```js
define(['nunjucks'], function(nunjucks) { });
```

Precompiled templates are automatically picked up by the system. Use grunt or gulp tasks to precompile templates for production. Same code works in development and production with precompiled templates.

## File Selection Guide

- **nunjucks.js**: Full library with compiler. Supports dynamic template loading, auto-reload, and precompiled templates. Use for development or production if file size isn't a concern.
- **nunjucks-slim.js**: Precompiled templates only. No compiler. Smaller file size. Use for production or development with build tools (grunt/gulp) that auto-recompile.

Always precompile templates in production.

### templating
Nunjucks templating: variables, filters, inheritance (extends/block/super), control flow (if/for), composition (include/import/macro/set), expressions, whitespace control, 40+ builtin filters, global functions—no sandboxing.

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


