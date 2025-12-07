## Multistep Interfaces

Two core concepts: **Tool Composition** (combining tools into new tools) and **Application Context** (application state that flows between steps).

**Example**: Meal logging app where deleting a meal references previously logged meals from context.

**Example**: Flight booking with composed tools—`lookupContacts()` populates context before `bookFlight()`, and `lookupBooking()` + `lookupFlight()` chain together to answer status queries without user providing passenger names.

More composed tools = more complex, powerful applications.