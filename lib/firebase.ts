import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCeU0rdmzScorck5nLQ3z3sCkje86ZfeE",
  authDomain: "uglycat-25186.firebaseapp.com",
  projectId: "uglycat-25186",
  storageBucket: "uglycat-25186.appspot.com",
  messagingSenderId: "270840431341",
  appId: "1:270840431341:web:fda302afaaa4dc6a1b42e4",
  measurementId: "G-6CY8PL34Q0"
};

let app;
let db;
let storage;

try {
  // 检查是否已经初始化了 Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db, storage };
