import admin from "firebase-admin";
import serviceAccount from "./tic-app-key.js";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

export default db;
