
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

// Firebase connection
const firebaseConfig = {
  apiKey: "AIzaSyDVDDJqkn_PzkzHbB1JmrwnDrTyLMYApJU",
  authDomain: "findfit-7e932.firebaseapp.com",
  projectId: "findfit-7e932",
  storageBucket: "findfit-7e932.firebasestorage.app",
  messagingSenderId: "226565114138",
  appId: "1:226565114138:web:c22b6b717d2f657faa04a3",
  measurementId: "G-NQ5Y4R7QBX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Existing website features
const themeBtn = document.getElementById("themeBtn");
const langBtn = document.getElementById("langBtn");
const notice = document.getElementById("notice");

if (localStorage.getItem("findfit-theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "findfit-theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

langBtn?.addEventListener("click", () => {
  showNotice("תמיכה מלאה באנגלית תתווסף בהמשך.");
});

function showNotice(message) {
  if (!notice) return;
  notice.textContent = message;
  notice.classList.add("show");
  setTimeout(() => notice.classList.remove("show"), 3500);
}

document.querySelectorAll("[data-search]").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById("searchInput");
    if (input) {
      input.value = button.dataset.search;
      input.focus();
    }
  });
});

// Search products stored in Firestore
document.getElementById("searchForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  const input = document.getElementById("searchInput");
  const searchTerm = input?.value.trim().toLowerCase();

  if (!searchTerm) {
    showNotice("כתוב שם של מוצר כדי להתחיל.");
    return;
  }

  showNotice("מחפש מוצרים...");

  try {
    const snapshot = await getDocs(collection(db, "products"));

    const matches = snapshot.docs
      .map(document => document.data())
      .filter(product => {
        const name = String(product.name || product.title || "").toLowerCase();
        return name.includes(searchTerm);
      });

    if (matches.length === 0) {
      showNotice("לא נמצאו מוצרים. אפשר להוסיף מוצרים דרך מסד הנתונים.");
    } else {
      showNotice(`נמצאו ${matches.length} מוצרים מתאימים!`);
    }

  } catch (error) {
    console.error("FindFit search error:", error);
    showNotice("לא הצלחנו להתחבר למסד הנתונים. נבדוק את ההגדרות.");
  }
});
