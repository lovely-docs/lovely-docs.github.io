# API

## Simple API
```js
nunjucks.render('foo.html', { username: 'James' });
nunjucks.renderString('Hello {{ username }}', { username: 'James' });
var template = nunjucks.compile('Hello {{ username }}');
nunjucks.configure('views', { autoescape: true, watch: true });
```

## Environment
```js
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
env.render('foo.html', { username: 'James' });
env.addFilter('shorten', function(str, count) { return str.slice(0, count || 5); });
env.addExtension('MyExt', new MyExtension());
env.addGlobal('siteName', 'My Site');
```

## Loaders
- **FileSystemLoader** (node): `new nunjucks.FileSystemLoader('views')`
- **WebLoader** (browser): `new nunjucks.WebLoader('/views')`
- **NodeResolveLoader** (node): uses `require.resolve`
- **Custom**: implement `getSource(name)` returning `{ src, path, noCache }`

## Precompiling
```bash
nunjucks-precompile views > templates.js
```
```js
nunjucks.precompile('/dir/to/views', { env: env });
```

## Custom Filters
```js
env.addFilter('shorten', function(str, count) {
    return str.slice(0, count || 5);
});
// Usage: {{ message|shorten(20) }}

// Async:
env.addFilter('lookup', function(name, callback) {
    db.getItem(name, callback);
}, true);
```

## Custom Tags
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
    this.run = function(context, arg, body) { return body(); };
}
env.addExtension('MyExtension', new MyExtension());
```

## Async Support
```js
nunjucks.render('foo.html', function(err, res) { });
```
Rules: use async API, specify async filters at compile-time, use `asyncEach` instead of `for` with async loaders.

## Security
**Do not run user-defined templates** - no sandboxing. Exposes RCE on server, XSS on client.
