import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCeU0rdmzScorck5nLQ3z3sCkje86ZfeE",
  authDomain: "uglycat-25186.firebaseapp.com",
  projectId: "uglycat-25186",
  storageBucket: "uglycat-25186.appspot.com",
  messagingSenderId: "270840431341",
  appId: "1:270840431341:web:fda302afaaa4dc6a1b42e4",
  measurementId: "G-6CY8PL34Q0"
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

try {
  if (typeof window === 'undefined') {
    // 服务器端
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log("Firebase initialized on server");
    } else {
      app = getApps()[0];
      db = getFirestore(app);
      storage = getStorage(app);
    }
  } else {
    // 客户端
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized on client");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error; // 重新抛出错误，以便上层代码可以处理
}

export { db, storage };
