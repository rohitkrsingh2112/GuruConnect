
# GuruConnect - Student-Teacher Booking App

**GuruConnect** is a web application that enables students to book appointments with their teachers, providing a seamless interface for both students and teachers. Admin users can manage appointments and user access, ensuring efficient communication and scheduling within educational institutions.

## Features

- **User Roles**: 
  - **Admin**: Manages users, appointments, and other administrative tasks.
  - **Teacher**: Manages their schedule and appointments.
  - **Student**: Books appointments with teachers.

- **Authentication**: Users can sign up, log in, and securely manage their profiles using Firebase Authentication.

- **Dashboard**: A personalized dashboard for each role:
  - Admin: Manage users, view all appointments.
  - Teacher: View and manage their schedule.
  - Student: Book appointments with available teachers.

## Tech Stack

- **Frontend**:
  - React.js
  - CSS
  - Firebase for authentication
- **Backend**:
  - Firebase Firestore for storing user and appointment data

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Firebase project setup with Authentication and Firestore enabled.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/guruconnec.git
   cd guruconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
   - Obtain your Firebase configuration and update the `firebaseConfig.js` file with your credentials.

4. Start the application:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features to Add

- **Admin Dashboard**: Admins can add, remove, or edit users and appointments.
- **Teacher Profile**: Teachers can manage their availability.
- **Student Profile**: Students can track their upcoming appointments.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
