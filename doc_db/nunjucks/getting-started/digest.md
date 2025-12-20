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