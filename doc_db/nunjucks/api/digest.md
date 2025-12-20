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
