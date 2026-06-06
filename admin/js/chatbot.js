// ===============================
// CHATBOT.JS (UPDATED VERSION)
// ===============================

let allData = [];
let currentPage = 1;

const rowsPerPage = 4;

// ===============================
// LOAD CHATBOT DATA
// ===============================

async function loadChatbot() {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch("https://api.parassecurity.in/api/admin/chatbot", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    console.log("CHATBOT API RESULT:", result);

    if (!result.success) {
      alert(result.message || "Failed to load chatbot data");
      return;
    }

    // ===============================
    // LATEST RESPONSE FIRST
    // ===============================

    allData = (result.data || []).reverse();

    renderTable();

  } catch (err) {

    console.error(err);
    alert("Server Error");

  }
}

// ===============================
// RENDER TABLE
// ===============================

function renderTable() {

  const table = document.getElementById("chatbotTable");

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedData = allData.slice(start, end);

  let html = "";

  // ===============================
  // NEW TAG LOGIC
  // ===============================

  let seenMessages =
    JSON.parse(localStorage.getItem("seenChatbotMessages")) || [];

  paginatedData.forEach((c, index) => {

    // unique ID for each response
    const uniqueId =
      `${c.name}-${c.phone}-${c.date}-${index}`;

    const isNew = !seenMessages.includes(uniqueId);

    html += `
      <tr>
        <td>
          ${c.name || ""}
          ${isNew ? `<span class="new-badge">NEW</span>` : ""}
        </td>

        <td>${c.phone || ""}</td>

        <td>${c.interest || ""}</td>

        <td>${c.message || ""}</td>

        <td>${c.date || c.createdAt || ""}</td>
      </tr>
    `;

    // mark as seen
    if (!seenMessages.includes(uniqueId)) {
      seenMessages.push(uniqueId);
    }

  });

  // save seen messages
  localStorage.setItem(
    "seenChatbotMessages",
    JSON.stringify(seenMessages)
  );

  table.innerHTML = html;

  renderPagination();
}

// ===============================
// PAGINATION
// ===============================

function renderPagination() {

  const pagination = document.getElementById("pagination");

  const totalPages =
    Math.ceil(allData.length / rowsPerPage);

  let html = "";

  // PREV BUTTON
  html += `
    <button
      class="page-btn"
      ${currentPage === 1 ? "disabled" : ""}
      onclick="changePage(${currentPage - 1})"
    >
      Prev
    </button>
  `;

  // PAGE NUMBERS
  for (let i = 1; i <= totalPages; i++) {

    html += `
      <button
        class="page-btn ${currentPage === i ? "active-page" : ""}"
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }

  // NEXT BUTTON
  html += `
    <button
      class="page-btn"
      ${currentPage === totalPages ? "disabled" : ""}
      onclick="changePage(${currentPage + 1})"
    >
      Next
    </button>
  `;

  pagination.innerHTML = html;
}

// ===============================
// CHANGE PAGE
// ===============================

function changePage(page) {

  currentPage = page;

  renderTable();

  // scroll top smoothly
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ===============================
// AUTO REFRESH EVERY 10 SECONDS
// ===============================

setInterval(() => {
  loadChatbot();
}, 10000);

// ===============================
// INITIAL LOAD
// ===============================

loadChatbot();
