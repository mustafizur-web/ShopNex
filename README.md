# ShopNex - Admin & Storefront Application

Welcome to your downloaded project! This application is built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It contains both a fully featured storefront and an advanced merchant/admin dashboard.

## 🚀 How to Run Locally

Follow these steps to run the application on your computer:

### 1. Extract the Files
Make sure you have extracted the downloaded ZIP file into a folder.

### 2. Install Node.js
If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/). (Version 18 or above is recommended).

### 3. Install Dependencies
Open your terminal/command prompt in the extracted project folder and run:
```bash
npm install
```
*Note: If you run into any dependency peer resolution warnings, you can safely use:*
```bash
npm install --legacy-peer-deps
```

### 💡 Troubleshooting common errors

If you see an error like `Could not resolve "react-is"` when starting your server:
Run this command in your terminal to install the package explicitly:
```bash
npm install react-is
```
Then run `npm run dev` again!

### 4. Start the Development Server
Run the following command to start the application:
```bash
npm run dev
```

This will spin up the Vite development server. Open your browser and navigate to the address shown in the terminal (usually `http://localhost:3000` or `http://localhost:5173`).

---

## 🛠️ Features Included

- **No-Credential Demo Mode**: An automatic, high-quality local storage fallback is implemented. You can register/sign in with **any email & password** to test all functionalities of the admin dashboard and checkout flows without needing to configure a live database immediately!
- **Tailwind CSS v4**: Beautiful, modern gradients, layout systems, and custom utility classes.
- **State Management**: Built-in, resilient context state manager in `src/lib/store.tsx` that persists shopping carts, order history, and product details.
- **Product Storefront**: Dynamic product details page, category filter collections, live cart drawers, and beautiful, styled checkout forms.
- **Admin Dashboard**: Live real-time statistics, custom pie/line charts, order tracking, and product management lists.

---

## 📦 Building for Production

To compile and optimize the app for production, run:
```bash
npm run build
```
This compiles the application and outputs optimized static files inside the `dist/` directory, ready to be hosted on any web server (such as Vercel, Netlify, Cloudflare Pages, etc.).
