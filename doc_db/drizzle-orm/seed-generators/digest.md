## Seed Generators Reference

Generators are functions used with `drizzle-seed` to create test data. All generators support `arraySize` parameter to generate arrays of values.

**Warning**: Using `arraySize` with `isUnique` generates unique individual values packed into arrays, not unique arrays.

### Basic Generators

**`default(defaultValue, arraySize)`** - Returns the same value each time.
```ts
funcs.default({ defaultValue: "post content", arraySize: 3 })
```

**`valuesFromArray(values, isUnique, arraySize)`** - Picks from given array. Values can be weighted: `{ weight: number; values: any[] }[]`
```ts
funcs.valuesFromArray({ 
  values: ["Title1", "Title2", "Title3"],
  isUnique: true,
  arraySize: 3 
})
```

**`intPrimaryKey()`** - Sequential integers starting from 1.
```ts
funcs.intPrimaryKey()
```

### Numeric Generators

**`number(minValue, maxValue, precision, isUnique, arraySize)`** - Floating point numbers.
- `precision`: 10 = 0.1 accuracy, 100 = 0.01 accuracy
- Default `maxValue`: `precision * 1000` (non-unique) or `precision * count` (unique)
- Default `minValue`: `-maxValue`

```ts
funcs.number({ minValue: 10, maxValue: 120, precision: 100, isUnique: false, arraySize: 3 })
```

**`int(minValue, maxValue, isUnique, arraySize)`** - Integers in range.
- Default `maxValue`: `1000` (non-unique) or `count * 10` (unique)
- Default `minValue`: `-maxValue`

```ts
funcs.int({ minValue: 0, maxValue: 100, isUnique: false, arraySize: 3 })
```

### Boolean & Temporal Generators

**`boolean(arraySize)`** - True or false values.
```ts
funcs.boolean({ arraySize: 3 })
```

**`date(minDate, maxDate, arraySize)`** - Dates in range.
- Defaults: `minDate: '2020-05-08'`, `maxDate: '2028-05-08'`
- If only one date provided, the other is calculated by ±8 years

```ts
funcs.date({ minDate: "1990-01-01", maxDate: "2010-12-31", arraySize: 3 })
```

**`time(arraySize)`** - 24-hour format time.
```ts
funcs.time({ arraySize: 3 })
```

**`timestamp(arraySize)`** - Timestamps.
```ts
funcs.timestamp({ arraySize: 3 })
```

**`datetime(arraySize)`** - Datetime objects.
```ts
funcs.datetime({ arraySize: 3 })
```

**`year(arraySize)`** - Years in YYYY format.
```ts
funcs.year({ arraySize: 3 })
```

**`interval(isUnique, arraySize)`** - Time intervals (e.g., "1 year 12 days 5 minutes").
```ts
funcs.interval({ isUnique: true, arraySize: 3 })
```

### Data Type Generators

**`json(arraySize)`** - JSON objects with random structure containing: email, name, isGraduated, hasJob, salary, startedWorking, visitedCountries (structure picked randomly).
```ts
funcs.json({ arraySize: 3 })
```

**`string(isUnique, arraySize)`** - Random strings.
```ts
funcs.string({ isUnique: false, arraySize: 3 })
```

**`uuid(arraySize)`** - v4 UUID strings.
```ts
funcs.uuid({ arraySize: 3 })
```

### Person & Location Generators

**`firstName(isUnique, arraySize)`** - Person's first name.
```ts
funcs.firstName({ isUnique: true, arraySize: 3 })
```

**`lastName(isUnique, arraySize)`** - Person's last name.
```ts
funcs.lastName({ isUnique: false, arraySize: 3 })
```

**`fullName(isUnique, arraySize)`** - Person's full name.
```ts
funcs.fullName({ isUnique: true, arraySize: 3 })
```

**`email(arraySize)`** - Unique email addresses.
```ts
funcs.email({ arraySize: 3 })
```

**`phoneNumber(template | prefixes, generatedDigitsNumbers, arraySize)`** - Unique phone numbers.
- Template mode: `template: "+(380) ###-####"` (# replaced with digits)
- Prefix mode: `prefixes: ["+380 99", "+380 67"]`, `generatedDigitsNumbers: 7` or `[7, 7, 10]` per prefix

```ts
funcs.phoneNumber({ template: "+(380) ###-####", arraySize: 3 })
funcs.phoneNumber({ prefixes: ["+380 99", "+380 67"], generatedDigitsNumbers: 7, arraySize: 3 })
funcs.phoneNumber({ prefixes: ["+380 99", "+380 67", "+1"], generatedDigitsNumbers: [7, 7, 10], arraySize: 3 })
```

**`country(isUnique, arraySize)`** - Country names.
```ts
funcs.country({ isUnique: false, arraySize: 3 })
```

**`city(isUnique, arraySize)`** - City names.
```ts
funcs.city({ isUnique: false, arraySize: 3 })
```

**`streetAddress(isUnique, arraySize)`** - Street addresses.
```ts
funcs.streetAddress({ isUnique: false, arraySize: 3 })
```

**`postcode(isUnique, arraySize)`** - Postal codes.
```ts
funcs.postcode({ isUnique: true, arraySize: 3 })
```

**`state(arraySize)`** - US states.
```ts
funcs.state({ arraySize: 3 })
```

### Business & Content Generators

**`jobTitle(arraySize)`** - Job titles.
```ts
funcs.jobTitle({ arraySize: 3 })
```

**`companyName(isUnique, arraySize)`** - Company names.
```ts
funcs.companyName({ isUnique: true, arraySize: 3 })
```

**`loremIpsum(sentencesCount, arraySize)`** - Lorem ipsum text.
- Default `sentencesCount`: 1

```ts
funcs.loremIpsum({ sentencesCount: 2, arraySize: 3 })
```

### Geometric Generators

**`point(minXValue, maxXValue, minYValue, maxYValue, isUnique, arraySize)`** - 2D points.
- Default `maxXValue`/`maxYValue`: `10 * 1000` (non-unique) or `10 * count` (unique)
- Default `minXValue`/`minYValue`: `-maxXValue`/`-maxYValue`

```ts
funcs.point({ 
  minXValue: -5, maxXValue: 20, 
  minYValue: 0, maxYValue: 30, 
  isUnique: true, arraySize: 3 
})
```

**`line(minAValue, maxAValue, minBValue, maxBValue, minCValue, maxCValue, isUnique, arraySize)`** - 2D lines (equation: a*x + b*y + c = 0).
- Default ranges: `10 * 1000` (non-unique) or `10 * count` (unique)
- Default min values: `-max` values

```ts
funcs.line({ 
  minAValue: -5, maxAValue: 20,
  minBValue: 0, maxBValue: 30,
  minCValue: 0, maxCValue: 10,
  isUnique: true, arraySize: 3 
})
```

### Usage Pattern

All generators are used within `seed()` refine callback:
```ts
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  tableName: {
    columns: {
      columnName: funcs.generatorName({ /* options */ }),
    },
  },
}));
```