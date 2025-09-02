// import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import app from "./config";

// /*import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import app from "./config";

// const db = getFirestore(app);

// // Save mood log
// export const saveMood = async (uid, mood, note) => {
//   await addDoc(collection(db, "moods"), {
//     uid,
//     mood,
//     note,
//     timestamp: Date.now()
//   });
// };

// // Fetch mood logs
// export const getMoods = async (uid) => {
//   const q = query(collection(db, "moods"), where("uid", "==", uid));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export { db };*/
// // src/firebase/firestore.js



// // //
// // export const testWrite = async () => {
// //   try {
// //     const docRef = await addDoc(collection(db, "testCollection"), {
// //       message: "Hello Firestore!",
// //       timestamp: Date.now(),
// //     });
// //     console.log(" Document written with ID: ", docRef.id);
// //   } catch (e) {
// //     console.error(" Error adding document: ", e);
// //   }
// // };

// // // 🔹 Test read
// // export const testRead = async () => {
// //   try {
// //     const querySnapshot = await getDocs(collection(db, "testCollection"));
// //     querySnapshot.forEach((doc) => {
// //       console.log(`${doc.id} =>`, doc.data());
// //     });
// //   } catch (e) {
// //     console.error(" Error reading documents: ", e);
// //   }
// // };
// // //
// const db = getFirestore(app);

// /* -------- Chat Mood Table (Insights) -------- */
// export const saveChatMood = async (email, sentiment) => {
//   await addDoc(collection(db, "chat_moods"), {
//     email,
//     sentiment,
//     timestamp: Date.now()
//   });
// };

// /* -------- Chat History Table -------- */
// export const saveChatHistory = async (email, title, details) => {
//   await addDoc(collection(db, "chat_history"), {
//     email,
//     title,
//     details,
//     timestamp: Date.now()
//   });
// };

// /* -------- Virtual Plant Table -------- */
// export const savePlantScore = async (email, sentiment, score) => {
//   await addDoc(collection(db, "virtual_plant"), {
//     email,
//     sentiment,
//     score,
//     timestamp: Date.now()
//   });
// };

// /* -------- Mood Entries Table -------- */
// export const saveMoodEntry = async (email, mood) => {
//   await addDoc(collection(db, "mood_entries"), {
//     email,
//     mood,
//     timestamp: Date.now()
//   });
// };

// /* -------- Mini Games Table -------- */
// export const saveGameScore = async (email, gameName, score) => {
//   await addDoc(collection(db, "mini_games"), {
//     email,
//     gameName,
//     highestScore: score,
//     timestamp: Date.now()
//   });
// };

// //..............................................
// export const testChatMood = async () => {
//   try {
//     const docRef = await addDoc(collection(db, "chat_moods"), {
//       email: "test@example.com",
//       sentiment: "positive",
//       timestamp: Date.now(),
//     });
//     console.log("testChatMood written id:", docRef.id);
//   } catch (e) {
//     console.error(" testChatMood error:", e);
//   }
// };

// export const readChatMoods = async () => {
//   try {
//     const snap = await getDocs(collection(db, "chat_moods"));
//     snap.forEach(doc => console.log("doc", doc.id, doc.data()));
//   } catch (e) {
//     console.error(" readChatMoods error:", e);
//   }
// };

// export { db };

//.........................................................................................................................................

import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

/* -------- Chat Mood Table (Insights) -------- */
export const saveChatMood = async (uid, sentiment) => {
  await addDoc(collection(db, `users/${uid}/chat_moods`), {
    sentiment,
    timestamp: Date.now()
  });
};

/* -------- Chat History Table -------- */
export const saveChatHistory = async (uid, title, details) => {
  await addDoc(collection(db, `users/${uid}/chat_history`), {
    title,
    details,
    timestamp: Date.now()
  });
};

/* -------- Virtual Plant Table -------- */
export const savePlantScore = async (uid, sentiment, score) => {
  await addDoc(collection(db, `users/${uid}/virtual_plant`), {
    sentiment,
    score,
    timestamp: Date.now()
  });
};

/* -------- Mood Entries Table -------- */
export const saveMoodEntry = async (uid, mood) => {
  await addDoc(collection(db, `users/${uid}/mood_entries`), {
    mood,
    timestamp: Date.now()
  });
};

/* -------- Mini Games Table -------- */
export const saveGameScore = async (uid, gameName, score) => {
  await addDoc(collection(db, `users/${uid}/mini_games`), {
    gameName,
    highestScore: score,
    timestamp: Date.now()
  });
};

/* -------- Test / Debug Functions -------- */
export const testChatMood = async (uid) => {
  try {
    const docRef = await addDoc(collection(db, `users/${uid}/chat_moods`), {
      sentiment: "positive",
      timestamp: Date.now(),
    });
    console.log("✅ testChatMood written id:", docRef.id);
  } catch (e) {
    console.error("❌ testChatMood error:", e);
  }
};

export const readChatMoods = async (uid) => {
  try {
    const snap = await getDocs(collection(db, `users/${uid}/chat_moods`));
    snap.forEach(doc => console.log("doc", doc.id, doc.data()));
  } catch (e) {
    console.error("❌ readChatMoods error:", e);
  }
};

export { db };
