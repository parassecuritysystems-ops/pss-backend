const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const response = await fetch("https://api.parassecurity.in/api/auth/create-admin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Test Admin",
    email: "test@gmail.com",
    password: "123456"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err));

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
