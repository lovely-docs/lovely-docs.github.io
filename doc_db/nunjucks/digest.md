## Complete Reference

Nunjucks is a templating engine for JavaScript (Node.js and browser) inspired by Jinja2/Twig.

**Security Warning**: Does not sandbox execution. Never run user-defined templates or inject user content into template definitions—exposes RCE on server and XSS on client.

### Installation & Setup
- Node: `npm install nunjucks` (add `chokidar` for watch mode)
- Browser: Full library (20K min/gzipped) or slim version (8K, precompiled only)
- Configure: `nunjucks.configure('views', { autoescape: true, express: app, watch: true, noCache: false })`
- Options: `autoescape`, `throwOnUndefined`, `trimBlocks`, `lstripBlocks`, `watch`, `noCache`, `web.useCache`, `web.async`, `tags` (custom syntax)

### Simple API
- `nunjucks.render('foo.html', context, [callback])` - render by name
- `nunjucks.renderString('Hello {{ name }}', context)` - render string
- `nunjucks.compile('Hello {{ name }}')` - compile to reusable Template
- `nunjucks.installJinjaCompat()` - add Jinja compatibility (True/False, Python slices/methods)

### Environment (Central Object)
```js
var env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader('views'),
  { autoescape: false }
);
env.render('foo.html', context, [callback]);
env.renderString(str, context);
env.addFilter('name', fn); env.getFilter('name');
env.addExtension('Name', ext); env.removeExtension('Name');
env.addGlobal('siteName', 'My Site');
env.getTemplate('page.html', [eager], [callback]);
env.express(app); // install as express engine
env.on('load', function(name, source, loader) { });
```

### Loaders
- **FileSystemLoader**: `new nunjucks.FileSystemLoader('views')` or `['views', 'templates']`, options: `watch`, `noCache`
- **WebLoader**: `new nunjucks.WebLoader('/views')`, options: `useCache`, `async`
- **NodeResolveLoader**: Uses `require.resolve`
- **Custom**: Extend `nunjucks.Loader` with `getSource(name)` returning `{ src, path, noCache }`, or async with callback

### Template Syntax

**Variables & Filters**:
```jinja
{{ foo.bar }} {{ foo["bar"] }}
{{ foo | title | upper }}
{{ foo | join(",") }}
{{ foo | replace("a", "b") | capitalize }}
{{ foo | default("fallback") }}
{{ foo | default("fallback", true) }}  {# true if falsy #}
```

**Inheritance**:
```jinja
{# parent.html #}
{% block header %}Default{% endblock %}
{% block content %}{% endblock %}

{# child.html #}
{% extends "parent.html" %}
{% block content %}Child content{% endblock %}
{% block header %}{{ super() }} + more{% endblock %}
```

**Control Flow**:
```jinja
{% if condition and other or not foo %}...{% elif x %}...{% else %}...{% endif %}
{% for item in items %}{{ item }}{% endfor %}
{% for key, value in obj %}{{ key }}: {{ value }}{% endfor %}
{% for item in items %}...{% else %}empty{% endfor %}
{# loop.index, loop.index0, loop.revindex, loop.first, loop.last, loop.length #}
```

**Composition**:
```jinja
{% include "item.html" %}
{% include "item.html" ignore missing %}
{% import "forms.html" as forms %}
{{ forms.label('Username') }}
{% from "forms.html" import field, label %}
{% from "forms.html" import field with context %}

{% macro field(name, value='', type='text') %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}" />
{% endmacro %}
{{ field('user') }} {{ field('pass', type='password') }}

{% set username = "joe" %}
{% set x, y, z = 5 %}
{% set modal %}{% include 'modal.html' %}{% endset %}

{% call add(1, 2) %}The result is{% endcall %}
```

**Async**:
```jinja
{% asyncEach item in items %}...{% endeach %}
{% asyncAll item in items %}...{% endall %}
```

**Other**:
```jinja
{% raw %}{{ not processed }}{% endraw %}
{% filter title %}may the force be with you{% endfilter %}
{# comment #}
{% for i in [1,2,3] -%}{{ i }}{%- endfor %}  {# whitespace control #}
{{ "true" if foo else "false" }}  {# ternary #}
```

**Expressions**: Literals (strings, numbers, arrays, dicts, booleans), math (`+`, `-`, `/`, `//`, `%`, `*`, `**`), comparisons (`==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`), logic (`and`, `or`, `not`), regex (`r/pattern/flags`), function calls.

**Keyword Arguments**:
```jinja
{{ foo(1, 2, bar=3, baz=4) }}
{% macro foo(x, y, z=5, w=6) %}...{% endmacro %}
{{ foo(1, 2) }} → 1, 2, 5, 6
{{ foo(1, 2, w=10) }} → 1, 2, 5, 10
```

### Builtin Filters (40+)
`abs`, `batch(n)`, `capitalize`, `center`, `default(val, [bool])`, `dictsort`, `dump([spacing])`, `escape`/`e`, `first`/`last`, `float`/`int`, `forceescape`, `groupby(attr)`, `indent([spaces], [first])`, `join([sep], [attr])`, `length`, `list`, `lower`/`upper`, `nl2br`, `random`, `reject(test, [arg])`/`select(test, [arg])`, `rejectattr(attr)`/`selectattr(attr)`, `replace(old, new, [count])`, `reverse`, `round([digits], [method])`, `safe`, `slice(n)`, `sort([reverse], [caseSens], [attr])`, `string`, `striptags([preserve])`, `sum`, `title`, `trim`, `truncate([len], [cut], [ellipsis])`, `urlencode`, `urlize([len], [truncate])`, `wordcount`

### Global Functions
- `range([start], stop, [step])` - generate numbers
- `cycler(item1, item2, ...)` - cycle through values, `.next()` and `.current`
- `joiner([sep])` - output separator on all calls except first

### Custom Filters
```js
env.addFilter('shorten', function(str, count) {
    return str.slice(0, count || 5);
});
// Usage: {{ message | shorten }} or {{ message | shorten(20) }}

// Keyword arguments:
env.addFilter('foo', function(num, x, y, kwargs) {
   return num + (kwargs.bar || 10);
});
// Usage: {{ 5 | foo(1, 2, bar=3) }}

// Async:
env.addFilter('lookup', function(name, callback) {
    db.getItem(name, callback);
}, true); // third arg: true for async
env.renderString('{{ item|lookup }}', function(err, res) { });
```

### Custom Tags/Extensions
```js
function MyExtension() {
    this.tags = ['mytag'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endmytag');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);
    };
    this.run = function(context, arg1, body) {
        return new nunjucks.runtime.SafeString('<div>' + body() + '</div>');
    };
}
env.addExtension('MyExtension', new MyExtension());

// Async: use CallExtensionAsync, callback(err, res)
```

Parser methods: `parseSignature([throwErrors], [noParens])`, `parseUntilBlocks(names)`, `advanceAfterBlockEnd()`

### Precompiling (Browser)
```bash
nunjucks-precompile views > templates.js
nunjucks-precompile views/base.html >> templates.js
nunjucks-precompile views -a asyncFilter1,asyncFilter2 > templates.js
```

```js
nunjucks.precompile('/dir/to/views', {
    name: 'template-name',
    asFunction: false,
    force: false,
    env: env,
    include: /pattern/,
    exclude: /pattern/,
    wrapper: function(templates, opts) { }
});
nunjucks.precompileString(str, [opts]);
```

Recommended: Precompile in production, use slim library (8K) + precompiled templates.

### Autoescaping
Default enabled. Disable with `autoescape: false`. Use `safe` filter to mark output as safe, or `escape` filter to manually escape.

### Custom Syntax
```js
nunjucks.configure('/path/to/templates', {
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

### Async Rendering
Use callback-based API: `nunjucks.render('foo.html', function(err, res) { })`

Rules: Always use async API, async filters/extensions must be known at compile-time, with async loaders can't load templates in `for` loops—use `asyncEach` instead.

### Express Integration
```js
var app = express();
nunjucks.configure('views', { autoescape: true, express: app });
app.get('/', function(req, res) {
    res.render('index.html');
});
```

### File Extensions
Community standard: `.njk`. Syntax highlighting available for Atom, Vim, Brackets, Sublime, Emacs, VSCode.