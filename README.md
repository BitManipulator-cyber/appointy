<h1 align="center">
    <img src="./assets/logo.png">
</h1>

<p align="center">
  <i>A modern hospital appointment and patient management platform</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloud-AWS%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/API-REST-02569B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Realtime-Patient%20Monitoring-red?style=for-the-badge" />
  <img src="https://img.shields.io/github/last-commit/aaditya-jagtap-2205/appointy?style=for-the-badge" />
  <img src="https://img.shields.io/github/repo-size/aaditya-jagtap-2205/appointy?style=for-the-badge" />
</p>

## Introduction

Appointy is a full-stack hospital appointment and patient management platform designed to streamline appointment workflows, patient records, and real-time health monitoring.

The platform supports role-based access for patients, doctors, and administrators with dedicated dashboards and authentication flows for each role.

Built using the MERN stack and deployed on AWS EC2, the system focuses on backend architecture, workflow management, and scalable healthcare-oriented APIs.

### Core Features

- Multi-role authentication and authorization
- Appointment booking and approval workflow
- Clinical notes and patient history management
- Real-time patient vitals monitoring
- Threshold-based alert system
- RESTful API architecture
- Cloud deployment using AWS EC2 and MongoDB Atlas

---

## Architecture Overview

Appointy follows a modular client-server architecture:

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2
- **Authentication:** JWT-based authentication
- **Realtime Monitoring:** Socket/event-driven vitals updates

---

## Dashboard Preview

<p align="center">
  <img src="./assets/dashboard.png" alt="dashboard preview"/>
</p>

---

## Role-Based Access

### Patient
- Book appointments
- Track appointment status
- Access prescriptions and clinical notes

### Doctor
- Approve or reject appointments
- Add consultation notes
- Monitor patient vitals

### Admin
- Manage platform users
- Oversee appointments and records
- Monitor system activity

---

# Setup

1. Clone the repository

```bash
git clone https://github.com/aaditya-jagtap-2205/appointy.git
cd appointy
```

2. Install dependancies
```bash
cd frontend/ && npm install
cd backend/  && npm install
```

3. Seed sample data to MongoDB
```bash
cd backend/
npm run seed
```

4. Run the project
```bash
cd frontend/ && npm start
cd backend/  && npm start
