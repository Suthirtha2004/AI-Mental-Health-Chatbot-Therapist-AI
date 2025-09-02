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

import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { format } from 'date-fns';
import app from "./config";

const db = getFirestore(app);

/* -------- Chat Mood Table (Insights) -------- */
export const saveChatMood = async (uid, sentiment, email) => {
  await addDoc(collection(db, `users/${uid}/chat_moods`), {
    sentiment,
    email: email ?? null,
    emailLower: email ? String(email).toLowerCase() : null,
    timestamp: Date.now()
  });
};

/* -------- Chat History Table -------- */
export const saveChatHistory = async (uid, title, details, email) => {
  await addDoc(collection(db, `users/${uid}/chat_history`), {
    title,
    details,
    email: email ?? null,
    emailLower: email ? String(email).toLowerCase() : null,
    timestamp: Date.now()
  });
};

// Top-level collections to match expected tables
export const saveChatMoodGlobal = async (email, sentiment, uid) => {
  await addDoc(collection(db, "saveChatMood"), {
    email,
    emailLower: email ? String(email).toLowerCase() : null,
    uid: uid ?? null,
    sentiment,
    timestamp: Date.now(),
  });
};

export const saveChatHistoryGlobal = async (email, title, details, uid) => {
  await addDoc(collection(db, "saveChatHistory"), {
    email,
    emailLower: email ? String(email).toLowerCase() : null,
    uid: uid ?? null,
    title,
    details,
    timestamp: Date.now(),
  });
};

export const testFirestoreConnectivity = async () => {
  try {
    const testRef = await addDoc(collection(db, "_app_connection_tests"), {
      ping: "pong",
      timestamp: Date.now(),
    });
    const readBack = await getDoc(doc(db, "_app_connection_tests", testRef.id));
    return { ok: true, id: testRef.id, data: readBack.exists() ? readBack.data() : null };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
};

export const getChatHistory = async (uid) => {
  const q = query(collection(db, `users/${uid}/chat_history`), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getChatHistoryByEmail = async (email) => {
  const col = collection(db, "saveChatHistory");
  const lower = String(email).toLowerCase();
  // Prefer normalized field
  let q1 = query(col, where("emailLower", "==", lower), orderBy("timestamp", "desc"));
  let snap = await getDocs(q1);
  let docs = snap.docs;

  // If nothing, try nested field path details.email
  if (!docs || docs.length === 0) {
    const q2 = query(col, where("details.email", "==", email), orderBy("timestamp", "desc"));
    const snap2 = await getDocs(q2);
    docs = snap2.docs;
  }

  // Fallback to legacy top-level email
  if (!docs || docs.length === 0) {
    const q3 = query(col, where("email", "==", email), orderBy("timestamp", "desc"));
    const snap3 = await getDocs(q3);
    docs = snap3.docs;
  }

  return docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      email: data.email ?? data?.details?.email ?? null,
      title: data.title ?? data?.details?.title ?? "",
      details: data.details ?? { user: data.user, bot: data.bot, sentiment: data.sentiment },
      timestamp: data.timestamp ?? null,
    };
  });
};

// Ultra-robust fetch that works even without composite indexes by falling back to client-side filtering
export const getChatHistoryByEmailAny = async (email, maxDocs = 200) => {
  try {
    const direct = await getChatHistoryByEmail(email);
    if (direct && direct.length > 0) return direct;
  } catch (e) {
    // ignore and fallback
  }

  const lower = String(email).toLowerCase();
  const col = collection(db, "saveChatHistory");

  // Try simpler queries without orderBy (avoid index requirements)
  try {
    const qA = query(col, where("emailLower", "==", lower));
    const snapA = await getDocs(qA);
    if (!snapA.empty) {
      return snapA.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  } catch {}

  try {
    const qB = query(col, where("email", "==", email));
    const snapB = await getDocs(qB);
    if (!snapB.empty) {
      return snapB.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  } catch {}

  // Last resort: fetch a window and filter client-side
  const snapAll = await getDocs(col);
  const filtered = snapAll.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(x => (x.email && x.email === email) || (x.emailLower && x.emailLower === lower) || (x.details?.email && x.details.email === email))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, maxDocs);
  return filtered;
};

export const getChatHistoryByUidAny = async (uid, maxDocs = 200) => {
  // 1) Preferred: user subcollection ordered by timestamp
  try {
    const q = query(collection(db, `users/${uid}/chat_history`), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {}

  const col = collection(db, "saveChatHistory");
  // 2) Top-level by uid with order
  try {
    const q2 = query(col, where("uid", "==", uid), orderBy("timestamp", "desc"));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) return snap2.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {}

  // 3) Top-level by uid without order, then sort client-side
  try {
    const q3 = query(col, where("uid", "==", uid));
    const snap3 = await getDocs(q3);
    if (!snap3.empty) {
      return snap3.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  } catch (e) {}

  // 4) Last resort: fetch a window and filter client-side
  const snapAll = await getDocs(col);
  return snapAll.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(x => x.uid === uid)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, maxDocs);
};

export const getChatSentimentScores = async (uid, maxDocs = 50) => {
  try {
    // Try user subcollection first
    const q1 = query(collection(db, `users/${uid}/chat_history`), orderBy("timestamp", "desc"));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      return snap1.docs
        .map(d => d.data())
        .filter(x => x.details?.sentimentScore !== undefined)
        .map(x => ({ score: x.details.sentimentScore, timestamp: x.timestamp }))
        .slice(0, maxDocs);
    }
  } catch (e) {}

  // Fallback to top-level collection
  const col = collection(db, "saveChatHistory");
  try {
    const q2 = query(col, where("uid", "==", uid), orderBy("timestamp", "desc"));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      return snap2.docs
        .map(d => d.data())
        .filter(x => x.details?.sentimentScore !== undefined)
        .map(x => ({ score: x.details.sentimentScore, timestamp: x.timestamp }))
        .slice(0, maxDocs);
    }
  } catch (e) {}

  // Last resort: fetch and filter client-side
  const snapAll = await getDocs(col);
  return snapAll.docs
    .map(d => d.data())
    .filter(x => x.uid === uid && x.details?.sentimentScore !== undefined)
    .map(x => ({ score: x.details.sentimentScore, timestamp: x.timestamp }))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, maxDocs);
};

export const getChatSentiments = async (uid, maxDocs = 50) => {
  const parseDocs = (snap) => {
    return snap.docs
      .map(d => d.data())
      .filter(x => x.details?.sentiment) // only keep if sentiment exists
      .map(x => ({
        sentiment: x.details.sentiment,   // "POSITIVE" | "NEGATIVE" | "NEUTRAL"
        timestamp: x.timestamp || null
      }))
      .slice(0, maxDocs);
  };

  try {
    // Check user subcollection
    const q1 = query(
      collection(db, `users/${uid}/chat_history`),
      orderBy("timestamp", "desc")
    );
    const snap1 = await getDocs(q1);
    if (!snap1.empty) return parseDocs(snap1);
  } catch (e) {
    console.error("Error fetching user subcollection:", e);
  }

  try {
    // Fallback to top-level collection
    const col = collection(db, "saveChatHistory");
    const q2 = query(col, where("uid", "==", uid), orderBy("timestamp", "desc"));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) return parseDocs(snap2);

    // Last resort: client-side filter
    const snapAll = await getDocs(col);
    return snapAll.docs
      .map(d => d.data())
      .filter(x => x.uid === uid && x.details?.sentiment)
      .map(x => ({
        sentiment: x.details.sentiment,
        timestamp: x.timestamp || null
      }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, maxDocs);
  } catch (e) {
    console.error("Error fetching fallback:", e);
    return [];
  }
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
export const saveMoodEntry = async (uid, moodData) => {
  const moodEntry = {
    mood: moodData.mood,
    intensity: moodData.intensity,
    activities: moodData.activities,
    notes: moodData.notes,
    date: moodData.date || format(new Date(), 'yyyy-MM-dd'),
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(collection(db, `users/${uid}/mood_entries`), moodEntry);
  return docRef.id;
};

// Get mood entries for a user
export const getMoodEntries = async (uid) => {
  try {
    const q = query(
      collection(db, `users/${uid}/mood_entries`),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

// Get mood entries by date range
export const getMoodEntriesByDateRange = async (uid, startDate, endDate) => {
  try {
    const q = query(
      collection(db, `users/${uid}/mood_entries`),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting mood entries by date range:', error);
    return [];
  }
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
