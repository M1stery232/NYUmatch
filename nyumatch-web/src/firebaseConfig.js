import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB0bI_y0H7uxKWtfissCb3m0_xrlAApJcQ",
    authDomain: "nyumatch-1155c.firebaseapp.com",
    projectId: "nyumatch-1155c",
    storageBucket: "nyumatch-1155c.firebasestorage.app",
    messagingSenderId: "157638280063",
    appId: "1:157638280063:web:c396ab550e87fe3919504a",
    measurementId: "G-SPYTEL5DYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Add specific configurations for NYU
provider.setCustomParameters({
    prompt: 'select_account',
    hd: 'nyu.edu',
});

export { auth, provider }; 