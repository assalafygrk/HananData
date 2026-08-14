<div align="center">
  <img src="./landing_page/public/favicon.png" alt="HananData Logo" width="120" />
  
  # HananData - Premium VTU & Utility Payment Platform
  
  **Fast, secure, and reliable virtual top-up and bills payment across Nigeria.**

  [![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
</div>

<br />

## 📱 About HananData
HananData is a full-stack Virtual Top-Up (VTU) platform designed to simplify utility payments in Nigeria. It allows users to seamlessly purchase cheap data, recharge airtime, pay electricity bills, and renew cable TV subscriptions with instant delivery and bank-grade security.

## 🏗️ System Architecture
This repository is a **Monorepo** containing all the necessary components of the HananData ecosystem:

| Component | Technology Stack | Description |
|-----------|-----------------|-------------|
| 🌐 **Landing Page** | React, Vite, TailwindCSS | High-converting marketing website for HananData to attract users and provide APK downloads. |
| 🛡️ **Admin Panel** | React, Vite, TailwindCSS | Powerful administrative dashboard to manage users, transactions, dynamic pricing, and platform settings. |
| ⚙️ **Backend API** | Node.js, Express, MongoDB | The core engine handling authentication, wallets, API provider integrations (PaymentPoint/Subandgain), and webhooks. |
| 📱 **Mobile App** | Flutter, Dart | Cross-platform mobile application providing a beautiful, fast interface for end-users to manage their digital lifestyle. |

## ✨ Key Features
* ⚡ **Automated VTU:** Instant delivery of Data, Airtime, Cable, and Electricity.
* 💳 **Wallet System:** Dedicated virtual bank accounts for instant and automated user wallet funding.
* 🔒 **Security First:** Transaction PINs, biometric app locks, and robust JWT backend authentication.
* 📈 **Dynamic Pricing:** Real-time margin calculations and auto-syncing of provider prices.
* 🤖 **CI/CD Automation:** Automated Android APK builds and GitHub Releases using GitHub Actions.

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (v3.0+)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/assalafygrk/HananData.git
   cd HananData
   ```

2. **Run the Backend API:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on environment requirements
   npm start
   ```

3. **Run the Admin Panel:**
   ```bash
   cd admin_panel
   npm install
   npm run dev
   ```

4. **Run the Landing Page:**
   ```bash
   cd landing_page
   npm install
   npm run dev
   ```

5. **Run the Mobile App:**
   ```bash
   cd flutter_app
   flutter pub get
   flutter run
   ```

## 🔄 Automated App Releases
This repository uses **GitHub Actions** to fully automate the Android app compilation process. 
Every time code is pushed to the `main` branch, an action automatically builds a highly-optimized release APK and attaches it to the **Latest Release** page. The landing page dynamically links to this exact file, meaning the download button is always serving your newest app!

## 🤝 Support
If you have any questions or need help setting up the environment, please contact the development team at [assalafyithub@gmail.com](mailto:assalafyithub@gmail.com).

---
<div align="center">
  <i>Built with ❤️ for seamless digital payments in Nigeria.</i>
</div>
