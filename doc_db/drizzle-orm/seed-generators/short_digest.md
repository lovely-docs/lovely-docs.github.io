## Seed Generators

All generators support optional `arraySize` to generate arrays. Warning: `arraySize` + `isUnique` generates unique values packed into arrays, not unique arrays.

**Basic**: `default(value)`, `valuesFromArray(values, isUnique)`, `intPrimaryKey()`

**Numeric**: `number(min, max, precision, isUnique)`, `int(min, max, isUnique)`

**Temporal**: `date(min, max)`, `time()`, `timestamp()`, `datetime()`, `year()`, `interval(isUnique)`

**Data**: `json()`, `string(isUnique)`, `uuid()`

**Person**: `firstName(isUnique)`, `lastName(isUnique)`, `fullName(isUnique)`, `email()`

**Location**: `country(isUnique)`, `city(isUnique)`, `streetAddress(isUnique)`, `postcode(isUnique)`, `state()`

**Phone**: `phoneNumber(template | prefixes, generatedDigitsNumbers)` - template mode uses `#` for digits, prefix mode appends generated digits

**Business**: `jobTitle()`, `companyName(isUnique)`, `loremIpsum(sentencesCount)`

**Geometric**: `point(minX, maxX, minY, maxY, isUnique)`, `line(minA, maxA, minB, maxB, minC, maxC, isUnique)`

Usage: `seed(db, schema, {count}).refine((funcs) => ({ table: { columns: { col: funcs.generator({options}) } } }))`