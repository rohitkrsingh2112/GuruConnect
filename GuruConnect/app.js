// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGUU-pG-rUvZ-HvV80qJ-8eXvkduWnGP0",
  authDomain: "student-teacher-booking-bd464.firebaseapp.com",
  projectId: "student-teacher-booking-bd464",
  storageBucket: "student-teacher-booking-bd464.appspot.com",
  messagingSenderId: "987980039748",
  appId: "1:987980039748:web:4d88dbf949f3233c8b5e11",
  measurementId: "G-70CE0Y03YN"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const appointmentsCollection = db.collection('appointments');

new Vue({
  el: '#app',
  data: {
    view: '',
    adminLoggedIn: false,
    teacherLoggedIn: false,
    studentLoggedIn: false,
    adminemail: '',
    adminpassword: '',
    loginEmail: '',
    loginPassword: '',
    registerEmail: '',
    registerPassword: '',
    adminErrorMessage: '',
    errorMessage: '',
    successMessage: '',
    messages: [],
    appointments: [],
    newTeacherName: '',
    newTeacherEmail: '',
    newTeacherPassword: '',
    newTeacherDepartment: '',
    newTeacherSubject: '',
    updateTeacherEmail: '',
    updateTeacherName: '',
    updateTeacherDepartment: '',
    updateTeacherSubject: '',
    pendingStudents: [],
    approvedStudents: [],
    deniedStudents: [],
    pendingTeachers: [],
    approvedTeachers: [],
    deniedTeachers: [],
    appointmentTeacherEmail: '',
    appointmentDate: '',
    messageTeacherEmail: '',
    messageContent: '',
    searchQuery: '',
    searchResults: []
  },
  methods: {
    handleMessageDisplay() {
      setTimeout(() => {
        this.errorMessage = '';
        this.successMessage = '';
      }, 3000); // Clear messages after 3 seconds
    },
    adminLogin() {
      const defaultadminemail = 'admin@gmail.com';
      const defaultadminpassword = '123456789';
      if (this.adminemail == defaultadminemail && this.adminpassword == defaultadminpassword) {
        this.adminLoggedIn = true;
        this.adminErrorMessage = '';
        this.successMessage = 'Admin logged in successfully';
        this.handleMessageDisplay();
        this.fetchPendingUsers('student');
        this.fetchPendingUsers('teacher');
        this.fetchApprovedUsers('student');
        this.fetchApprovedUsers('teacher');
        this.fetchDeniedUsers('student');
        this.fetchDeniedUsers('teacher');
      } else {
        this.adminErrorMessage = 'Invalid credentials. Please try again.';
        this.handleMessageDisplay();
      }
    },
    teacherLogin() {
      firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
        .then(userCredential => {
          const user = userCredential.user;
          return db.collection('pendingTeachers').where('email', '==', user.email).get();
        })
        .then(snapshot => {
          if (snapshot.empty) {
            throw new Error('Teacher not found or not approved');
          }
          snapshot.forEach(doc => {
            const teacherData = doc.data();
            if (teacherData.approved) {
              this.teacherLoggedIn = true;
              this.successMessage = 'Teacher logged in successfully';
              this.handleMessageDisplay();
              this.fetchMessages();
              this.fetchAppointments();
            } else {
              throw new Error('Teacher not approved');
            }
          });
        })
        .catch(error => {
          console.error('Error logging in:', error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    teacherRegister() {
      firebase.auth().createUserWithEmailAndPassword(this.registerEmail, this.registerPassword)
        .then(user => {
          db.collection('pendingTeachers').add({
            email: this.registerEmail,
            approved: false
          });
          this.successMessage = 'Teacher registration request sent';
          this.handleMessageDisplay();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    studentLogin() {
      firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
        .then(userCredential => {
          const user = userCredential.user;
          return db.collection('pendingStudents').where('email', '==', user.email).get();
        })
        .then(snapshot => {
          if (snapshot.empty) {
            throw new Error('Student not found or not approved');
          }
          snapshot.forEach(doc => {
            const studentData = doc.data();
            if (studentData.approved) {
              this.studentLoggedIn = true;
              this.successMessage = 'Student logged in successfully';
              this.handleMessageDisplay();
              this.fetchMessages();
              this.fetchAppointments();
            } else {
              throw new Error('Student not approved');
            }
          });
        })
        .catch(error => {
          console.error('Error logging in:', error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    studentRegister() {
      firebase.auth().createUserWithEmailAndPassword(this.registerEmail, this.registerPassword)
        .then(user => {
          db.collection('pendingStudents').add({
            email: this.registerEmail,
            approved: false
          });
          this.successMessage = 'Student registration request sent';
          this.handleMessageDisplay();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    fetchMessages() {
      const currentUserEmail = firebase.auth().currentUser.email;
      db.collection('messages').where('teacherEmail', '==', currentUserEmail)
        .onSnapshot(snapshot => {
          const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.messages = messages;
        }, error => {
          console.error('Error fetching messages:', error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    fetchAppointments() {
      const currentUserEmail = firebase.auth().currentUser.email;
      db.collection('appointments').where('teacherEmail', '==', currentUserEmail)
        .onSnapshot(snapshot => {
          const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.appointments = appointments;
        }, error => {
          console.error('Error fetching appointments:', error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    sendMessage() {
      if (!this.messageTeacherEmail || !this.messageContent) {
        throw new Error ('Teacher Email and Message Content are required.');
        this.handleMessageDisplay();
        return; 
      }
      db.collection('pendingTeachers')
        .where('email', '==', this.messageTeacherEmail)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            throw new Error ('Teacher email not found in pending registrations.');
            this.handleMessageDisplay();
          } else {
            db.collection('messages').add({
              teacherEmail: this.messageTeacherEmail,
              studentEmail: firebase.auth().currentUser.email,
              content: this.messageContent,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              this.messageTeacherEmail = '';
              this.messageContent = '';
              this.successMessage = 'Message sent successfully';
              this.handleMessageDisplay();
            })
            .catch(error => {
              this.errorMessage = 'Failed to send message: ' + error.message;
              this.handleMessageDisplay();
            });
          }
        })
        .catch(error => {
          this.errorMessage = 'Error checking teacher email validity: ' + error.message;
          this.handleMessageDisplay();
        });
    },    
    bookAppointment() {
      // Validate input before proceeding
      if (!this.appointmentTeacherEmail || !this.appointmentDate) {
        this.errorMessage = 'Teacher Email and Appointment Date are required.';
        this.handleMessageDisplay();
        return; // Exit function early if inputs are missing
      }
    
      // Check if the teacher's email exists in the "pending teachers" collection
      db.collection('pendingTeachers')
        .where('email', '==', this.appointmentTeacherEmail)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            // If no matching document found, display an error
            this.errorMessage = 'Teacher email not found in pending registrations.';
            this.handleMessageDisplay();
          } else {
            // If teacher email is valid, proceed to add the appointment
            db.collection('appointments').add({
              teacherEmail: this.appointmentTeacherEmail,
              studentEmail: firebase.auth().currentUser.email,
              date: this.appointmentDate,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              // Clear input fields after successful booking
              this.appointmentTeacherEmail = '';
              this.appointmentDate = '';
              // Update success message and display it
              this.successMessage = 'Appointment booked successfully';
              this.handleMessageDisplay();
            })
            .catch(error => {
              // Display error message if there's an issue adding the appointment
              this.errorMessage = 'Failed to book appointment: ' + error.message;
              this.handleMessageDisplay();
            });
          }
        })
        .catch(error => {
          // Display error message if there's an issue with the query
          this.errorMessage = 'Error checking teacher email validity: ' + error.message;
          this.handleMessageDisplay();
        });
    },
    searchTeacher() {
      db.collection('pendingTeachers')
        .where('name', '==', this.searchQuery)
        .where('approved', '==', true)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.searchResults = [];
          } else {
            this.searchResults = snapshot.docs.map(doc => doc.data());
          }
        })
        .catch(error => {
          console.error('Error searching teachers:', error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    addTeacher() {
      firebase.auth().createUserWithEmailAndPassword(this.newTeacherEmail, this.newTeacherPassword)
        .then(user => {
          db.collection('pendingTeachers').add({
            name: this.newTeacherName,
            email: this.newTeacherEmail,
            department: this.newTeacherDepartment,
            subject: this.newTeacherSubject
          });
          this.successMessage = 'Teacher added successfully';
          this.handleMessageDisplay();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    updateTeacher() {
      db.collection('pendingTeachers').where('email', '==', this.updateTeacherEmail).get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            doc.ref.update({
              name: this.updateTeacherName,
              department: this.updateTeacherDepartment,
              subject: this.updateTeacherSubject
            });
          });
          this.successMessage = 'Teacher updated successfully';
          this.handleMessageDisplay();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    deleteTeacher() {
      db.collection('pendingTeachers').where('email', '==', this.updateTeacherEmail).get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            doc.ref.delete();
          });
          this.successMessage = 'Teacher deleted successfully';
          this.handleMessageDisplay();
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    approveStudentRegistration(studentId) {
      db.collection('pendingStudents').doc(studentId).update({
        approved: true
      })
      .then(() => {
        this.successMessage = 'Student approved successfully';
        this.handleMessageDisplay();
        this.fetchPendingUsers('student');
        this.fetchApprovedUsers('student');
      })
      .catch(error => {
        console.error('Error approving student:', error);
        this.errorMessage = error.message;
        this.handleMessageDisplay();
      });
    },
    approveTeacherRegistration(teacherId) {
      db.collection('pendingTeachers').doc(teacherId).update({
        approved: true
      })
      .then(() => {
        this.successMessage = 'Teacher approved successfully';
        this.handleMessageDisplay();
        this.fetchPendingUsers('teacher');
        this.fetchApprovedUsers('teacher');
      })
      .catch(error => {
        console.error('Error approving teacher:', error);
        this.errorMessage = error.message;
        this.handleMessageDisplay();
      });
    },
    denyStudentRegistration(studentId) {
      db.collection('pendingStudents').doc(studentId).delete()
      .then(() => {
        this.successMessage = 'Student denied successfully';
        this.handleMessageDisplay();
        this.fetchPendingUsers('student');
        this.fetchDeniedUsers('student');
      })
      .catch(error => {
        console.error('Error denying student:', error);
        this.errorMessage = error.message;
        this.handleMessageDisplay();
      });
    },
    denyTeacherRegistration(teacherId) {
      db.collection('pendingTeachers').doc(teacherId).delete()
      .then(() => {
        this.successMessage = 'Teacher denied successfully';
        this.handleMessageDisplay();
        this.fetchPendingUsers('teacher');
        this.fetchDeniedUsers('teacher');
      })
      .catch(error => {
        console.error('Error denying teacher:', error);
        this.errorMessage = error.message;
        this.handleMessageDisplay();
      });
    },
    approveAppointment(appointmentId) {
      db.collection('appointments').doc(appointmentId).update({
        approved: true
      }).then(() => {
        this.successMessage = 'Appointment approved successfully';
        this.handleMessageDisplay();
      }).catch(error => {
        this.errorMessage = error.message;
        this.handleMessageDisplay();
      });
    },
    cancelAppointment(appointmentId) {
      db.collection('appointments').doc(appointmentId).delete();
    },
    fetchPendingUsers(type) {
      const collectionName = type === 'student' ? 'pendingStudents' : 'pendingTeachers';
      db.collection(collectionName).where('approved', '==', false).get()
        .then(snapshot => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (type === 'student') {
            this.pendingStudents = users;
          } else {
            this.pendingTeachers = users;
          }
        })
        .catch(error => {
          console.error(`Error fetching pending ${type}s:`, error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    fetchApprovedUsers(type) {
      const collectionName = type === 'student' ? 'pendingStudents' : 'pendingTeachers';
      db.collection(collectionName).where('approved', '==', true).get()
        .then(snapshot => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (type === 'student') {
            this.approvedStudents = users;
          } else {
            this.approvedTeachers = users;
          }
        })
        .catch(error => {
          console.error(`Error fetching approved ${type}s:`, error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    },
    fetchDeniedUsers(type) {
      const collectionName = type === 'student' ? 'pendingStudents' : 'pendingTeachers';
      db.collection(collectionName).where('approved', '==', false).get()
        .then(snapshot => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (type === 'student') {
            this.deniedStudents = users.filter(user => user.denied === true);
          } else {
            this.deniedTeachers = users.filter(user => user.denied === true);
          }
        })
        .catch(error => {
          console.error(`Error fetching denied ${type}s:`, error);
          this.errorMessage = error.message;
          this.handleMessageDisplay();
        });
    }
  }
});

