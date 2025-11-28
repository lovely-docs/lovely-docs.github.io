## Deploying AI Applications to Vercel

Deploy Next.js AI applications to Vercel using git-centered workflow with automatic deployments on main branch pushes.

### Prerequisites
- Vercel account
- Git provider account (GitHub, GitLab, or Bitbucket)
- OpenAI API key

### Setup Steps

**1. Prepare Local Repository**
Ensure `.gitignore` excludes `.env` and `node_modules`:
```bash
git add .
git commit -m "init"
```

**2. Create Git Repository**
Create repository on GitHub, then push existing repository:
```bash
git remote add origin <repository-url>
git branch -M main
git push -u origin main
```
If "remote origin already exists" error occurs:
```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

**3. Import to Vercel**
- Go to vercel.com/new
- Select Git provider and authenticate
- Click Import on your repository
- Expand "Environment Variables" section and paste `.env.local` contents (Vercel auto-parses key:value format)
- Click Deploy button

### Infrastructure Considerations

**Function Duration**
Vercel serverless functions default to 10 second maximum on Hobby Tier. LLM responses may exceed this. Set custom duration in route handler or server action:
```ts
export const maxDuration = 30;
```
Maximum 60 seconds on Hobby Tier; check documentation for other tier limits.

### Security Measures

**Rate Limiting**
Implement rate limiting to regulate requests per client within time frame. Reference Vercel's rate limiting guide.

**Firewall**
Use Vercel Firewall for DDoS protection and unauthorized access prevention. Enterprise teams get custom IP blocking rules and dedicated support.

### Troubleshooting
- Streaming not working when proxied
- Timeouts on Vercel