const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const result = await response.json();

  console.log(result);

  if (result.success) {

    localStorage.setItem("token", result.token);

    localStorage.setItem(
      "admin",
      JSON.stringify(result.admin)
    );

    window.location.href = "dashboard.html";

  } else {

    alert(result.message);

  }

});