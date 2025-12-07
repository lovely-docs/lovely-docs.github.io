**Rest parameters**: `[...file]` matches variable segments. `/[org]/[repo]/tree/[branch]/[...file]` → `{org, repo, branch, file}`. Validate with matchers.

**Optional parameters**: `[[lang]]/home` matches `home` and `en/home`. Can't follow rest params.

**Matchers**: `src/params/fruit.js` validates params; use `[page=fruit]` in routes.

**Sorting**: Specificity > matchers > optional/rest > alphabetical.

**Encoding**: Special chars use hex `[x+nn]` (e.g., `:` → `[x+3a]`) or Unicode `[u+nnnn]`.

**Layout groups**: `(app)` and `(marketing)` group routes without affecting URLs. Use `+page@segment` or `+layout@segment` to break out of layout hierarchy. Root layout applies to all unless routes are in groups that exclude it.