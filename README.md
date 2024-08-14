# Student Registration System

## Project Overview
The **Student Registration System** is a web-based application that allows users to register student details, view registered students, and manage student records. The system provides functionalities to add, edit, and delete student records, and ensures data persistence using local storage.

## Features
- **Student Registration**: Users can register new students by entering their name, student ID, email ID, and contact number.
- **View Registered Students**: A dedicated page (`students.html`) displays all registered students in a table format.
- **Edit and Delete**: Users can easily edit or delete existing student records.
- **Input Validation**: The form ensures that required fields are not left empty, and that student ID and contact number fields accept only numbers.
- **Data Persistence**: Registered student data is stored in local storage, ensuring it remains available even after refreshing the page.
- **Responsive Design**: The system is designed to be responsive and user-friendly across different devices.

## File Structure
```plaintext
├── index.html          # Main page for student registration
├── students.html       # Page for viewing registered students
├── css/
│   └── styles.css      # CSS styles for the project
├── javascript/
│   └── script.js       # JavaScript file for handling functionality
└── README.md           # Project documentation
