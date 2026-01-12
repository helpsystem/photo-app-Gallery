# Deployment Instructions for ram.samanabyar.online

You have provided the following details:
- **Domain**: `ram.samanabyar.online`
- **Server IP**: `66.198.240.7`
- **Host**: `npyugcbr.a2hosted.com`

## Missing Information
To perform an automatic upload from your terminal, **I need your cPanel Username**.
(It is usually 8-16 characters, e.g., `samanaby` or `admin`).

---

## Option 1: Manual Upload (Recommended & Ready)

1.  **Locate the Files**: Go to `Photo-gallery-app/deploy` on your computer.
2.  **Zip the Content**: Select all files inside `deploy`, right-click > **Send to** > **Compressed (zipped) folder**. Name it `deploy.zip`.
3.  **Login to cPanel**: Go to `https://ram.samanabyar.online:2083` (or via your hosting dashboard).
4.  **Create Node App**:
    *   Go to **"Setup Node.js App"**.
    *   **App Root**: `ram_gallery` (or any name you prefer).
    *   **App URL**: Select `ram.samanabyar.online` from the dropdown.
    *   **Startup File**: `server.js`.
    *   Click **Create**.
5.  **Upload Files**:
    *   Go to **File Manager**.
    *   Enter the `ram_gallery` folder.
    *   **Delete** existing files (like `index.html`, `app.js`).
    *   **Upload** your `deploy.zip`.
    *   **Extract** it there.
6.  **Start Server**:
    *   Go back to **Setup Node.js App**.
    *   Click **Restart**.

## Option 2: Automated Upload (Requires Username)

If you provide your cPanel username, I can try to run this command for you:
`scp -r ./deploy/* YOUR_USERNAME@66.198.240.7:/home/YOUR_USERNAME/ram_gallery/`

## Note on Multiple Sites
Yes, this setup is perfect for hosting multiple sites.
- This site runs in the `ram_gallery` folder on the `ram` subdomain.
- You can host another site on the main domain (`samanabyar.online`) or other subdomains without any conflict.
