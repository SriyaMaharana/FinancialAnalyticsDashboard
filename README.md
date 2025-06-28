# Financial Analytics Dashboard

A full-stack web app to view, filter, and export financial transactions with user authentication and MongoDB integration.

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS  
- **Backend**: Node.js, Express, TypeScript  
- **Database**: MongoDB (via Mongoose)  
- **Authentication**: JWT  
- **Data Export**: CSV (file-saver & csv-writer)

---

## Folder Structure
FinancialAnalyticsDashboard/
├── client/ # React frontend
├── server/ # Node + Express backend
├── transactions.json # Sample data (imported into MongoDB)
└── README.md # This file

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/SriyaMaharana/FinancialAnalyticsDashboard.git
cd FinancialAnalyticsDashboard
```
Frontend
```bash
cd client
npm install
```
Backend
```bash
Copy code
cd ../server
npm install
```

### 2. MongoDB Setup
Ensure MongoDB is installed and running

Import the sample data:

```bash
mongoimport --db finance_dashboard --collection transactions --file "transactions.json" --jsonArray
```

### 3️. Start the App
Backend (port 5000)
```bash
cd server
npx ts-node index.ts
```
Frontend (port 3000)
```bash
cd ../client
npm start
```

## Login Credentials
Use any email and password. For example:
```bash
json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

## Features
 Secure login via JWT

 Transactions dashboard with search & filter

 Export CSV of selected fields

 MongoDB data storage

 User profile image display

 Fully responsive layout

## API Overview
POST /api/login
```bash
json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

GET /api/transactions
Requires header:
```bash
makefile

Authorization: Bearer <token>
```

POST /api/export
```bash
json

{
  "fields": ["id", "date", "amount", "category", "status"]
}
Returns a downloadable .csv file.
```

## Author
Sriya Maharana
For Full Stack Assignment Submission – June 2025

