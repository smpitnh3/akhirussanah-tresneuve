import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  startAfter,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDF_aL-eyUPr6Rk1ebGFApZilEfipVKiVQ",
  authDomain: "akhirussanah-smpit-nurhikmah.firebaseapp.com",
  projectId: "akhirussanah-smpit-nurhikmah",
  storageBucket: "akhirussanah-smpit-nurhikmah.firebasestorage.app",
  messagingSenderId: "300425555061",
  appId: "1:300425555061:web:8047c8135efaf7dfaa5c3c",
  measurementId: "G-6KHXZERDFJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const doaForm = document.querySelector("#doaForm");
const formStatus = document.querySelector("#formStatus");
const doaCountText = document.querySelector("#doaCountText");
const messageList = document.querySelector("#messageList");
const loadMoreButton = document.querySelector("#loadMoreMessages");

const MESSAGE_LIMIT = 10;

let latestDocs = [];
let olderDocs = [];
let lastVisibleDoc = null;
let isLoadingOlderMessages = false;
let hasMoreMessages = true;
let totalMessageCount = 0;

function escapeHTML(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(message) {
  if (!formStatus) return;
  formStatus.textContent = message;
}

let lastRenderedDoaCount = null;

function renderDoaCount(total) {
  if (!doaCountText) return;

  const count = Number(total) || 0;

  if (count <= 0) {
    doaCountText.hidden = true;
    doaCountText.innerHTML = "";
    lastRenderedDoaCount = count;
    return;
  }

  doaCountText.hidden = false;

  if (count === 1) {
    doaCountText.innerHTML =
      "Alhamdulillah, pesan dan doa pertama telah mengiringi langkah wisudawan dan wisudawati.";
  } else {
    doaCountText.innerHTML = `Alhamdulillah, <strong>${count} pesan &amp; doa terbaik</strong> telah mengiringi langkah wisudawan dan wisudawati.`;
  }

  if (lastRenderedDoaCount !== count) {
    animateDoaCountText();
    lastRenderedDoaCount = count;
  }
}

function updateLoadMoreVisibility() {
  if (!loadMoreButton) return;

  const renderedMessages = latestDocs.length + olderDocs.length;

  if (totalMessageCount <= 0) {
    loadMoreButton.hidden = true;
    return;
  }

  loadMoreButton.hidden = renderedMessages >= totalMessageCount;
}

async function updateDoaCount() {
  if (!doaCountText) return;

  try {
    const countSnapshot = await getCountFromServer(collection(db, "doa"));
    totalMessageCount = countSnapshot.data().count || 0;

    renderDoaCount(totalMessageCount);
    updateLoadMoreVisibility();
  } catch (error) {
    console.error("Gagal menghitung jumlah pesan doa:", error);
  }
}

function getInitial(name) {
  return (
    String(name || "Tamu")
      .trim()
      .charAt(0)
      .toUpperCase() || "T"
  );
}

function formatMessageTime(timestamp) {
  if (!timestamp || !timestamp.toDate) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startOfMessageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffDays = Math.round(
    (startOfToday - startOfMessageDate) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays === 1) {
    return "Kemarin";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderMessageCard(data) {
  const nama = data.nama || "Tamu";
  const pesan = data.pesan || "";
  const waktu = formatMessageTime(data.createdAt);

  const card = document.createElement("div");
  card.className = "message-card";

  card.innerHTML = `
    <div class="message-avatar">${escapeHTML(getInitial(nama))}</div>

    <div class="message-bubble">
      <div class="message-meta">
        <h3>${escapeHTML(nama)}</h3>
        ${waktu ? `<span>${escapeHTML(waktu)}</span>` : ""}
      </div>

      <p>${escapeHTML(pesan)}</p>
    </div>
  `;

  return card;
}

function renderEmptyMessage() {
  messageList.innerHTML = `
    <div class="message-card">
      <div class="message-avatar">?</div>

      <div class="message-bubble">
        <div class="message-meta">
          <h3>Belum Ada Pesan</h3>
        </div>

        <p>Jadilah yang pertama mengirim pesan atau doa terbaik.</p>
      </div>
    </div>
  `;
}

function renderErrorMessage() {
  messageList.innerHTML = `
    <div class="message-card">
      <div class="message-avatar">!</div>

      <div class="message-bubble">
        <div class="message-meta">
          <h3>Data Belum Bisa Dibaca</h3>
        </div>

        <p>Cek koneksi Firebase atau Rules Firestore.</p>
      </div>
    </div>
  `;
}

function animateMessageCards() {
  if (!messageList) return;

  const cards = messageList.querySelectorAll(".message-card");
  if (!cards.length) return;

  if (typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(cards, {
      y: 22,
      autoAlpha: 0,
      filter: "blur(5px)",
    });

    gsap.to(cards, {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: {
        trigger: messageList,
        start: "top 86%",
        toggleActions: "play none none reset",
      },
    });

    ScrollTrigger.refresh();
    return;
  }

  gsap.fromTo(
    cards,
    {
      y: 18,
      autoAlpha: 0,
      filter: "blur(4px)",
    },
    {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.06,
    },
  );
}

function renderAllMessages() {
  if (!messageList) return;

  messageList.innerHTML = "";

  const allDocs = [...latestDocs, ...olderDocs];

  if (!allDocs.length) {
    renderEmptyMessage();
    animateMessageCards();
    return;
  }

  allDocs.forEach((doc) => {
    messageList.appendChild(renderMessageCard(doc.data()));
  });

  animateMessageCards();
}

if (doaForm && formStatus && messageList) {
  const senderNameInput = doaForm.querySelector(
    "#senderName, [name='senderName'], input[type='text']",
  );

  const senderMessageInput = doaForm.querySelector(
    "#senderMessage, [name='senderMessage'], textarea",
  );

  if (!senderNameInput || !senderMessageInput) {
    setStatus("Form belum lengkap. Cek input nama dan pesan.");
  } else {
    doaForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nama = senderNameInput.value.trim();
      const pesan = senderMessageInput.value.trim();
      const submitButton = doaForm.querySelector("button[type='submit']");

      if (!nama || !pesan) {
        setStatus("Mohon isi nama dan doa terlebih dahulu.");
        return;
      }

      if (nama.length < 2 || nama.length > 60) {
        setStatus("Nama minimal 2 karakter dan maksimal 60 karakter.");
        return;
      }

      if (pesan.length < 5 || pesan.length > 500) {
        setStatus("Doa minimal 5 karakter dan maksimal 500 karakter.");
        return;
      }

      try {
        setStatus("Mengirim doa...");

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Mengirim...";
        }

        await addDoc(collection(db, "doa"), {
          nama,
          pesan,
          createdAt: serverTimestamp(),
        });

        doaForm.reset();
        setStatus(
          "Jazakumullahu khairan. Pesan dan doa terbaik Anda telah kami terima.",
        );
      } catch (error) {
        console.error("Gagal mengirim pesan atau doa:", error);
        setStatus("Maaf, pesan atau doa belum berhasil dikirim. Coba lagi.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Kirim Doa";
        }
      }
    });
  }

  const doaQuery = query(
    collection(db, "doa"),
    orderBy("createdAt", "desc"),
    limit(MESSAGE_LIMIT),
  );

  onSnapshot(
    doaQuery,
    (snapshot) => {
      latestDocs = snapshot.docs;
      lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      hasMoreMessages = snapshot.docs.length === MESSAGE_LIMIT;

      olderDocs = olderDocs.filter((olderDoc) => {
        return !latestDocs.some((latestDoc) => latestDoc.id === olderDoc.id);
      });

      renderAllMessages();

      updateDoaCount();
    },
    (error) => {
      console.error("Gagal membaca data doa:", error);
      renderErrorMessage();
      animateMessageCards();
    },
  );

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async () => {
      if (!lastVisibleDoc || isLoadingOlderMessages || !hasMoreMessages) return;

      try {
        isLoadingOlderMessages = true;
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = "Memuat...";

        const olderQuery = query(
          collection(db, "doa"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisibleDoc),
          limit(MESSAGE_LIMIT),
        );

        const olderSnapshot = await getDocs(olderQuery);

        if (olderSnapshot.empty) {
          hasMoreMessages = false;
          updateLoadMoreVisibility();
          return;
        }

        olderSnapshot.docs.forEach((olderDoc) => {
          const alreadyExists =
            latestDocs.some((doc) => doc.id === olderDoc.id) ||
            olderDocs.some((doc) => doc.id === olderDoc.id);

          if (!alreadyExists) {
            olderDocs.push(olderDoc);
          }
        });

        lastVisibleDoc =
          olderSnapshot.docs[olderSnapshot.docs.length - 1] || lastVisibleDoc;

        hasMoreMessages = olderSnapshot.docs.length === MESSAGE_LIMIT;

        renderAllMessages();

        updateLoadMoreVisibility();
      } catch (error) {
        console.error("Gagal memuat pesan lama:", error);
        setStatus("Maaf, pesan lama belum berhasil dimuat.");
      } finally {
        isLoadingOlderMessages = false;

        if (loadMoreButton) {
          loadMoreButton.disabled = false;
          loadMoreButton.textContent = "Muat pesan sebelumnya";
        }
      }
    });
  }
}
