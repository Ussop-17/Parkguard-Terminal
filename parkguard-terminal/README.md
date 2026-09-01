# 🚗 ParkGuard Terminal

### Automated Parking Penalty System with Community Licensing (APPS-CL)

ParkGuard Terminal is an AI-powered smart surveillance system designed to detect unauthorized parking using CCTV footage. The system automatically identifies vehicles, extracts license plate numbers, tracks parking duration, and flags violations based on predefined rules. It provides a structured solution for monitoring restricted parking areas and supports automated penalty enforcement.

---

## 🚀 Features

* **AI-Based Vehicle Detection** – Identifies vehicles from CCTV footage
* **License Plate Recognition (OCR)** – Automatically extracts vehicle numbers
* **Parking Duration Tracking** – Monitors how long a vehicle remains parked
* **Violation Detection** – Flags vehicles parked beyond the allowed time (4 minutes)
* **Challan Support System** – Stores violation data for enforcement purposes
* **Video Upload Analysis** – Processes uploaded CCTV footage for detection
* **Database Logging** – Stores vehicle number, timestamp, and duration
* **Real-Time Notifications** – Alerts users when vehicles or violations are detected
* **Community Licensing Model** – Enables monitoring of private or shared spaces

---

## 🛠️ Tech Stack

* **Frontend**: React / HTML / CSS / Tailwind CSS
* **Backend**: Node.js / Express.js
* **AI Processing**: Computer Vision + OCR (License Plate Recognition)
* **Database**: MySQL / MongoDB

---

## 📦 Prerequisites

* Node.js (v16 or higher)
* npm (Node Package Manager)

---

## ⚙️ Local Setup

1. **Clone the Repository**

   ```bash
   git clone <your-repo-link>
   cd parkguard-terminal
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   * Create a `.env.local` file in the root directory
   * Add your API configuration:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Application**

   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open your browser and visit:

   ```
   http://localhost:3000
   ```

---

## 🧠 How It Works

1. User uploads CCTV footage or connects to a live feed
2. System detects vehicles using AI-based computer vision
3. License plate numbers are extracted using OCR
4. Parking duration is tracked continuously
5. If duration exceeds 4 minutes, a violation is triggered
6. Violation details are stored in the database
7. Notifications are generated for monitoring and enforcement

---

## 📊 System Modules

### 📹 Live Monitoring

* Connect to live CCTV (placeholder for future integration)
* Upload recorded CCTV footage for analysis

### 🔍 Database Management

* View stored vehicle records
* Includes vehicle number, date, time, and parking duration

### 🔔 Notifications System

* Alerts for detected vehicles
* Alerts for parking violations

---

## 🏗️ System Architecture

The system follows a modular architecture consisting of:

* **Frontend Layer** – User interface for monitoring and interaction
* **Backend Layer** – Handles logic, processing, and API communication
* **AI Processing Layer** – Performs vehicle detection and OCR
* **Database Layer** – Stores vehicle and violation records

---

## 📌 Future Enhancements

* Live CCTV stream integration
* Real-time license plate tracking
* Automated challan generation system
* Mobile application support
* Cloud-based deployment for scalability

---

## 📝 Note

This project is developed as part of an academic initiative to address real-world parking issues using AI and smart surveillance technologies.

---

## 📚 References

* Computer Vision Research Papers
* OCR Techniques for License Plate Recognition
* Smart City Surveillance Systems
* AI-based Traffic Monitoring Studies

---

## ⭐ Acknowledgement

We express our gratitude to our faculty and institution for their guidance and support throughout the development of this project.
