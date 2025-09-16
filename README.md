# 🛒 AI-Powered E-commerce Recommendation System

## 📌 Overview
This project implements an **AI-powered recommendation engine** for e-commerce platforms. It suggests products to users based on their **preferences, browsing behavior, and purchase history**. Built with the **MERN stack** and integrated with **TensorFlow.js** and **OpenAI API**, the system provides **real-time recommendations** on product pages and shopping carts.

---

## 🚀 Tech Stack
- **Frontend:** React.js, Redux  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **AI/ML:** TensorFlow.js, Scikit-learn  
- **AI Model:** Collaborative filtering, Content-based filtering  

---

## 🎯 PRD (Product Requirements Document)

### Objective
Develop an AI-powered recommendation system integrated into an e-commerce platform to provide **personalized product suggestions** and enhance the shopping experience.

### Features
- ✅ Personalized product recommendations  
- ✅ Real-time recommendations on product and cart pages  
- ✅ AI-driven insights using machine learning algorithms  
- ✅ User profile management for customized preferences  
- ✅ Admin dashboard to monitor recommendation performance  

### User Stories
- 👤 *As a user*, I want to see personalized product recommendations so I can discover items that match my interests.  
- 🛠 *As an admin*, I want to track recommendation performance and fine-tune algorithms for better accuracy.  

### Technical Requirements
- **Frontend:** React.js (UI), Redux (State Management)  
- **Backend:** Node.js with Express.js (API)  
- **Database:** MongoDB  
- **AI/ML:** TensorFlow.js, Scikit-learn  
- **Models:** Collaborative filtering, Content-based filtering  

---

## 🔗 Integration
- Integrates seamlessly with the **existing product catalog**.  
- Provides **real-time recommendations** based on user interactions.  

---

## 🏗 Architecture Overview
- **Frontend:** React.js (UI), Redux (State Management)  
- **Backend:** Node.js + Express.js (API Layer)  
- **Microservices:**
  - 🧠 Recommendation Engine – Generates personalized product recommendations  
  - 👤 User Data Service – Stores user preferences, browsing history, and purchase data  
  - 📦 Product Service – Manages product data and categorization  

---

## 📂 Folder Structure


Folder Structure:
/ecommerce-recommendation
|-- /client (React Frontend)
|   |-- /public
|   |-- /src
|   |   |-- /components
|   |   |-- /redux
|   |   |-- /services
|   |-- package.json
|
|-- /server (Node.js Backend)
|   |-- /api
|   |   |-- /routes
|   |   |-- /controllers
|   |   |-- /models
|   |   |-- /middlewares
|   |   |-- /services (Recommendation Engine Microservice)
|   |-- /microservices
|   |   |-- /recommendation
|   |   |-- /user-data
|   |   |-- /product-service
|   |-- server.js
|   |-- .env
|
|-- /database
|   |-- /models
|-- package.json





