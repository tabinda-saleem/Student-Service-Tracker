const yearBox = document.getElementById("year");
if (yearBox) {
    yearBox.textContent = new Date().getFullYear();
}
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
if (currentUser) {
    const loginLink = document.querySelector('.navbar a.nav-link[href="login.html"]');
    const startButton = document.querySelector('.navbar a.btn[href="register.html"]');
    loginLink.textContent = "Dashboard";
    loginLink.href = currentUser.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
    startButton.parentElement.remove();
}
const serviceFilters = document.getElementById("serviceFilters");
if (serviceFilters) {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("#serviceGrid > [data-category]");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            const filter = button.dataset.filter;
            buttons.forEach(function(item) {
                item.classList.remove("active");
            });
            button.classList.add("active");
            cards.forEach(function(card) {
                if (filter === "all" || card.dataset.category === filter) {
                    card.classList.remove("d-none");
                } else {
                    card.classList.add("d-none");
                }
            });
        });
    });
}
const serviceTitle = document.getElementById("serviceTitle");
if (serviceTitle) {
    const services = {
        transcript: {
            name: "Transcript Request", icon: "▤", color: "", category: "Academic", department: "Examination Office", time: "3-5 Days",
            tagline: "Request an official record of your academic results.",
            description: "An official transcript is a certified record of your courses, grades and academic standing. Submit your request and follow its status through your student account.",
            documents: ["Copy of your student ID card", "Completed request form and purpose of the transcript", "Fee receipt, if required by the university"],
            eligibility: ["Currently enrolled students", "Graduates with no pending dues"]
        },
        degree: {
            name: "Degree Verification", icon: "✓", color: "purple", category: "Academic", department: "Examination Office", time: "5-7 Days",
            tagline: "Confirm that your degree was awarded by the university.",
            description: "Degree verification confirms to an employer or institution that you were awarded your degree. Staff review the request and issue the verification once it is approved.",
            documents: ["Copy of your degree or provisional certificate", "Copy of a government-issued ID", "Details of the organization requesting verification"],
            eligibility: ["Graduates of the university", "Requests on behalf of authorised institutions"]
        },
        bonafide: {
            name: "Bonafide Certificate", icon: "▣", color: "purple", category: "Certificates", department: "Student Affairs", time: "2-3 Days",
            tagline: "Get proof that you are a genuine student of the university.",
            description: "A bonafide certificate confirms that you are currently a student of the university. It is often needed for scholarships, visas, banks or internships.",
            documents: ["Copy of your student ID card", "Purpose for which the certificate is needed"],
            eligibility: ["Currently enrolled students"]
        },
        certificate: {
            name: "Certificate Request", icon: "✦", color: "teal", category: "Certificates", department: "Examination Office", time: "3-5 Days",
            tagline: "Request a university certificate for your records.",
            description: "Request a university certificate such as a course completion or character certificate. Staff verify your record before the certificate is prepared.",
            documents: ["Copy of your student ID card", "Details of the certificate you need", "Department clearance, if applicable"],
            eligibility: ["Enrolled or graduated students", "No pending dues"]
        },
        idcard: {
            name: "ID Card Request", icon: "◈", color: "teal", category: "Student Affairs", department: "Student Affairs", time: "2-4 Days",
            tagline: "Apply for a new or replacement student ID card.",
            description: "Apply for a new student ID card, or a replacement if your card is lost or damaged. Staff confirm your details before the card is printed.",
            documents: ["Recent passport-size photograph", "Proof of admission or enrollment", "Written application, if the card was lost"],
            eligibility: ["Currently enrolled students"]
        },
        record: {
            name: "Record Update", icon: "⌂", color: "orange", category: "Student Affairs", department: "Student Affairs", time: "3-5 Days",
            tagline: "Ask for help updating your student record information.",
            description: "Ask staff to correct or update personal details in your student record, such as name spelling, contact details or program information.",
            documents: ["Copy of your student ID card", "Document showing the correct information"],
            eligibility: ["Currently enrolled students"]
        }
    };
    let id = new URLSearchParams(window.location.search).get("id");
    if (!services[id]) {
        id = "transcript";
    }
    const service = services[id];
    const words = service.name.split(" ");
    const lastWord = words.pop();
    let documents = "";
    let eligibility = "";
    service.documents.forEach(function(item) {
        documents += "<li>" + item + "</li>";
    });
    service.eligibility.forEach(function(item) {
        eligibility += "<li>" + item + "</li>";
    });
    document.title = service.name + " | Student Service Tracker";
    serviceTitle.innerHTML = words.join(" ") + ' <span class="gradient-text">' + lastWord + ".</span>";
    document.getElementById("serviceTagline").textContent = service.tagline;
    document.getElementById("serviceDescription").textContent = service.description;
    document.getElementById("serviceDocuments").innerHTML = documents;
    document.getElementById("serviceEligibility").innerHTML = eligibility;
    document.getElementById("serviceCategory").textContent = service.category;
    document.getElementById("serviceDepartment").textContent = service.department;
    document.getElementById("serviceTime").textContent = service.time;
    document.getElementById("serviceIcon").textContent = service.icon;
    document.getElementById("serviceIcon").className = "service-icon " + service.color;
    if (currentUser && currentUser.role === "student") {
        document.getElementById("applyButton").href = "apply-service.html?service=" + id;
        document.getElementById("applyHint").textContent = "You are signed in. Start your request now.";
        document.getElementById("registerButton").classList.add("d-none");
    }
}
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const alertBox = document.getElementById("contactAlert");
        alertBox.className = "alert alert-success";
        alertBox.textContent = "Your message has been submitted successfully.";
        contactForm.reset();
    });
}
