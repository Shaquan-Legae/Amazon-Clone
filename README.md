# Amazon Clone

A polished Amazon-style e-commerce application built with React, Vite, Firebase, React Router, Context API, and CSS3. The project is inspired by Amazon's familiar shopping UI/UX and was developed to satisfy the requirements of the official **Amazon Clone using React** assignment PDF.

The app includes Firebase authentication, a persistent shopping basket, product discovery tools, wishlist support, dark mode, a multi-step checkout flow, mock payment UI, and an order confirmation experience.

## Project Overview

Amazon Clone is a responsive React + Vite e-commerce application that recreates the core flow of a modern online marketplace. Users can browse products, search and filter the catalog, add items to their basket, save wishlist items, sign in with Firebase, and complete a full checkout journey.

The implementation follows the assignment milestones closely:

- React project setup with clean structure
- React Router navigation
- Amazon-style header and product homepage
- Context API state management
- Basket and checkout functionality
- Firebase authentication
- Firestore product support with fallback product data
- Advanced UI features for a full-mark submission

## Features

### Core Features

- Responsive Amazon-style layout
- Header and navigation bar
- Search bar with live product filtering
- Reusable product cards
- Shopping basket system
- Multi-step checkout flow
- Firebase authentication
- Basket persistence with `localStorage`

### Custom Features

- Product category filtering
- Wishlist system
- Quantity selector in cart

### Advanced Features

- Persistent dark mode
- Product sorting by featured, price, and rating
- Dynamic recommended products
- Fake Stripe-style payment UI
- Order confirmation screen

### State Management

- React Context API
- Reducer-based global state
- Persistent basket state
- Persistent wishlist state
- Persistent dark mode preference

### Backend Support

- Firebase Authentication
- Firestore product loading support
- Local fallback product dataset when Firebase is not configured

## Tech Stack

- React
- Vite
- React Router DOM
- React Context API
- Firebase Authentication
- Firestore
- Material UI Icons
- CSS3
- `localStorage`

## Project Structure

```text
src/
  assets/
    logo.png              # Header logo asset
  components/
    Header.jsx            # Navigation, search, auth status, theme toggle, basket link
    Product.jsx           # Product card, wishlist, add-to-basket action
    CheckoutProduct.jsx   # Basket item row with quantity controls
    Subtotal.jsx          # Basket subtotal and checkout navigation
    RecommendedProducts.jsx
  data/
    products.js           # Fallback product catalog
  pages/
    Home.jsx              # Homepage, search/filter/sort/product grid
    Login.jsx             # Firebase email and Google sign-in
    Signup.jsx            # Firebase email/password registration
    Checkout.jsx          # Multi-step checkout and confirmation flow
    NotFound.jsx          # Fallback route
  firebase.js             # Firebase app, auth, provider, and Firestore setup
  reducer.js              # Global reducer, initial state, basket total helper
  StateProvider.js        # Context API provider and useStateValue hook
  App.jsx                 # Routes, auth listener, persistence effects
  main.jsx                # React entry point
```

## Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Firebase Setup

Create a `.env` file in the project root and add your Firebase web app configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase features used:

- Email/password authentication
- Google sign-in
- Firestore product collection support

The application still runs without Firebase configuration. If Firebase values are missing, authentication is disabled safely and the homepage uses the fallback product dataset from `src/data/products.js`.

# Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Dark Mode

![Dark Mode](screenshots/dark-mode.png)

### Cart

![Cart](screenshots/cart.png)

### Login

![Login](screenshots/login.png)

### Returns & Orders

![Returns](screenshots/returns.png)

### Prime

![Prime](screenshots/prime.png)

## Rubric Coverage

| Requirement | Status | Notes |
| --- | --- | --- |
| Base Project | Complete | React + Vite setup, reusable components, routing, Context API, Firebase integration |
| Responsiveness | Complete | Desktop, tablet, and mobile layouts supported across homepage, header, auth, and checkout |
| Custom Feature | Complete | Product filtering, wishlist persistence, and cart quantity controls |
| Advanced Features | Complete | Dark mode, product sorting, recommended products, mock payment UI, order confirmation |
| Deployment Ready | Complete | Production build available with `npm run build`; Firebase hosting can be configured separately |

## Future Improvements

- Real Stripe payments
- Admin dashboard
- Order history
- Product reviews
- Coupons and promotion codes
- Inventory management

## Author

Built by **Kamogelo Legae**.

This project was created as a portfolio-quality React e-commerce build and assignment submission, with a focus on clean structure, functional shopping flows, and polished user experience.
