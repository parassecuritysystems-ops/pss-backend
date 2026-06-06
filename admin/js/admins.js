// ================= LOAD ADMINS =================

async function loadAdmins() {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/admin/admins",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    console.log("ADMINS API:", result);

    if (!result.success) {
      alert(result.message || "Failed to load admins");
      return;
    }

    const data = result.admins || [];

    // ================= SORT LATEST FIRST =================
    data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // ================= KPI COUNTS =================

    const totalAdmins = data.length;


    // ================= SUPER ADMINS =================

    const superAdmins = data.filter(admin => {

      const role = (admin.role || "")
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/_/g, "");

      return role === "superadmin";

    }).length;


    // ================= ACTIVE TODAY =================

    // TEMP DEMO LOGIC
    // All loaded admins considered active

    const activeToday = data.length;


    // ================= UPDATE UI =================

    document.getElementById("totalAdmins").innerText =
      totalAdmins;

    document.getElementById("superAdmins").innerText =
      superAdmins;

    document.getElementById("activeToday").innerText =
      activeToday;

    // ================= TABLE =================

    let html = "";

    if (data.length === 0) {

      html = `
        <tr>
          <td colspan="4"
            style="text-align:center;padding:25px;color:#64748b;">
            No admins found
          </td>
        </tr>
      `;

    } else {

      data.forEach(admin => {

        const role = admin.role || "admin";

        html += `
          <tr>

            <td>
              ${admin.name || ""}
            </td>

            <td>
              ${admin.email || ""}
            </td>

            <td>

              <span style="
                padding:6px 12px;
                border-radius:20px;
                font-size:12px;
                font-weight:600;
                background:
                  ${role.toLowerCase() === "super admin"
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(34,197,94,0.12)"};

                color:
                  ${role.toLowerCase() === "super admin"
                    ? "#ef4444"
                    : "#22c55e"};
              ">
                ${role}
              </span>

            </td>

            <td>
              ${admin.createdAt
                ? new Date(admin.createdAt).toLocaleString()
                : ""}
            </td>

          </tr>
        `;

      });

    }

    document.getElementById("adminsTable").innerHTML = html;

  } catch (err) {

    console.error("LOAD ADMINS ERROR:", err);

    alert("Failed to load admins");

  }

}


// ================= SUPER PASSWORD =================

function checkSuperPassword() {

  const pass = prompt("Enter Super Password:");

  if (!pass) return;

  fetch("http://localhost:5000/api/admin/super-check", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      password: pass
    })

  })

  .then(res => res.json())

  .then(data => {

    if (!data.success) {

      alert("❌ Wrong Super Password");

      return;
    }

    alert("✅ Access Granted");

    loadAdmins();

  })

  .catch(err => {

    console.error("SUPER CHECK ERROR:", err);

    alert("Server Error");

  });

}