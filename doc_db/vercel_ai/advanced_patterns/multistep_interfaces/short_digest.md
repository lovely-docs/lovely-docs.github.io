## Multistep Interfaces

Multistep interfaces require managing two concepts:

**Tool Composition**: Combining multiple tools to create new tools. Better composition reduces user steps by letting the model populate context before using it.

**Application Context**: Conversation history between user and model. User input in one step affects model output in the next, so rich context is essential.

### Example: Flight Booking

Basic flow requires user to provide passenger details:
```
User: Book flight BA123 on 12th December for myself and my wife.
Tool: lookupFlight("BA123") -> "4 seats available"
Model: Can you provide the names of the passengers?
User: John Doe and Jane Doe.
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
```

Optimized with `lookupContacts` tool composition:
```
User: Book flight BA123 on 12th December for myself and my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

Further composition with `lookupBooking` enables complex queries without extra user input.