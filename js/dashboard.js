document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("You are not logged in!");
        window.location.href = "./html/login.html";
    } else {
        document.getElementById("welcomeMessage").innerText = `Welcome, ${loggedInUser.username}!`;
    }

    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "../index.html";
    });
});