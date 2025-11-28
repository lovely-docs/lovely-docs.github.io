## Multistep Interfaces with AI SDK RSC

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Example: a flight booking chatbot with steps to search flights, pick a flight, and check availability.

### Core Concepts

**Tool Composition**: Combining multiple tools to create a new tool, breaking complex tasks into manageable steps. In the flight example, "search flights", "pick flight", and "check availability" compose a "book flight" tool.

**Application Context**: The state of the application including user input, model output, and relevant information. The flight selected in "pick flight" becomes context for "check availability".

### Required Components

- Server Action calling `streamUI` function
- Tool(s) defining sub-tasks
- React component(s) rendered when tools are called
- Page rendering the chatbot

### General Flow

1. User sends message via Server Action using `useActions`
2. Message appended to AI State and passed to model with tools
3. Model calls a tool, rendering corresponding component
4. Within component, use `useActions` to call model and `useUIState` to append response
5. Process repeats for subsequent steps

### Turn-by-Turn Implementation

The simplest multistep approach where user and model alternate. Define tools with `streamUI`:

```tsx
export async function submitUserMessage(input: string) {
  'use server';
  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        inputSchema: z.object({
          source: z.string().describe('The origin of the flight'),
          destination: z.string().describe('The destination of the flight'),
          date: z.string().describe('The date of the flight'),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);
          return (
            <div>
              {results.map(result => (
                <div key={result.id}>{result.flightNumber}</div>
              ))}
            </div>
          );
        },
      },
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('The flight number'),
        }),
        generate: async function* ({ flightNumber }) {
          yield `Looking up details for flight ${flightNumber}...`;
          const details = await lookupFlight(flightNumber);
          return (
            <div>
              <div>Flight Number: {details.flightNumber}</div>
              <div>Departure Time: {details.departureTime}</div>
              <div>Arrival Time: {details.arrivalTime}</div>
            </div>
          );
        },
      },
    },
  });
  return ui.value;
}
```

Create AI context with `createAI`:

```ts
export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});
```

Wrap application in context provider in layout.

Call Server Action from page using `useActions` and `useUIState`:

```tsx
'use client';
export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div>{input}</div>,
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };

  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### Adding User Interaction

Convert tool components to client components and use `useActions` to trigger next steps without requiring user text input. Example: clickable flight results:

```tsx
'use client';
export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div>
      {flights.map(result => (
        <div
          key={result.id}
          onClick={async () => {
            const display = await submitUserMessage(
              `lookupFlight ${result.flightNumber}`,
            );
            setMessages((messages: ReactNode[]) => [...messages, display]);
          }}
        >
          {result.flightNumber}
        </div>
      ))}
    </div>
  );
};
```

Update tool to render interactive component instead of static output.