# The Book of the Dead

A private family history app: a circle tree of your ancestors, a research chart, records, photos and notes.

It runs entirely in your browser. Your tree is saved on each device as you work, so it keeps working with no internet. Sync between devices goes through your own free Supabase project.

## Put it online with GitHub Pages

1. Upload everything in this folder to a GitHub repository. On github.com, create a repository, then choose **Add file › Upload files** and drag in the folder's contents, including the `vendor` and `icons` folders.
2. In the repository, open **Settings › Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`, and save.
3. After a minute or two, your site is at `https://<your-username>.github.io/<repository-name>/`.

Open that address on each device. On a phone, use **Share › Add to Home Screen** (iPhone) or **Install app** (Android) to get an app icon. Once it has been opened, it works offline.

GitHub Pages on a private repository needs a paid GitHub plan. A public repository is fine: it holds only the app, never your family data.

## Sync between devices

Sync is already set up: this site is connected to your Supabase project **book-of-the-dead** (its address and public key are in `config.js`). Every account's tree and files are private to that account.

1. On your first device, tap **Set up sync** and choose **Create account** with your email and a password. The tree already on that device is uploaded.
2. On each other device, open the site, tap **Set up sync** and choose **Sign in**.

Then, in the Supabase dashboard:

- **Email confirmation** is on by default. Either confirm from the email Supabase sends, or turn it off under **Authentication › Sign In / Providers › Email › Confirm email**. So that the confirmation link opens your site, set **Authentication › URL Configuration › Site URL** to your GitHub Pages address.
- **Once your account exists**, turn off **Allow new users to sign up** under **Authentication › Sign In / Providers**. No one else could see your tree anyway, but this stops strangers making accounts on your project.

To use a different Supabase project instead, run `supabase-setup.sql` in its SQL Editor and put its Project URL and anon key in `config.js`.

## Moving your tree from the claude.ai version

1. In the claude.ai version, go to **People › Export › Backup with files**. This downloads one `.json` file holding your tree and every uploaded photo and scan.
2. In your own site, set up sync first, then go to **People › Import** and choose that file. The photos and scans are uploaded to your Supabase project, and every record is pointed at them.

## How saving works

- **Every change is saved on the device straight away**, in the browser's own storage.
- **Without internet**, changes wait in a queue on the device, even if you close the page. They're sent in order when the connection returns. A small indicator at the top right shows when changes are waiting.
- **Photos and scans added offline** are kept whole on the device and uploaded later.
- **If the same detail is changed on two devices while one is offline**, the last change to sync wins. Changes to different details of the same person don't overwrite each other.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app |
| `library.json` | The research library of links |
| `sw.js` | Offline app cache, so the site opens without internet |
| `manifest.webmanifest`, `icons/` | Home-screen app name and icon |
| `vendor/supabase.js` | The Supabase client library (v2.45.4), kept here so it works offline |
| `config.js` | Which Supabase project the site syncs with |
| `supabase-setup.sql` | The database setup (already applied to your project) |
