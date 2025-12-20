## Installation

Node: `npm install nunjucks` (add `chokidar` for watch mode)

Browser: Download nunjucks.js (20K) for full library or nunjucks-slim.js (8K) for precompiled templates only.

## Basic Usage

```js
nunjucks.configure({ autoescape: true });
nunjucks.renderString('Hello {{ username }}', { username: 'James' });

// Load from files
nunjucks.configure('views', { autoescape: true });
nunjucks.render('index.html', { foo: 'bar' });

// Express integration
nunjucks.configure('views', { autoescape: true, express: app });
app.get('/', (req, res) => res.render('index.html'));
```

## Security

User-defined templates are unsafe—no sandboxing. Risks: server-side RCE/data access, client-side XSS (even precompiled).

## Browser Files

- **nunjucks.js**: Full compiler, dynamic loading, auto-reload (20K min/gzipped)
- **nunjucks-slim.js**: Precompiled templates only (8K min/gzipped)

Precompile templates in production using grunt/gulp tasks.