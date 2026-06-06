async function sendOTP() {

  const email = document.getElementById("email").value;

  try {

    const response = await fetch("https://api.parassecurity.in/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    // 🔥 GUARANTEED NAVIGATION
    setTimeout(() => {
      window.location.href = "reset-password.html";
    }, 300);

    const data = await response.json();

    console.log("OTP RESPONSE:", data);

    if (!data.success) {
      alert(data.message);
      return;
    }

    // 🔥 DEV ONLY OTP HANDLING
    if (data.otp) {
      alert("Your OTP is: " + data.otp);
    } else {
      alert("OTP generated successfully (check backend logs)");
    }

    // store email for reset page
    localStorage.setItem("resetEmail", email);

  } catch (err) {
    console.error("OTP ERROR:", err);
    alert("Server not reachable");
  }
}
