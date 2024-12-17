document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        alert("All fields are required!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        alert("Username or email already exists!");
        return;
    }

    const newUser = { id: Date.now(), username, email, password }; // Legg til unik id
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "login.html";
});

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const loginUsername = document.getElementById("loginUsername").value.trim();
    const loginPassword = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === loginUsername && user.password === loginPassword);

    if (user) {
        alert(`Welcome back, ${user.username}!`);
        localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id, username: user.username })); // Lagre unik info
        window.location.href = "/user/dashboard.html";
    } else {
        alert("Invalid username or password!");
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});