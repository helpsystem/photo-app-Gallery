# cPanel Deployment Guide for RAM ARCHIVE

This guide explains how to deploy your Next.js application to a specific part of your cPanel host (e.g., a subdomain) so you can host other sites on the main domain later.

## Prerequisites

1.  **cPanel Access**: You must have access to your cPanel dashboard.
2.  **Node.js on cPanel**: Your hosting provider MUST support "Setup Node.js App" or allow running Node.js processes. This app *cannot* run on standard shared hosting without Node.js support because it uses server-side features (API routes, file system access).
3.  **Subdomain (Recommended)**: Best practice is to use a subdomain (e.g., `gallery.yourdomain.com`) instead of a subfolder (`yourdomain.com/gallery`) to avoid complex routing conflicts.

---

## Step 1: Create a Subdomain

1.  Log in to **cPanel**.
2.  Go to **Domains** -> **Create A New Domain** (or **Subdomains** in older versions).
3.  Enter your desired subdomain (e.g., `gallery.samanabyar.online` or whatever your domain is).
4.  Set the **Document Root** to a *new, empty folder* outside of `public_html` if possible (e.g., `/home/username/gallery_app`), or just let it default but keep it separate.

## Step 2: Prepare the Build Files

We have configured the app to output a `standalone` build. This is a lightweight folder containing everything needed to run the server.

1.  Locate the `.next/standalone` folder in your project directory (after the build completes).
2.  **Important**: You also need to copy the `public` folder and `.next/static` folder to the standalone directory for images/styles to work.
    *   Copy `public/` -> `.next/standalone/public/`
    *   Copy `.next/static/` -> `.next/standalone/.next/static/`
3.  **Zip the contents** of the `.next/standalone` folder. This zip file is what you will upload.

## Step 3: Setup Node.js Application in cPanel

1.  In cPanel, find **"Setup Node.js App"** under the *Software* section.
2.  Click **Create Application**.
3.  **Node.js Version**: Select the recommended version (v18 or v20).
4.  **Application Mode**: `Production`.
5.  **Application Root**: Enter the path to the folder you created for your subdomain (e.g., `gallery_app`).
6.  **Application URL**: Select your subdomain (e.g., `gallery.samanabyar.online`).
7.  **Application Startup File**: Enter `server.js`.
8.  Click **Create**.

## Step 4: Upload and Extract

1.  Go to **File Manager** in cPanel.
2.  Navigate to your **Application Root** folder (e.g., `gallery_app`).
3.  Delete any default files created by the Node.js setup (like `app.js` or `index.html`) *except* the generated `.htaccess` or configuration files if unsure (usually safe to clear folder contents except dotfiles).
4.  **Upload** your zip file.
5.  **Extract** the zip file into this folder.
    *   Ensure `server.js` is in the root of this folder.
    *   Ensure there is a `.next` folder and a `public` folder here.
6.  **Data Folder**: Since we use a local JSON database, create a `data` folder in the root if it's missing, and upload your local `data/users.json` and `data/content.json` into it.
    *   *Note:* In production, you might need to ensure this folder has write permissions if you want to update data from the admin panel.

## Step 5: Start the Server

1.  Go back to **"Setup Node.js App"** in cPanel.
2.  Click the **Restart** icon (circular arrows) to start your app.
3.  Click **Open** to verify your site is live!

---

## Troubleshooting

*   **500 Error**: Check the `stderr.log` in your application root.
*   **Images/Styles Missing**: Ensure you copied `.next/static` to `.next/standalone/.next/static` correctly. This is a common mistake.
*   **Database Not Saving**: Check permissions on the `data/` folder. It needs 755 or sometimes 777 permissions depending on the host configuration.
