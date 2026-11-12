
if (!localStorage.getItem("campusUser")) {
  alert("Please log in first!");
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").onclick = function () {
  localStorage.removeItem("campusUser");
  alert("You have logged out successfully.");
  window.location.href = "login.html";
};
