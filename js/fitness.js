document.addEventListener("DOMContentLoaded", () => {
    const logActivityBtn = document.getElementById("logActivityBtn");
    const activityType = document.getElementById("activityType");
    const activityDuration = document.getElementById("activityDuration");
    const caloriesBurned = document.getElementById("caloriesBurned");
    const activityDetails = document.getElementById("activityDetails");
    const activityDate = document.getElementById("activityDate");
    const searchActivity = document.getElementById("searchActivity");
    const activityList = document.getElementById("activityList");
    const logoutButton = document.getElementById("logoutBtn");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Du er ikke innlogget. Omdirigerer til innloggingssiden.");
        window.location.href = "/html/login.html";
        return;
    }

    const userKey = `fitnessData_${loggedInUser.username}_${loggedInUser.id}`;
    let fitnessData = JSON.parse(localStorage.getItem(userKey)) || [];

    activityType.addEventListener("change", () => {
        const selected = activityType.value;
        activityDetails.innerHTML = selected === "Løping" ? 
            '<input type="number" id="distance" placeholder="Kilometer løpt">' : 
            selected === "Sykling" ? 
            '<input type="number" id="distance" placeholder="Distanse syklet (km)">' : 
            selected === "Styrke" ? 
            '<input type="text" id="setsReps" placeholder="Antall sett/repetisjoner">' : "";
    });

    function logActivity() {
        const type = activityType.value;
        const duration = parseInt(activityDuration.value) || 0;
        const calories = parseInt(caloriesBurned.value) || 0;
        const date = activityDate.value || new Date().toLocaleDateString();
        const distance = document.getElementById("distance")?.value || '';
        const setsReps = document.getElementById("setsReps")?.value || '';

        if (!type || duration <= 0 || calories <= 0) {
            alert("Fyll inn alle feltene med gyldige verdier!");
            return;
        }

        fitnessData.push({ type, duration, calories, distance, setsReps, date });
        localStorage.setItem(userKey, JSON.stringify(fitnessData));
        clearForm();
        displayActivities();
    }

    function displayActivities() {
        const searchText = searchActivity.value.toLowerCase();

        const filteredActivities = fitnessData.filter(activity =>
            activity.type.toLowerCase().includes(searchText)
        );

        activityList.innerHTML = filteredActivities.length === 0
            ? '<p>Ingen aktiviteter funnet.</p>'
            : filteredActivities.map((entry, index) => `
                <div class="entry">
                    <h3>${entry.type}</h3>
                    <p>Varighet: ${entry.duration} min | Kalorier: ${entry.calories}</p>
                    ${entry.distance ? `<p>Distanse: ${entry.distance} km</p>` : ""}
                    ${entry.setsReps ? `<p>Sett/Reps: ${entry.setsReps}</p>` : ""}
                    <small>Dato: ${entry.date}</small>
                    <button onclick="deleteActivity(${index})">🗑 Slett</button>
                </div>
            `).join('');
    }

    function deleteActivity(index) {
        fitnessData.splice(index, 1);
        localStorage.setItem(userKey, JSON.stringify(fitnessData));
        displayActivities();
    }

    function clearForm() {
        activityType.value = "";
        activityDuration.value = "";
        caloriesBurned.value = "";
        activityDate.value = "";
        activityDetails.innerHTML = "";
    }

    logActivityBtn.addEventListener("click", logActivity);
    searchActivity.addEventListener("input", displayActivities);

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/index.html";
    });

    window.deleteActivity = deleteActivity;

    displayActivities();
});