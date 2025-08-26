import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

// Save mood log
export const saveMood = async (uid, mood, note) => {
  await addDoc(collection(db, "moods"), {
    uid,
    mood,
    note,
    timestamp: Date.now()
  });
};

// Fetch mood logs
export const getMoods = async (uid) => {
  const q = query(collection(db, "moods"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { db };
