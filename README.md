# Time Tracking Chrome Extension

## Installation & Usage

### 1. Build the Extension

Open a terminal in the `chrome-extension` directory and run:

```sh
yarn install
yarn build
```

### 2. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist` folder inside your `chrome-extension` directory.

### 3. Using the Extension

- Navigate to a task page on `portal.yopeso.com` (e.g., `https://portal.yopeso.com/task/123456` or `https://portal.yopeso.com/project/your_project/task/123456`).
- Click the extension icon in the Chrome toolbar.
- Fill in the time tracking details, select one or more dates, and click **Submit**.

### 4. Updating the Extension

- After making code or asset changes, run `yarn build` again.
- Reload the extension in `chrome://extensions` by clicking the **Reload** button on your extension card.

### 5. Troubleshooting

- Make sure you are on a `portal.yopeso.com` page to use the extension.
- If the icon does not update, ensure PNG files in `public` are correct and re-run `yarn build`.
- If you see errors, check the browser console for details.

---

**Icons:**

- Place your icon PNGs (16x16, 32x32, 48x48, 128x128) in the `public` folder before building.

**Requirements:**

- Chrome browser
- Node.js & Yarn
