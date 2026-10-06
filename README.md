# 🏨 LuxeStay – Hotel CRUD Application

LuxeStay is a React-based hotel management web application that allows users to add, view, edit, search, filter, and delete hotel details.

## 🚀 Live Demo

https://luxe-stay-hotel-crud-namla.vercel.app/

## 💻 Technologies Used

### Frontend

* React.js
* Redux Toolkit
* HTML
* CSS
* Axios

### Backend

* Node.js
* Express.js
* PostgreSQL

### Deployment

* Vercel – Frontend
* Railways and Render – Backend

## ✨ Features

* Add new hotel details
* Edit existing hotel details
* Delete hotels
* Search hotels by title
* Filter hotels by minimum and maximum price
* Pagination
* Hotel detail page
* Image upload and preview
* Form validation
* Map location using latitude and longitude
* Responsive user interface

## 📂 Project Structure
LuxeStay-HotelCrud-Namla
│
├── Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
│   └── package.json
│
└── Server/
    ├── Controllers/
    ├── Middleware/
    ├── Routes/
    ├── .gitignore
    ├── Db.js
    ├── Server.js
    ├── package-lock.json
    └── package.json


## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/syedhaazima/LuxeStay-HotelCrud-Namla.git
```

### 2. Frontend Setup

```bash
cd Client
npm install
npm run dev
```

### 3. Backend Setup

Open another terminal:

```bash
cd Server
node Server.js
```

### 4. Environment Variables

Create a `.env` file in the backend and add the required database and server configuration.

## 🗄️ Database

The application uses PostgreSQL to store hotel information.

Hotel data includes:

* Hotel title
* Description
* Price
* Image
* Latitude
* Longitude

## 👩‍💻 Author

**Syed Haazima**

B.E. Computer Science Engineering Student

Interested in Software Development and Web Development.
