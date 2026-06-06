async function createAccount() {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const response = await fetch("https://api.parassecurity.in/api/auth/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      window.location.href = "login.html";
    }

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}
