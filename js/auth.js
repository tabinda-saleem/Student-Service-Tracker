
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const role = document.getElementById("registerRole").value;

        const studentId = document.getElementById("registerStudentId").value.trim().toUpperCase();
        const phone = document.getElementById("registerPhone").value.trim();
        const department = document.getElementById("registerDepartment").value;
        const semester = document.getElementById("registerSemester").value;

        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const users = getUsers();

        // Name validation
        if (name.length < 2) {
            showMessage("registerMessage", "Please enter your full name.", "danger");
            return;
        }

        // Role validation
        if (!["student", "staff", "admin"].includes(role)) {
            showMessage("registerMessage", "Please select a valid role.", "danger");
            return;
        }

        // Email validation
        if (findUser(email)) {
            showMessage("registerMessage", "An account with this email already exists.", "danger");
            return;
        }

        // Student-only validation
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
                showMessage("registerMessage", "Please select your department and semester.", "danger");
                return;
            }

            const duplicateStudent = users.some(user =>
                user.role === "student" &&
                user.studentId === studentId
            );

            if (duplicateStudent) {
                showMessage("registerMessage", "This Student ID is already registered.", "danger");
                return;
            }
        }

        // Password validation
        if (password.length < 4) {
            showMessage("registerMessage", "Password must contain at least 4 characters.", "danger");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("registerMessage", "Passwords do not match.", "danger");
            return;
        }

        // Create account
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: role,
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
            "Account created successfully! You can now log in.",
            "success"
        );

        registerForm.reset();

        // Hide student fields after reset
        if (typeof roleSelect !== "undefined") {
            roleSelect.dispatchEvent(new Event("change"));
        }
    });
}
