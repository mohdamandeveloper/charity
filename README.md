# Charity Website — Hugo + Sveltia CMS

A fast, secure charity website that non-technical staff can update from a
simple dashboard at `/admin/`.

- **Site generator:** [Hugo](https://gohugo.io) — turns content into plain HTML files
- **Content manager:** [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (free, open source, Decap CMS–compatible)
- **Deploy:** GitHub Actions builds the site and uploads it to **your own hosting** by FTP or SSH
- **Donations:** Razorpay Payment Pages (or any payment link) — no payment data on your server
- **Forms:** Web3Forms (free) — no PHP or database on your server

Your hosting only stores HTML, CSS, JS and images. There is no database, no
PHP and no login page on your server, so there is almost nothing to hack.

```
Editor  →  /admin/ (Sveltia CMS)  →  GitHub repo  →  GitHub Action builds  →  FTP/SSH  →  Your hosting
```

---

## What's included

| Area | Pages |
|---|---|
| Home | Hero, featured campaigns, event banner, stats, "why give", cause funds, categories, community, news, "need help" band |
| Donate | Campaign list with category filter, campaign detail with progress bar, days left, share buttons; cause funds; general donate page with UPI and bank details |
| About | What we do, team, annual reports (PDF list), community |
| Get involved | Volunteer and partner pages with forms |
| Help | Need help / refer a case form, contact page, FAQs |
| Other | News & stories, privacy, terms, 404, sitemap, RSS |

Everything an editor needs is in the CMS:

| CMS section | What it edits |
|---|---|
| **Campaigns** | Add/close campaigns, update amount raised, photos, stories |
| **Cause Funds** | Pooled cause-based funds |
| **News & Stories** | Blog posts |
| **Pages** | About, Donate, Volunteer, Contact, FAQs, Reports… |
| **Homepage** | Every homepage section and its text, images and numbers |
| **Settings** | Charity name, logo, contact details, donation links, UPI/bank details, form key, social links, menus, team members |

---

## 1. Run it on your computer (optional)

Install [Node.js](https://nodejs.org) (v18+), then:

```bash
npm install          # installs Hugo
npm run dev          # opens http://localhost:1313
```

To edit content locally without GitHub, open `http://localhost:1313/admin/`
in Chrome or Edge and choose **Work with Local Repository**, then select this
project folder.

## 2. Put the code on GitHub

1. Create a **private** repository on GitHub, e.g. `my-charity-website`.
2. Upload this folder to it (GitHub Desktop is the easiest way).
3. In `static/admin/config.yml`, change:
   ```yaml
   repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
   site_url: https://www.yourdomain.org
   display_url: https://www.yourdomain.org
   ```
4. In `hugo.toml`, set `baseURL` to your domain.

## 3. Connect your hosting (automatic deploy)

In the GitHub repo go to **Settings → Secrets and variables → Actions → New
repository secret** and add:

| Secret | Example |
|---|---|
| `FTP_SERVER` | `ftp.yourdomain.org` |
| `FTP_USERNAME` | your cPanel / FTP username |
| `FTP_PASSWORD` | your FTP password |
| `FTP_REMOTE_DIR` | `/public_html/` (must end with `/`) |
| `SITE_URL` | `https://www.yourdomain.org/` |

Tip: create a **separate FTP account** in cPanel that can only access
`public_html`, and use that here.

Push any change (or run the workflow manually from the **Actions** tab). The
site is built and uploaded in about a minute. It also rebuilds daily so the
"Ends in X days" counters stay correct.

**Using a VPS or hosting with SSH?** Open `.github/workflows/deploy.yml`, remove
Option A and uncomment Option B (rsync over SSH).

## 4. Give editors access to /admin/

Editors need a free GitHub account with access to the repository
(**Settings → Collaborators → Add people**). Then they can sign in at
`https://www.yourdomain.org/admin/` in one of two ways:

**Option 1 — Personal access token (no setup, fine for 1–3 editors)**
1. Each editor creates a fine-grained token at GitHub → Settings → Developer
   settings → Personal access tokens, with **Contents: Read and write** on this
   repository only.
2. At `/admin/`, choose **Sign in with Token** and paste it.

**Option 2 — "Sign in with GitHub" button (best for non-technical teams)**
1. Deploy the free [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   Cloudflare Worker (one click).
2. Create a GitHub OAuth app with callback URL `https://YOUR-WORKER-URL/callback`.
3. Add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and
   `ALLOWED_DOMAINS=www.yourdomain.org` to the Worker.
4. Uncomment `base_url:` in `static/admin/config.yml` and paste the Worker URL.

## 5. Set up donations and forms

**Donations (Razorpay):** create a Payment Page in the Razorpay dashboard for
general donations, and optionally one per campaign. Paste the links in
**CMS → Settings → Site settings → Donations** and in each campaign's
**Donation link** field. Razorpay can collect PAN and send receipts; check
their settings for 80G receipt details.

After donations come in, update **Amount raised** on the campaign in the CMS.

**Forms (Web3Forms):** get a free access key at
[web3forms.com](https://web3forms.com) using your charity's email, then paste
it in **CMS → Settings → Site settings → Forms**. Volunteer, partner, contact
and "need help" submissions will arrive by email.

---

## Everyday editing guide (for staff)

- **Add a campaign:** Campaigns → New Campaign → fill in title, photo, summary,
  categories, goal, end date and story → Save. Live in about a minute.
- **Update amount raised:** open the campaign → change *Amount raised* → Save.
- **Close a campaign:** set *Status* to `closed`. It moves to "Completed".
- **Feature a campaign on the homepage:** switch on *Feature on homepage*.
- **Change homepage text or numbers:** Homepage → Homepage sections.
- **Add a news post:** News & Stories → New.
- **Upload an annual report:** Pages → Annual Reports → add a report → upload PDF.
- **Change menu links:** Settings → Menus.

Only use photos that families have agreed to share.

## Customising the design

- Colours and fonts: top of `assets/css/main.css` (`--brand`, `--accent`)
- Page templates: `layouts/`
- Campaign categories: `static/admin/config.yml` (`options:` list) and
  **Homepage → Category groups** — names must match

## Security checklist

- Keep the GitHub repo **private** and turn on **two-factor login** for every
  GitHub account with access.
- Give editors repository access only — not organisation owner.
- Use a dedicated FTP account limited to `public_html`, and FTPS or SSH.
- `static/.htaccess` forces HTTPS, sets security headers and blocks scripts in
  the uploads folder (Apache/LiteSpeed hosting).
- Free extra protection: put your domain behind Cloudflare.

**Nginx hosting?** Add `error_page 404 /404.html;` and the equivalent security
headers to your server block.
