## Multistep Interfaces

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Two core concepts underpin their design:

**Tool Composition**: Combining multiple tools to create new tools, breaking complex tasks into manageable steps. The composition strategy directly affects both user experience and the model's ability to generate correct outputs.

**Application Context**: The conversation history and state between user and language model. In multistep interfaces, user input in one step affects model output in subsequent steps, making rich context essential for coherent responses.

### Application Context Example

In a meal logging app with `log_meal` and `delete_meal` tools, the model must reference previous actions:

```
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.
...
User: I skipped lunch today, can you update my log?
Tool: delete_meal("chicken shawarma")
Model: Chicken shawarma has been deleted from your log.
```

The model uses context from the first step to correctly identify which meal to delete.

### Tool Composition Example

A flight booking assistant with `searchFlights`, `lookupFlight`, and `bookFlight` tools demonstrates composition:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupFlight("BA123") -> "4 seats available"
Model: Sure, there are seats available! Can you provide the names of the passengers?
User: John Doe and Jane Doe.
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

This can be optimized by composing with a `lookupContacts` tool to auto-populate passenger details:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

Further composition with `lookupBooking` enables complex queries:

```
User: What's the status of my wife's upcoming flight?
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: lookupBooking("Jane Doe") -> "BA123 confirmed"
Tool: lookupFlight("BA123") -> "Flight BA123 is scheduled to depart on 12th December."
Model: Your wife's flight BA123 is confirmed and scheduled to depart on 12th December.
```

The more tools designed to compose together, the more complex and powerful the application becomes. Tool composition reduces user steps by allowing the model to call tools that populate context before using that information to complete tasks.