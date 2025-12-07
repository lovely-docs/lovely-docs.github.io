## ESLint Plugin for Drizzle

An ESLint plugin that provides rules for catching common mistakes during development that are difficult to type-check.

### Installation

```
npm install eslint-plugin-drizzle @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration

Basic setup in `.eslintrc.yml`:
```yml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

Use `extends: ["plugin:drizzle/recommended"]` or `extends: ["plugin:drizzle/all"]` (currently equivalent) to enable all rules at once.

### Rules

**enforce-delete-with-where**

Requires `.where()` clause on `.delete()` statements to prevent accidental deletion of all rows.

Optional `drizzleObjectName` config (string or string[]) restricts the rule to specific object names, useful when other classes have delete methods:

```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public delete() { return {} }
}
const myClassObj = new MyClass();
myClassObj.delete() // OK - not triggered
const db = drizzle(...)
db.delete() // ERROR - triggered
db.delete().where(...) // OK
```

**enforce-update-with-where**

Requires `.where()` clause on `.update()` statements to prevent accidental updates to all rows.

Same `drizzleObjectName` configuration option as enforce-delete-with-where:

```yml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public update() { return {} }
}
const myClassObj = new MyClass();
myClassObj.update() // OK - not triggered
const db = drizzle(...)
db.update() // ERROR - triggered
db.update().where(...) // OK
```