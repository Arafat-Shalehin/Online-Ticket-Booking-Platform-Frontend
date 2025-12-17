# TicketBari – Online Ticket Booking Platform (Client)

TicketBari is a full-featured **online ticket booking platform** built with the **MERN stack**.  
The frontend (this repo) is a React + Tailwind CSS application that allows users to:

- Discover and filter travel tickets (Bus, Train, Launch, Plane).
- Book tickets and manage bookings.
- Pay securely via Stripe.
- Access a role-based dashboard for **User**, **Vendor**, and **Admin**.

This project was built as part of a MERN assignment to demonstrate full-stack skills, secure auth, role-based access control, and a polished dashboard UI.

---

## ✨ Features

### General (All Visitors)

- Home page with:
  - **Hero section / slider**
  - **Advertisement section** (up to 6 admin-selected tickets)
  - **Latest tickets section**
  - Extra sections such as “Why Choose Us”, “Popular Routes”, etc.
- All pages share a consistent:
  - **Main layout** with Navbar + Footer
  - **Responsive design** for mobile, tablet, and desktop
- **Dark / Light mode** toggle

---

### Authentication

- Firebase Authentication:
  - Email/password registration & login
  - Google Sign-In
- Password validation:
  - At least 6 characters
  - At least one uppercase & one lowercase letter
- Protected routes:
  - Uses Firebase ID token in `Authorization: Bearer <token>` header
  - Role-based dashboards (User / Vendor / Admin)
- Persistent login across page reloads for private routes

---

### User Role: Normal User

- **Browse Tickets**
  - All Tickets page with:
    - Search by From / To
    - Filter by transport type
    - Sort by price (Low → High / High → Low)
    - Pagination (6–9 per page)
- **Ticket Details**
  - Full ticket info
  - Countdown to departure
  - “Book Now” button (disabled if:
    - Departure time passed, or
    - Ticket quantity is 0)
- **Book Tickets**
  - Booking modal:
    - Enter quantity (must be ≤ available quantity)
    - Creates booking with status `pending`
    - Immediately visible in “My Booked Tickets”
- **My Booked Tickets**
  - 3-column card layout with:
    - Title, image, route, departure date/time
    - Booked quantity, total price
    - Status: `pending | accepted | rejected | paid`
    - Countdown to departure (hidden when rejected)
  - If status is `accepted`:
    - Shows **Pay Now** → Stripe checkout
    - Payment disabled if departure has passed
- **Transaction History**
  - Table of all Stripe payments:
    - Transaction ID
    - Amount
    - Ticket Title
    - Payment Date

---

### User Role: Vendor

- **Vendor Profile**
  - Displays profile picture, name, email, role.
- **Add Ticket**
  - Form with:
    - Title, From, To
    - Transport type
    - Price (per unit)
    - Ticket Quantity
    - Departure date & time
    - Perks (checkboxes)
    - Image upload via **imgbb**
  - Tickets initially have `verificationStatus: "pending"`.
  - Backend enforces:
    - Only authenticated vendors can add.
    - Fraud vendors are blocked.
- **My Added Tickets**
  - 3-column grid of vendor’s tickets:
    - Shows all ticket info & verification status (`pending | approved | rejected`)
    - Update / Delete buttons:
      - Disabled when status is `rejected`
- **Requested Bookings**
  - Table of all **pending** booking requests for vendor’s tickets:
    - User name/email
    - Ticket title
    - Quantity
    - Total price
    - Accept / Reject buttons
- **Revenue Overview**
  - Charts/pie visualization for:
    - Total Revenue
    - Total Tickets Sold
    - Total Tickets Added

---

### User Role: Admin

- **Admin Profile**
  - Displays admin details & role.
- **Manage Tickets**
  - Table of all vendor-added tickets:
    - Approve → marks ticket as approved & visible in All Tickets
    - Reject → marks ticket as rejected
- **Manage Users**
  - Table of all users:
    - Name, Email, Role
    - Make Admin / Make Vendor buttons
    - Mark as Fraud (only for vendors)
      - Marks vendor as fraud, hides all their tickets, and blocks them from adding more
- **Advertise Tickets**
  - Table of all admin-approved, non-fraud tickets
  - **Advertise toggle** per row:
    - Advertise / Unadvertise ticket
    - Enforces **max 6** advertised tickets at a time
  - Advertised tickets appear in the **Advertisement section** on the homepage

---

## 🛠 Tech Stack

- **React 18**
- **React Router DOM**
- **@tanstack/react-query**
- **Axios** (with secure instance using Firebase ID token)
- **Firebase Authentication (client SDK)**
- **Tailwind CSS**
- **React Hook Form**
- **Framer Motion**
- **React Toastify**
- **SweetAlert2**
- **Recharts** (for Vendor revenue overview)
- **Swiper / custom slider** (for hero/slider if used)
- **Vite** (for bundling & dev server)

---

## 📁 Project Structure (Client)

```bash
src/
  Components/
    Cards/
      BookingCard.jsx
      TicketCard.jsx
    Common/
      Loader.jsx
      EmptyState.jsx
      StatusBadge.jsx
      Header.jsx
      Countdown.jsx
      formatDateTime.js
  Hooks/
    useAuth.js
    useAxiosSecure.js
    useFetchData.js
    useApiMutation.js
    useCountdown.js
  Pages/
    Home/
      Home.jsx
    Auth/
      Login.jsx
      Register.jsx
    Dashboard/
      User/
        MyBookedTickets.jsx
        TransactionHistory.jsx
      Vendor/
        AddTicket.jsx
        MyAddedTickets.jsx
        RequestedBookings.jsx
        RevenueOverview.jsx
      Admin/
        ManageTickets.jsx
        ManageUsers.jsx
        AdvertiseTickets.jsx
    Payment/
      Payment.jsx
      PaymentSuccess.jsx
      PaymentCancelled.jsx
    Tickets/
      AllTickets.jsx
      TicketDetails.jsx
  providers/
    AuthProvider.jsx
  main.jsx
  router.jsx
⚙️ Environment Variables
Create a .env.local (or .env) file in the client root:

Bash

VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project_id.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project_id.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_firebase_app_id

# Image hosting (imgbb)
VITE_IMGBB_KEY=your_imgbb_api_key

# Backend URL (if different from localhost)
VITE_API_BASE_URL=http://localhost:5000
🚀 Running the Client Locally
Bash

# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
# Vite usually runs on:
# http://localhost:5173
Make sure the backend server is running and that VITE_API_BASE_URL points to it.

🔒 Security & Auth Flow
All protected API calls use useAxiosSecure, which:
Retrieves the current Firebase user via getAuth().currentUser
Attaches their ID token as Authorization: Bearer <token>
Backend validates this token with Firebase Admin SDK and sets req.decoded_email.
Role checks (User/Vendor/Admin) are enforced on the server side.

🌐 Deployment
You can deploy this frontend to:

Vercel
Netlify
Surge
Firebase Hosting
Be sure to:

Add your production domain in Firebase Auth authorized domains.
Set the correct VITE_API_BASE_URL to your deployed backend URL.
Configure environment variables in your hosting platform.

✅ Features Checklist (Spec Compliance)

- **User, Vendor, Admin roles
- **Auth with email/password + Google
- **Protected routes with persistent login
- **Bookings with pending/accepted/rejected/paid lifecycle
- **Stripe payment integration (Redirect to Stripe Checkout)
- **Transaction history
- **Vendor dashboard: Add Ticket, My Tickets, Requested Bookings, Revenue Overview
- **Admin dashboard: Manage Tickets, Manage Users, Advertise Tickets
- **Advertised tickets on homepage (max 6)
- **Search / Filter / Sort / Pagination on All Tickets
- **Dark/Light mode
- **Responsive and consistent UI

## 📄 License
This project was built for educational purposes.
You may adapt it for learning and portfolio projects; please give credit if you use major parts of the design or logic.
```
