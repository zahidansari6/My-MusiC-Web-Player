// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8Jo4GfLDgIA6jlQ8DqNYY-x7Jkzi_1Ok",
    authDomain: "debaspotifyclone.firebaseapp.com",
    projectId: "debaspotifyclone",
    storageBucket: "debaspotifyclone.appspot.com",
    messagingSenderId: "845893822646",
    appId: "1:845893822646:web:7f38db2243000f26c61e17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const signUpBtn = document.querySelector('.sign-up-btn');
  const signInBtn = document.querySelector('.sign-in-btn');
  const desktopSignUpBtn = document.getElementById('sign-up-btn');
  const desktopSignInBtn = document.getElementById('sign-in-btn');
  const signUpForm = document.getElementById('signUpForm');
  const signInForm = document.getElementById('signInForm');

  // Mobile navigation
  signUpBtn?.addEventListener('click', () => {
      container.classList.add('sign-up-mode');
      signUpBtn.classList.add('active');
      signInBtn.classList.remove('active');
  });

  signInBtn?.addEventListener('click', () => {
      container.classList.remove('sign-up-mode');
      signInBtn.classList.add('active');
      signUpBtn.classList.remove('active');
  });

  // Desktop navigation
  desktopSignUpBtn?.addEventListener('click', () => {
      container.classList.add('sign-up-mode');
  });

  desktopSignInBtn?.addEventListener('click', () => {
      container.classList.remove('sign-up-mode');
  });

  // Set initial active state for mobile
  signInBtn?.classList.add('active');

  // Sign Up Form Handler
  signUpForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('signUpName').value;
      const email = document.getElementById('signUpEmail').value;
      const password = document.getElementById('signUpPassword').value;

      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Save user data to realtime database
          await set(ref(database, 'users/' + user.uid), {
              name: name,
              email: email,
              lastLogin: Date.now()
          });

          alert('Account created successfully!');
          window.location.href = '/'; // Redirect to home page
      } catch (error) {
          alert(error.message);
      }
  });

  // Sign In Form Handler
  signInForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signInEmail').value;
      const password = document.getElementById('signInPassword').value;

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Update last login
          await update(ref(database, 'users/' + user.uid), {
              lastLogin: Date.now()
          });

          alert('Signed in successfully!');
          window.location.href = '/'; // Redirect to home page
      } catch (error) {
          alert(error.message);
      }
  });
});