## Card Component

A composable card component for displaying structured content with header, content, and footer sections.

### Installation

```bash
npx shadcn-svelte@latest add card -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Structure

The Card component is composed of several sub-components:

- **Card.Root**: Container wrapper
- **Card.Header**: Top section, typically contains title and description
- **Card.Title**: Heading text within header
- **Card.Description**: Subtitle or descriptive text within header
- **Card.Action**: Optional action area within header (e.g., buttons)
- **Card.Content**: Main content area
- **Card.Footer**: Bottom section, typically for actions

### Basic Usage

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
```

### Example: Login Form Card

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>Login to your account</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
    <Card.Action>
      <Button variant="link">Sign Up</Button>
    </Card.Action>
  </Card.Header>
  <Card.Content>
    <form>
      <div class="flex flex-col gap-6">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
      </div>
    </form>
  </Card.Content>
  <Card.Footer class="flex-col gap-2">
    <Button type="submit" class="w-full">Login</Button>
    <Button variant="outline" class="w-full">Login with Google</Button>
  </Card.Footer>
</Card.Root>
```

All sub-components accept standard HTML class attributes for styling via Tailwind CSS.