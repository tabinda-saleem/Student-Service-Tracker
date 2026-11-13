function showToast(message, type = "success") {
  const holder = document.getElementById("toastHolder");
  if (!holder) { alert(message); return; }
  holder.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">${escapeHTML(message)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getModal(id) { return bootstrap.Modal.getOrCreateInstance(document.getElementById(id)); }
const loggedInUser = JSON.parse(localStorage.getItem("currentUser") || "null");
if (!loggedInUser || loggedInUser.role !== "admin") {
  window.location.replace("login.html");
} else {
  document.body.hidden = false;
  document.getElementById("adminName").textContent = loggedInUser.name;
  document.getElementById("adminAvatar").textContent = loggedInUser.name.charAt(0).toUpperCase();
  document.getElementById("logoutLink").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
