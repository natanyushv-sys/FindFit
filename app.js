
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVDDJqkn_PzkzHbB1JmrwnDrTyLMYApJU",
  authDomain: "findfit-7e932.firebaseapp.com",
  projectId: "findfit-7e932",
  storageBucket: "findfit-7e932.firebasestorage.app",
  messagingSenderId: "226565114138",
  appId: "1:565114138:web:c22b6b717d2f657faa04a3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const themeBtn = document.getElementById("themeBtn");
const langBtn = document.getElementById("langBtn");
const notice = document.getElementById("notice");
const productsList = document.getElementById("productsList");

if (localStorage.getItem("findfit-theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("findfit-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

langBtn?.addEventListener("click", () => showNotice("תמיכה מלאה באנגלית תתווסף בהמשך."));

function showNotice(message) {
  if (!notice) return;
  notice.textContent = message;
  notice.classList.add("show");
  setTimeout(() => notice.classList.remove("show"), 3000);
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

function renderProducts(products) {
  if (!productsList) return;

  productsList.replaceChildren();

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const name = document.createElement("h3");
    name.textContent = product.name || product.title || "מוצר ללא שם";

    const price = document.createElement("p");
    price.textContent = product.price != null ? `מחיר: ₪${product.price}` : "מחיר לא צוין";

    const store = document.createElement("p");
    store.textContent = `חנות: ${product.store || "לא צוינה"}`;

    card.append(name, price, store);
    productsList.append(card);
  });
}

document.getElementById("searchForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  const term = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!term) {
    showNotice("כתוב שם של מוצר כדי להתחיל.");
    return;
  }

  showNotice("מחפש מוצרים...");

  try {
    const snapshot = await getDocs(collection(db, "products"));

    const matches = snapshot.docs
      .map(doc => doc.data())
      .filter(product => {
        const name = String(product.name || product.title || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        return name.includes(term) || category.includes(term);
      });

    renderProducts(matches);
    showNotice(matches.length ? `נמצאו ${matches.length} מוצרים` : "לא נמצאו מוצרים.");

  } catch (error) {
    console.error(error);
    showNotice("שגיאה בחיבור למסד הנתונים.");
  }
});
