---
description: How to build an Android APK from the React web app using Capacitor
---

# Build Android APK with Capacitor

This workflow will guide you through converting your React/Vite web app into an Android APK using Capacitor.

## Prerequisites
- **Node.js** installed (you already have this).
- **Android Studio** installed on your computer.
- **Java Development Kit (JDK)** installed (usually comes with Android Studio).

## Steps

1.  **Install Capacitor Dependencies**
    Run the following command to install the necessary Capacitor packages:
    ```powershell
    npm install @capacitor/core @capacitor/cli @capacitor/android
    ```

2.  **Initialize Capacitor**
    Initialize Capacitor in your project. You'll be asked for an App Name (e.g., "Little Moon") and App ID (e.g., "com.littlemoon.birthday").
    ```powershell
    npx cap init
    ```
    *   **App Name**: Little Moon
    *   **App ID**: com.littlemoon.birthday
    *   **Web asset directory**: dist

3.  **Build the Web App**
    Compile your React project into static files (the `dist` folder).
    ```powershell
    npm run build
    ```

4.  **Add Android Platform**
    Add the Android platform to your Capacitor project.
    ```powershell
    npx cap add android
    ```

5.  **Sync Assets**
    Copy your built web assets (`dist` folder) into the Android project.
    ```powershell
    npx cap sync
    ```

6.  **Open in Android Studio**
    Open the native Android project in Android Studio.
    ```powershell
    npx cap open android
    ```

7.  **Build the APK in Android Studio**
    1.  Wait for Gradle sync to finish (it might take a few minutes).
    2.  Go to the menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    3.  Once finished, a popup will appear. Click **locate** to find your `app-debug.apk` file.
    4.  Transfer this file to your sister's phone and install it!

## Troubleshooting
- If you see an error about `JAVA_HOME`, make sure your JDK path is set in your system environment variables.
- If the app shows a white screen, ensure your `vite.config.js` has `base: './'` (relative paths) so it works in the file system context of the app.

## Update `vite.config.js` for Capacitor
Before building, ensure your `vite.config.js` looks like this to handle routing correctly in the app:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for assets to load in the APK
})
```
