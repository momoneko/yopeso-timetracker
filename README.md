# Time Tracking Chrome Extension

## Installation & Usage

### 1. Build the Extension (for developers)

Open a terminal in the `chrome-extension` directory and run:

```sh
yarn install
yarn build
```

### 2. Download the Extension from GitHub Releases (for users)

Go to the [Releases page](https://github.com/your-username/your-repo/releases) and download the latest `chrome-extension.zip` file.

Unzip the file to a folder on your computer.

### 3. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the folder where you unzipped the extension files (or the `dist` folder if you built it yourself).

### 3. Using the Extension

- Navigate to a task page on `portal.yopeso.com` (e.g., `https://portal.yopeso.com/task/123456` or `https://portal.yopeso.com/project/your_project/task/123456`).
- Click the extension icon in the Chrome toolbar.
- Fill in the time tracking details, select one or more dates, and click **Submit**.

### 4. Updating the Extension

If a new release is published, download the latest zip from the Releases page and repeat the installation steps above.
If you are developing, after making code or asset changes, run `yarn build` again and reload the extension in `chrome://extensions` by clicking the **Reload** button on your extension card.

### 5. Troubleshooting

- Make sure you are on a `portal.yopeso.com` page to use the extension.
- If the icon does not update, ensure PNG files in `public` are correct and re-run `yarn build`.
- If you see errors, check the browser console for details.

---

**Icons:**

- Place your icon PNGs (16x16, 32x32, 48x48, 128x128) in the `public` folder before building.

**Requirements:**

Chrome browser
(For developers) Node.js & Yarn
