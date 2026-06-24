# Auto-deploy: GitHub + Vercel

One-time setup. After this, every `git push` to GitHub triggers a Vercel build & redeploy automatically.

---

## Step 1 — Push this folder to GitHub (one time)

The local git repo is already initialized with your first commit. You just need to create a GitHub repo and push.

### Option A — On github.com (easiest)

1. Go to <https://github.com/new>
2. Repository name: `portfolio` (or anything you like)
3. Visibility: **Public** (so Vercel free tier can connect easily)
4. **Do NOT** check "Add a README", "Add .gitignore", or "Add a license" — they already exist locally and will cause a conflict.
5. Click **Create repository**.
6. On the next page, copy the URL under **"…or push an existing repository from the command line"** — it looks like `https://github.com/Mahipal-puri/portfolio.git`.

Then in this folder, run:

```powershell
git remote add origin https://github.com/Mahipal-puri/portfolio.git
git branch -M main
git push -u origin main
```

When git asks for credentials, sign in with your GitHub account in the browser window that pops up.

### Option B — Using GitHub CLI

If you install [GitHub CLI](https://cli.github.com/) (`winget install GitHub.cli`):

```powershell
gh auth login
gh repo create portfolio --public --source=. --remote=origin --push
```

---

## Step 2 — Connect Vercel (one time)

1. Go to <https://vercel.com/signup> and sign in with **GitHub** (so Vercel can see your repos).
2. From the Vercel dashboard click **Add New… → Project**.
3. Find your `portfolio` repo and click **Import**.
4. Settings to use:
   - **Framework Preset:** _Other_ (auto-detected as a static site)
   - **Root Directory:** `./` (default)
   - **Build Command:** _leave empty_
   - **Output Directory:** _leave empty_
5. Click **Deploy**.

After ~30 seconds you'll get a URL like `https://portfolio-mahipalpuri.vercel.app`.

---

## Step 3 — That's it. Auto-deploy is now live.

From now on, every time you edit files locally:

```powershell
git add .
git commit -m "Update hero copy"
git push
```

Vercel sees the push and rebuilds automatically. The URL stays the same; the content updates in ~20–40 seconds.

You can watch the deploy in real time at <https://vercel.com/dashboard>.

---

## Custom domain (optional, free)

In Vercel project → **Settings → Domains** → add `yourname.com` (or a subdomain). Vercel walks you through the DNS step. SSL is automatic.

---

## Common gotchas

- **`git push` says "remote already exists"** → run `git remote remove origin` then re-add it.
- **Vercel deploy says "no files found"** → make sure `index.html` is in the repo root (it is).
- **Three.js doesn't load on the deployed site** → it's loaded from jsdelivr CDN, so check the browser console; usually a content-security-policy issue (none configured here, so it should just work).
- **Contact form doesn't send mail** → you still need to paste your real Web3Forms key into `assets/js/main.js` (line 6 — replace `YOUR_WEB3FORMS_KEY`).
