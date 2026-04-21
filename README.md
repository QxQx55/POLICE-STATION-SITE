# Adama Police Station Website

This is a full-stack web application for Adama Police Station built with Flask, SQLAlchemy, and Bootstrap. It provides user registration, login, complaint filing, and role-based dashboards.

## Features

- **User & Role Management**: Secure login/logout with role-based access (Admin, Police Officer, Investigator, Reception, Forensic Staff)
- **Complaint Registration**: Citizens can file complaints online
- **Dashboard**: Role-based dashboards showing relevant information
- **Case Management**: (In development) Create and manage cases
- **Criminal Records**: (In development) Store suspect information

## Technology Stack

- **Backend**: Python Flask, SQLAlchemy
- **Frontend**: HTML, CSS, Bootstrap
- **Database**: SQLite
- **Authentication**: Flask-Login

## Installation

1. Install Python 3.x
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app: `python app.py`
4. Open http://127.0.0.1:5000 in your browser

## Usage

1. Register as a user with a role
2. Login to access the dashboard
3. File complaints as a citizen
4. Officers can view assigned complaints

## Notes

- This is a prototype with basic features implemented
- Database is SQLite for development
- Security features like encryption are not fully implemented yet