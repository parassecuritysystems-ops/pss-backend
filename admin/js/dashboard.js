
document.addEventListener("DOMContentLoaded", async () => {

  const API_BASE = "https://api.parassecurity.in"; // change if deployed

  let contacts = [];
  let quotes = [];
  let chatbot = [];

  // =============================
  // FETCH FROM BACKEND
  // =============================

  
async function fetchData() {

  const API = "https://api.parassecurity.in/api/admin";
  const token = localStorage.getItem("token");

  try {

    const [cRes, qRes, bRes] = await Promise.all([
      fetch(`${API}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      fetch(`${API}/quotes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      fetch(`${API}/chatbot`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ]);

    const cData = await cRes.json();
    const qData = await qRes.json();
    const bData = await bRes.json();

    console.log("CONTACTS:", cData);
    console.log("QUOTES:", qData);
    console.log("CHATBOT:", bData);

    // IMPORTANT: assign correctly
    contacts = cData.data || [];
    quotes = qData.data || [];
    chatbot = bData.data || [];

    updateDashboard();

  } catch (err) {
    console.error("API ERROR:", err);
  }
}

  // =============================
  // UPDATE KPIs
  // =============================

  function updateKPIs() {
    document.getElementById("contactsCount").innerText = contacts.length;
    document.getElementById("quotesCount").innerText = quotes.length;
    document.getElementById("chatbotCount").innerText = chatbot.length;
  }

  // =============================
  // CHARTS
  // =============================

  let barChart, pieChart;

  function initCharts() {
    barChart = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: ["Contacts", "Quotes", "Chatbot"],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ["#22c55e", "#3b82f6", "#a855f7"]
        }]
      }
    });

    pieChart = new Chart(document.getElementById("pieChart"), {
      type: "doughnut",
      data: {
        labels: ["Contacts", "Quotes", "Chatbot"],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ["#22c55e", "#3b82f6", "#a855f7"]
        }]
      }
    });
  }

  function updateCharts() {
    const values = [contacts.length, quotes.length, chatbot.length];

    barChart.data.datasets[0].data = values;
    pieChart.data.datasets[0].data = values;

    barChart.update();
    pieChart.update();
  }

  // =============================
  // TABLES (REAL DATA DISPLAY)
  // =============================

  function renderTables() {

    const contactsTable = document.getElementById("contactsTable");
    if (contactsTable) {
      contactsTable.innerHTML = contacts.map(c => `
        <tr>
          <td>${c.name || "N/A"}</td>
          <td>${c.email || "N/A"}</td>
        </tr>
      `).join("");
    }

    const quotesTable = document.getElementById("quotesTable");
    if (quotesTable) {
      quotesTable.innerHTML = quotes.map(q => `
        <tr>
          <td>${q.firstName || ""} ${q.lastName || ""}</td>
          <td>${q.systemInterest || "N/A"}</td>
        </tr>
      `).join("");
    }

    const chatbotTable = document.getElementById("chatbotTable");
    if (chatbotTable) {
      chatbotTable.innerHTML = chatbot.map(b => `
        <tr>
          <td>${b.name || "N/A"}</td>
          <td>${b.message || "N/A"}</td>
        </tr>
      `).join("");
    }
  }

  // =============================
  // MASTER UPDATE
  // =============================

  function updateDashboard() {
    updateKPIs();
    updateCharts();
    renderTables();
  }

  // =============================
  // INIT
  // =============================

  initCharts();
  fetchData();

  // optional auto-refresh
  setInterval(fetchData, 10000);

});
