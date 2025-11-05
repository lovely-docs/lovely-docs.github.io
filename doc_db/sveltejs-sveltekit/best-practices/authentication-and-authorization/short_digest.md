**Sessions vs JWT**: Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked.

**SvelteKit Integration**: Check auth cookies in server hooks, store user info in `locals`.

**Use framework-specific libraries** like Lucia for auth implementation.