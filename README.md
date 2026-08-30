# Kneaded Therapy Website

Static multi-page site for Kneaded Therapy (cookies & brownies bakery brand).

## Pages
- `index.html` — Home
- `menu.html` — Menu
- `about.html` — About / brand story
- `drops.html` — Storybook Drops (limited editions)
- `contact.html` — Contact form
- `order.html` — Order form (Hyderabad delivery only, next-morning delivery messaging)
- `thank-you.html` — Order confirmation page (shown after a successful order submission)
- `google-apps-script.gs` — Backend script for the order form (see setup below). Not part of the live site itself — it's pasted into Google Apps Script, not hosted on GitHub Pages.

## Host on GitHub Pages
1. Create a new GitHub repo (e.g. `kneaded-therapy-website`).
2. Push everything in this folder to the repo root (or a `docs/` folder).
3. In the repo: **Settings → Pages → Source**, select the branch and folder (root, or `/docs`).
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Setting up the order form (Google Sheet + Apps Script) — required before orders will reach you
The order form on `order.html` posts to a free Google Apps Script "Web App" that you deploy yourself. It logs every order as a row in a Google Sheet you own, and emails you the details — no monthly cap, no third-party service, no cost. Until you complete this step, the form has nowhere to send orders.

**1. Create the Sheet and script**
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet. Name it something like "Kneaded Therapy Orders".
2. In the menu, click **Extensions → Apps Script**. A new tab opens with a code editor.
3. Delete the placeholder `function myFunction() {...}` code that's already there.
4. Open `google-apps-script.gs` from this folder, copy its entire contents, and paste it into the Apps Script editor.
5. Check the `NOTIFY_EMAIL` line near the top — it's already set to `rishikasalarpuria@gmail.com`, change it if needed.
6. Click the **Save** icon (or Ctrl/Cmd+S).

**2. Deploy it as a web app**
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set **Execute as**: `Me`. Set **Who has access**: `Anyone`.
4. Click **Deploy**. Google will ask you to authorize permissions (this script needs to write to your Sheet and send email on your behalf) — click through and allow it. You may see an "unverified app" warning since this is your own private script; click **Advanced → Go to [project name] (unsafe)** to proceed — this is normal for personal scripts.
5. Copy the **Web app URL** shown (it ends in `/exec`).

**3. Connect it to the site**
1. Open `order.html` in this folder and find this line:
   ```html
   <form class="order-card" action="PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE" method="POST" id="orderForm" target="hidden_iframe">
   ```
2. Replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web app URL you copied.
3. Save, push to GitHub, and test by placing a dummy order on the live site — you should see a new row appear in your Sheet and get an email within a few seconds.

**If you ever edit the script later:** click **Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy**. Just saving the script isn't enough — a currently-live web app keeps running the old code until you redeploy it.

**Quotas:** consumer Google accounts can send up to ~100 emails/day and handle tens of thousands of script calls/day via Apps Script — far more than a small bakery needs. If you ever hit limits, Google Workspace accounts get much higher caps.

## Notes
- The contact form (`contact.html`) still uses a `mailto:` action as a lightweight placeholder — replace with Formspree too if you want it to land reliably (mailto depends on the visitor's email app).
- The order form only mentions Hyderabad-only delivery and next-morning delivery timing on `order.html` itself, per your request — it's not repeated elsewhere on the site.
- Update the email address (`hello@kneadedtherapy.com`) and social links (`#` placeholders) in each page's footer once you have real accounts.
- Swap `assets/logo.png` for updated brand art any time — same filename keeps every page in sync.
- Menu photos are free stock placeholders — swap files in `assets/` with real product photos whenever you have them; same filenames keep every page wired up.
