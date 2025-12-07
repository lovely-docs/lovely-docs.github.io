## Bug Fixes

**PostgreSQL schemaFilter bug**: Fixed an issue where the `schemaFilter` object in push and introspect commands was incorrectly detecting enums in schemas that were not defined in the filter.

**drizzle-kit up command**: Fixed the `drizzle-kit up` command to work correctly starting from the sequences release.