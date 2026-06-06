// ========================================
// CONTACTS.JS (UPDATED PROFESSIONAL VERSION)
// ========================================

let allContacts = [];
let currentPage = 1;

const rowsPerPage = 10;

// ========================================
// LOAD CONTACTS
// ========================================

async function loadContacts() {

  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (!token || token === "undefined" || token === "null") {

    alert("Please login first");

    window.location.href = "login.html";

    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/admin/contacts",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    console.log("API RESULT:", result);

    if (!result.success) {

      alert(result.message);

      return;
    }

    // ========================================
    // LATEST CONTACTS FIRST
    // ========================================

    allContacts = (result.data || []).reverse();

    renderContacts();

  } catch (error) {

    console.log(error);

    alert("Failed to load contacts");

  }

}

// ========================================
// RENDER CONTACTS
// ========================================

function renderContacts() {

  const table = document.getElementById("contactsTable");

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedContacts = allContacts.slice(start, end);

  let html = "";

  // ========================================
  // NEW RESPONSE SYSTEM
  // ========================================

  let seenContacts =
    JSON.parse(localStorage.getItem("seenContacts")) || [];

  paginatedContacts.forEach((contact, index) => {

    const uniqueId =
      `${contact.name}-${contact.email}-${contact.phone}-${index}`;

    const isNew = !seenContacts.includes(uniqueId);

    html += `
      <tr>

        <td>
          ${contact.name || ""}
          ${isNew ? `<span class="new-badge">NEW</span>` : ""}
        </td>

        <td>${contact.email || ""}</td>

        <td>${contact.phone || ""}</td>

        <td>${contact.service || ""}</td>

        <td>${contact.message || ""}</td>

      </tr>
    `;

    // mark as seen
    if (!seenContacts.includes(uniqueId)) {
      seenContacts.push(uniqueId);
    }

  });

  // save seen contacts
  localStorage.setItem(
    "seenContacts",
    JSON.stringify(seenContacts)
  );

  table.innerHTML = html;

  renderPagination();
}

// ========================================
// PAGINATION
// ========================================

function renderPagination() {

  const pagination =
    document.getElementById("pagination");

  const totalPages =
    Math.ceil(allContacts.length / rowsPerPage);

  let html = "";

  // PREVIOUS BUTTON
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

// ========================================
// CHANGE PAGE
// ========================================

function changePage(page) {

  currentPage = page;

  renderContacts();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ========================================
// AUTO REFRESH
// ========================================

setInterval(() => {
  loadContacts();
}, 10000);

// ========================================
// INITIAL LOAD
// ========================================

loadContacts();