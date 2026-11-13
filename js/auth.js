
// ========================================
// STUDENT SERVICE TRACKER - AUTHENTICATION
// ========================================

// Storage helpers
function getUsers() {
    return DemoStorage.get("users");
}

function saveUsers(users) {
    DemoStorage.set("users", users);
}

function findUser(email) {
    return getUsers().find(
        user => user.email === email.toLowerCase()
    );
}

// Create demo accounts if they do not exist
function initializeDemoAccounts() {
    const users = getUsers();

    const demos = [
        {
            name: "Demo Student",
            email: "student@test.com",
            password: "1234",
            role: "student",
            studentId: "24CS001",
            phone: "03001234567",
            department: "Computer System Engineering",
            semester: "4"
        },
        {
            name: "Demo Staff",
            email: "staff@test.com",
            password: "1234",
            role: "staff",
            studentId: "",
            phone: "",
            department: "Examination",
            semester: ""
        },
        {
            name: "Demo Admin",
            email: "admin@test.com",
            password: "1234",
            role: "admin",
            studentId: "",
            phone: "",
            department: "",
            semester: ""
        }
    ];

    demos.forEach(demo => {
        if (!users.some(u => u.email === demo.email)) {
            const nextId = users.reduce(
                (max, u) => Math.max(max, Number(u.id) || 0),
                0
            ) + 1;

            users.push({
                id: nextId,
                ...demo,
                status: "Active"
            });
        }
    });

    saveUsers(users);
}

// Initialize demo accounts
if (typeof DemoStorage !== "undefined") {
    initializeDemoAccounts();
}

// Show messages
function showMessage(elementId, message, type) {
    const box = document.getElementById(elementId);

    if (!box) return;

    box.className = "alert alert-" + type;
    box.textContent = message;
}

// Redirect according to role
function redirectByRole(role) {
    if (role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else if (role === "staff") {
        window.location.href = "staff-dashboard.html";
    } else if (role === "student") {
        window.location.href = "dashboard.html";
    } else {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}

// ========================================
// REGISTRATION
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const role = document.getElementById("registerRole").value;

        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const studentId = document.getElementById("registerStudentId").value.trim().toUpperCase();
        const phone = document.getElementById("registerPhone").value.trim();
        const department = document.getElementById("registerDepartment").value;
        const semester = document.getElementById("registerSemester").value;

        const users = getUsers();

        if (name.length < 2) {
            showMessage("registerMessage", "Please enter your full name.", "danger");
            return;
        }

        if (!["student", "staff", "admin"].includes(role)) {
            showMessage("registerMessage", "Please select a valid role.", "danger");
            return;
        }

        if (findUser(email)) {
            showMessage("registerMessage", "This email is already registered.", "danger");
            return;
        }

        // Student validation only
        if (role === "student") {

            if (studentId.length < 3) {
                showMessage("registerMessage", "Please enter a valid Student ID.", "danger");
                return;
            }

            if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
                showMessage("registerMessage", "Please enter a valid phone number.", "danger");
                return;
            }

            if (!department || !semester) {
                showMessage("registerMessage", "Please select department and semester.", "danger");
                return;
            }

            const duplicate = users.some(
                user => user.role === "student" &&
                user.studentId === studentId
            );

            if (duplicate) {
                showMessage("registerMessage", "This Student ID is already registered.", "danger");
                return;
            }
        }

        if (password.length < 4) {
            showMessage("registerMessage", "Password must contain at least 4 characters.", "danger");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("registerMessage", "Passwords do not match.", "danger");
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role,
            studentId: role === "student" ? studentId : "",
            phone: role === "student" ? phone : "",
            department: role === "student" ? department : "",
            semester: role === "student" ? semester : "",
            status: "Active"
        };

        users.push(newUser);
        saveUsers(users);

        showMessage(
            "registerMessage",
            "Account created successfully! Please login.",
            "success"
        );

        registerForm.reset();

        const roleSelect = document.getElementById("registerRole");

        if (roleSelect) {
            roleSelect.dispatchEvent(new Event("change"));
        }

    });
}

// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const user = findUser(email);

        if (!user || user.password !== password) {
            showMessage(
                "loginMessage",
                "Invalid email or password.",
                "danger"
            );
            return;
        }

        if (user.status === "Inactive") {
            showMessage(
                "loginMessage",
                "Your account is inactive. Contact the administrator.",
                "danger"
            );
            return;
        }

        // Save logged-in user
        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        // Open correct portal
        redirectByRole(user.role);

    });
}

// ========================================
// DASHBOARD AUTHENTICATION
// ========================================

const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
);

const isStudentDashboard = !!document.getElementById("dashboardContent");
const isStaffDashboard = !!document.getElementById("staffDashboardContent");

if (isStudentDashboard || isStaffDashboard) {

    if (!currentUser) {
        window.location.replace("login.html");

    } else if (isStudentDashboard && currentUser.role !== "student") {
        redirectByRole(currentUser.role);

    } else if (isStaffDashboard && currentUser.role !== "staff") {
        redirectByRole(currentUser.role);

    } else {

        const content = document.getElementById(
            isStaffDashboard ? "staffDashboardContent" : "dashboardContent"
        );

        content.hidden = false;

        const welcome = document.getElementById("welcomeName");

        if (welcome) welcome.textContent = currentUser.name;

        const name = document.getElementById("userName");
        const email = document.getElementById("userEmail");
        const role = document.getElementById("userRole");

        if (name) name.textContent = currentUser.name;
        if (email) email.textContent = currentUser.email;
        if (role) role.textContent = currentUser.role;

        const description = document.getElementById("roleDescription");

        if (description) {
            description.textContent =
                "Welcome to your Student Service Tracker portal.";
        }
    }
}

// ========================================
// LOGOUT
// ========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}
