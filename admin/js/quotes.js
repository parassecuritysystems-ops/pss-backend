// ================================
// QUOTES.JS (ADVANCED VERSION)
// ================================

let allQuotes = [];
let currentPage = 1;

const rowsPerPage = 7;

// ================================
// LOAD QUOTES
// ================================

async function loadQuotes() {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/admin/quotes",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    console.log("QUOTES API RESULT:", result);

    if (!result.success) {
      alert(result.message || "Failed to load quotes");
      return;
    }

    // ================================
    // SORT LATEST FIRST
    // ================================

    allQuotes = (result.data || []).reverse();

    renderTable();
    renderPagination();

  } catch (error) {

    console.log(error);
    alert("Failed to load quotes");

  }

}

// ================================
// RENDER TABLE
// ================================

function renderTable() {

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedData = allQuotes.slice(start, end);

  let html = "";

  // ================================
  // UNIQUE STORAGE FOR EACH ADMIN
  // ================================

  const adminEmail = localStorage.getItem("adminEmail") || "default_admin";

  let seenQuotes =
    JSON.parse(localStorage.getItem(`seenQuotes_${adminEmail}`))
    || [];

  paginatedData.forEach((q, index) => {

    const uniqueId =
      `${q.email}_${q.phone}_${q.timestamp}_${index}`;

    // ================================
    // NEW BADGE LOGIC
    // ================================

    const isNew = !seenQuotes.includes(uniqueId);

    if (isNew) {
      seenQuotes.push(uniqueId);
    }

    html += `
      <tr>

        <td>
          ${q.timestamp || ""}
          ${isNew ? `<span class="new-badge">NEW</span>` : ""}
        </td>

        <td>
          ${q.firstName || ""} ${q.lastName || ""}
        </td>

        <td>${q.email || ""}</td>

        <td>${q.phone || ""}</td>

        <td>${q.homeBusiness || ""}</td>

        <td>${q.industry || ""}</td>

        <td>${q.size || ""}</td>

        <td>${q.ownerTenant || ""}</td>

        <td>${q.systemInterest || ""}</td>

      </tr>
    `;
  });

  // ================================
  // SAVE VIEWED ITEMS
  // ================================

  localStorage.setItem(
    `seenQuotes_${adminEmail}`,
    JSON.stringify(seenQuotes)
  );

  document.getElementById("quotesTable").innerHTML = html;

}

// ================================
// PAGINATION
// ================================

function renderPagination() {

  const totalPages =
    Math.ceil(allQuotes.length / rowsPerPage);

  let buttons = "";

  // ================================
  // PREVIOUS BUTTON
  // ================================

  buttons += `
    <button
      class="page-btn"
      ${currentPage === 1 ? "disabled" : ""}
      onclick="changePage(${currentPage - 1})"
    >
      Prev
    </button>
  `;

  // ================================
  // PAGE NUMBERS
  // ================================

  for (let i = 1; i <= totalPages; i++) {

    buttons += `
      <button
        class="page-btn ${i === currentPage ? "active-page" : ""}"
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }

  // ================================
  // NEXT BUTTON
  // ================================

  buttons += `
    <button
      class="page-btn"
      ${currentPage === totalPages ? "disabled" : ""}
      onclick="changePage(${currentPage + 1})"
    >
      Next
    </button>
  `;

  document.getElementById("pagination").innerHTML = buttons;

}

// ================================
// CHANGE PAGE
// ================================

function changePage(page) {

  const totalPages =
    Math.ceil(allQuotes.length / rowsPerPage);

  if (page < 1 || page > totalPages) {
    return;
  }

  currentPage = page;

  renderTable();
  renderPagination();

}

// ================================
// INITIAL LOAD
// ================================

loadQuotes();