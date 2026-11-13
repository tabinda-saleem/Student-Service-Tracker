const demoUsers = [
    { id: 1, name: "Ayma Azhar", email: "student@test.com", password: "1234", role: "student", studentId: "24CS111", phone: "+00 000 0000000", department: "Computer System Engineering", semester: "6", status: "Active" },
    { id: 2, name: "Arthur Vance", email: "staff@test.com", password: "1234", role: "staff", department: "Examination", status: "Active" },
    { id: 3, name: "Admin User", email: "admin@test.com", password: "1234", role: "admin", department: "Administration", status: "Active" }
];
const homePages = { student: "dashboard.html", staff: "dashboard.html", admin: "admin-dashboard.html" };
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function getUsers() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (!localStorage.getItem("usersSeeded")) {
        demoUsers.forEach(function(demo) {
            const exists = users.some(function(user) {
                return user.email === demo.email;
            });
            if (!exists) {
                users.push(demo);
            }
        });
        saveUsers(users);
        localStorage.setItem("usersSeeded", "yes");
    }
    return users;
}
function findUser(email) {
    const users = getUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return users[i];
        }
    }
    return null;
}
function showMessage(id, message, type) {
    const box = document.getElementById(id);
    box.className = "alert alert-" + type;
    box.textContent = message;
}
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const user = findUser(email);
        if (!user || user.password !== password) {
            showMessage("loginMessage", "Invalid email or password.", "danger");
            return;
        }
        if (user.status === "Inactive") {
            showMessage("loginMessage", "This account is inactive. Contact the administrator.", "danger");
            return;
        }
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId || "",
            phone: user.phone || "",
            department: user.department || "",
            semester: user.semester || ""
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.location.href = homePages[user.role] || "dashboard.html";
    });
}
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const studentId = document.getElementById("registerStudentId").value.trim().toUpperCase();
        const phone = document.getElementById("registerPhone").value.trim();
        const department = document.getElementById("registerDepartment").value;
        const semester = document.getElementById("registerSemester").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const users = getUsers();
        if (name.length < 2) {
            showMessage("registerMessage", "Please enter your full name.", "danger");
            return;
        }
        if (studentId.length < 3) {
            showMessage("registerMessage", "Please enter a valid Student ID.", "danger");
            return;
        }
        if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
            showMessage("registerMessage", "Please enter a valid phone number.", "danger");
            return;
        }
        if (password.length < 4) {
            showMessage("registerMessage", "Password must contain at least 4 characters.", "danger");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("registerMessage", "Passwords do not match.", "danger");
            return;
        }
        if (findUser(email)) {
            showMessage("registerMessage", "An account with this email already exists.", "danger");
            return;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].studentId === studentId) {
                showMessage("registerMessage", "An account with this Student ID already exists.", "danger");
                return;
            }
        }
        users.push({
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: "student",
            studentId: studentId,
            phone: phone,
            department: department,
            semester: semester,
            status: "Active"
        });
        saveUsers(users);
        showMessage("registerMessage", "Account created. You can now log in.", "success");
        registerForm.reset();
    });
}
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    forgotForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("resetEmail").value.trim().toLowerCase();
        const otp = document.getElementById("resetOtp").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;
        const users = getUsers();
        let found = false;
        if (otp !== "123456") {
            showMessage("resetMessage", "Incorrect demo OTP. Enter 123456.", "danger");
            return;
        }
        if (newPassword.length < 4) {
            showMessage("resetMessage", "Password must contain at least 4 characters.", "danger");
            return;
        }
        if (newPassword !== confirmPassword) {
            showMessage("resetMessage", "Passwords do not match.", "danger");
            return;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                users[i].password = newPassword;
                found = true;
            }
        }
        if (!found) {
            showMessage("resetMessage", "No account was found with this email.", "danger");
            return;
        }
        saveUsers(users);
        showMessage("resetMessage", "Password reset successfully. You can now log in.", "success");
        forgotForm.reset();
    });
}
const dashboardContent = document.getElementById("dashboardContent");
if (dashboardContent) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
        window.location.replace("login.html");
    } else {
        const roleText = {
            student: "Student: you can explore services and track requests.",
            staff: "Staff: you can review and process assigned requests.",
            admin: "Admin: you can manage the service portal."
        };
        dashboardContent.hidden = false;
        document.getElementById("welcomeName").textContent = currentUser.name;
        document.getElementById("userName").textContent = currentUser.name;
        document.getElementById("userEmail").textContent = currentUser.email;
        document.getElementById("userRole").textContent = currentUser.role;
        document.getElementById("roleDescription").textContent = roleText[currentUser.role] || "Welcome to the portal.";
    }
}
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}
