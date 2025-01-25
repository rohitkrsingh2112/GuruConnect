Student-Teacher Booking System
This is a web application built using Vue.js and Firebase for the Student-Teacher Booking System. It allows admins to log in, register new teachers and students, and manage their accounts. Teachers and students can register themselves, and their accounts will be verified by the admin before being fully activated.

Features
Admin Login: Admins can log in using default credentials and manage users.
Teacher Registration: Teachers can register by providing their details, including department and subject.
Student Registration: Students can register by providing their personal details.
Firebase Integration: Firebase Authentication and Firestore Database are used for handling user authentication and storing user data.
Admin Approval: New teacher and student registrations are pending approval from the admin.
Technologies Used
Vue.js: JavaScript framework for building user interfaces.
Firebase: Backend-as-a-Service for authentication and data storage.
HTML/CSS: Standard web technologies for creating the layout and styling of the application.
Installation
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/student-teacher-booking-system.git
cd student-teacher-booking-system
2. Set up Firebase
Go to the Firebase Console.
Create a new Firebase project.
Set up Firebase Authentication and Firestore Database.
Replace the Firebase configuration details in the app.js file with your own Firebase project credentials.
3. Install Dependencies
This project uses Vue.js. You can install dependencies using npm or yarn.

Make sure to install Node.js before continuing.

To install dependencies:

bash
Copy
Edit
npm install
4. Run the Application Locally
After setting up Firebase and installing dependencies, run the app locally using:

bash
Copy
Edit
npm run serve
This will start the application on http://localhost:8080/.

Usage
Admin Login:

The admin can log in with the default email admin@gmail.com and password 123456789.
Teacher Registration:

Teachers can register by providing their name, email, password, department, and subject. The registration will be pending approval from the admin.
Student Registration:

Students can register by providing their name, email, and password. The registration will also be pending approval from the admin.
Messages:

Success and Error messages are shown for actions like login, registration, and errors.
Messages disappear after 3 seconds.
Firebase Configuration
In the app.js file, replace the Firebase configuration object with your own project credentials:

javascript
Copy
Edit
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
Future Improvements
Teacher Approval System: Add a feature for admins to approve/reject teacher registrations.
Student Approval System: Add a feature for admins to approve/reject student registrations.
User Profile: Allow teachers and students to manage their profiles after registration.
Search and Filter: Add a feature to search for teachers or students based on different criteria.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Vue.js: A progressive JavaScript framework for building user interfaces.
Firebase: A platform that provides backend services like authentication and database for web applications.

Open for collab and contribution
contact - Rohit Kumar Sin @ rohitsingh21official@gmail.com