<div align="center">

# 🛍️ ShopNex

### Next-Level Shopping Platform

**A modern, full-stack e-commerce experience — sleek storefront meets powerful admin dashboard.**

[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

[Features](#-features) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Configuration](#-configuration) • [Deployment](#-deployment)

</div>

---

## ✨ Overview

**ShopNex** is a complete e-commerce solution built for speed, style, and simplicity. It pairs a beautifully animated storefront with a real-time admin dashboard, all wrapped in a lightweight React + Vite + TypeScript stack. Out of the box, it works with **zero configuration** thanks to a smart local-storage fallback — sign up, browse, checkout, and manage orders instantly, then connect Supabase whenever you're ready to go live.

---

## 🚀 Features

### 🛒 Storefront
- **Dynamic Product Catalog** — Curated categories including Electronics, Fashion, and Home & Living
- **Product Detail Pages** with rich descriptions and imagery
- **Category Collections** with smart filtering
- **Live Cart Drawer** with smooth, animated transitions (powered by Motion)
- **Wishlist** support for saving favorite items
- **Guided Checkout Flow** with a polished, styled order form
- **Success Animations** for cart and order confirmations

### 📊 Admin Dashboard
- **Real-Time Statistics** — revenue, orders, and customer metrics at a glance
- **Interactive Charts** — area, pie, and bar charts via Recharts
- **Order Management** — track status, update fulfillment, and view history
- **Product Management** — add, edit, and remove catalog items
- **Customer Insights** — order counts, total spend, and recent activity
- **Light/Dark Mode** toggle for a personalized workspace

### 🔐 Authentication
- **Supabase Auth** integration (email/password + OAuth-ready)
- **No-Credential Demo Mode** — sign in with *any* email & password to explore every feature instantly, no backend setup required
- Seamless fallback between live Supabase sessions and local sessions

### 🎨 Design & UX
- Built with **Tailwind CSS v4** for modern gradients and custom utility styling
- Fluid page transitions and micro-interactions via **Motion (Framer Motion)**
- Fully responsive across mobile, tablet, and desktop
- Custom iconography via **Lucide React**

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + React Router 7 |
| **Build Tool** | Vite 6 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Motion (Framer Motion) |
| **Charts** | Recharts |
| **Backend / Auth** | Supabase, Firebase-ready |
| **State Management** | React Context (`src/lib/store.tsx`) |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or above
- npm (bundled with Node.js)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mustafizur-web/shopnex.git
cd shopnex
```

### 2️⃣ Install dependencies
```bash
npm install
```
> 💡 If you hit peer dependency warnings, use:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3️⃣ Start the development server
```bash
npm run dev
```
Then open **http://localhost:3000** in your browser. 🎉

> **No setup needed to try it out!** ShopNex ships with a local-storage demo mode — register or log in with any email and password to explore the full storefront and admin dashboard immediately.

---

## ⚙️ Configuration

To connect a live Supabase backend, create a `.env` file in the project root based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these variables (or with placeholder values), ShopNex automatically runs in **local demo mode**, storing users, sessions, orders, and products in the browser.

---

## 🗂️ Project Structure

```
shopnex/
├── src/
│   ├── components/
│   │   ├── brand/          # Logo & brand assets
│   │   └── layout.tsx      # NavBar, Footer, animations
│   ├── lib/
│   │   ├── store.tsx       # Global app state (cart, orders, products)
│   │   ├── supabase.ts     # Auth client with local fallback
│   │   └── logger.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Collection.tsx
│   │   ├── Product.tsx
│   │   ├── Checkout.tsx
│   │   ├── Dashboard.tsx   # Admin panel
│   │   ├── Login.tsx
│   │   └── Page.tsx
│   ├── App.tsx              # Route definitions
│   └── main.tsx              # App entry point
├── firestore.rules
├── firebase-blueprint.json
├── .env.example
├── vite.config.ts
└── package.json
```

---

## 🧭 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build an optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run clean` | Remove the `dist/` build output |

---

## 🏗️ Building for Production

```bash
npm run build
```

This compiles and optimizes the app into static files inside `dist/`, ready to deploy anywhere.

---

## ☁️ Deployment

ShopNex is a static Vite build and deploys effortlessly to:

- **[Vercel](https://vercel.com/)**
- **[Netlify](https://www.netlify.com/)**
- **[Cloudflare Pages](https://pages.cloudflare.com/)**
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)**

Simply connect your repository or upload the `dist/` folder, and set your `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment variables in your hosting provider's dashboard.

---

## 🛠️ Troubleshooting

**Error: `Could not resolve "react-is"`**

```bash
npm install react-is
npm run dev
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/mustafizur-web/shopnex/issues) or open a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

---

## 📄 License

This project is available for personal and commercial use. Add your preferred license (e.g., MIT) here.

---

<div align="center">

Built with ❤️ by **[MustafiZ](https://github.com/mustafizur-web)**

⭐ If you like this project, consider giving it a star on GitHub!

</div>
