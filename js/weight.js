document.addEventListener("DOMContentLoaded", () => {
    const weightInput = document.getElementById("weightInput");
    const addWeightBtn = document.getElementById("addWeightBtn");
    const weightHistory = document.getElementById("weightHistory");
    const motivationText = document.getElementById("motivationText");
    const setGoalBtn = document.getElementById("setGoalBtn");
    const currentWeightInput = document.getElementById("currentWeight");
    const goalWeightInput = document.getElementById("goalWeight");
    const startWeightDisplay = document.getElementById("startWeightDisplay");
    const goalWeightDisplay = document.getElementById("goalWeightDisplay");
    const weightLostDisplay = document.getElementById("weightLost");
    const milestonesContainer = document.getElementById("milestones");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
    }

    const userKey = `weightData_${loggedInUser.username}`;
    let weightData = JSON.parse(localStorage.getItem(`${userKey}_weights`)) || [];
    let dates = JSON.parse(localStorage.getItem(`${userKey}_dates`)) || [];
    let startWeight = localStorage.getItem(`${userKey}_startWeight`) 
                      ? parseFloat(localStorage.getItem(`${userKey}_startWeight`)) 
                      : null;
    let goalWeight = localStorage.getItem(`${userKey}_goalWeight`) 
                     ? parseFloat(localStorage.getItem(`${userKey}_goalWeight`)) 
                     : null;

    function saveToLocalStorage() {
        localStorage.setItem(`${userKey}_weights`, JSON.stringify(weightData));
        localStorage.setItem(`${userKey}_dates`, JSON.stringify(dates));
        if (startWeight !== null) localStorage.setItem(`${userKey}_startWeight`, startWeight);
        if (goalWeight !== null) localStorage.setItem(`${userKey}_goalWeight`, goalWeight);
    }

    function initializeNewUser() {
        if (startWeight === null) startWeight = 0;
        if (goalWeight === null) goalWeight = 0;
        saveToLocalStorage();
    }

    function addWeight() {
        const weight = parseFloat(weightInput.value);
        const today = new Date().toLocaleDateString();

        if (!isNaN(weight)) {
            weightData.push(weight);
            dates.push(today);

            saveToLocalStorage();
            updateChart();
            updateHistory();
            updateWeightLost();
            weightInput.value = "";
        } else {
            alert("Please enter a valid weight.");
        }
    }

    function updateChart() {
        weightChart.data.labels = dates;
        weightChart.data.datasets[0].data = weightData;
        weightChart.update();
    }

    function updateHistory() {
        weightHistory.innerHTML = "";
        weightData.forEach((weight, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${dates[i]} - <strong>${weight} kg</strong> 
                <button class="delete-btn" data-index="${i}">🗑️</button>
            `;
            weightHistory.appendChild(li);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                removeWeight(e.target.dataset.index);
            });
        });
    }

    function removeWeight(index) {
        weightData.splice(index, 1);
        dates.splice(index, 1);
        saveToLocalStorage();
        updateChart();
        updateHistory();
        updateWeightLost();
    }

    function updateGoals() {
        const newStartWeight = parseFloat(currentWeightInput.value);
        const newGoalWeight = parseFloat(goalWeightInput.value);

        if (!isNaN(newStartWeight) && !isNaN(newGoalWeight) && newStartWeight > newGoalWeight) {
            startWeight = newStartWeight;
            goalWeight = newGoalWeight;

            startWeightDisplay.textContent = startWeight.toFixed(1);
            goalWeightDisplay.textContent = goalWeight.toFixed(1);
            saveToLocalStorage();
            calculateMilestones();
            updateWeightLost();
        } else {
            alert("Please enter valid start and goal weights. Goal weight must be less than current weight.");
        }
    }

    function calculateMilestones() {
        milestonesContainer.innerHTML = "";
        const step = (startWeight - goalWeight) / 5;
        let milestoneWeight = startWeight;

        for (let i = 1; i <= 5; i++) {
            milestoneWeight -= step;
            const milestone = document.createElement("li");
            milestone.innerHTML = `<span>Milestone ${i}: ${milestoneWeight.toFixed(1)} kg</span>`;
            milestonesContainer.appendChild(milestone);
        }
    }

    function updateWeightLost() {
        const weightLostDisplay = document.getElementById("weightLost");
        const weightLostCircle = document.getElementById("weightLostCircle");
    
        if (weightData.length > 0 && startWeight > 0) {
            const currentWeight = weightData[weightData.length - 1]; // Siste loggede vekt
            const weightLost = Math.max(startWeight - currentWeight, 0); // Beregn vekttap
            weightLostDisplay.textContent = weightLost.toFixed(1); // Oppdater "Weight Lost"
            weightLostCircle.textContent = weightLost.toFixed(1); // Oppdater sirkelen
        } else {
            weightLostDisplay.textContent = "0";
            weightLostCircle.textContent = "0";
        }
    }

    function loadGoalsFromStorage() {
        startWeightDisplay.textContent = startWeight ? startWeight.toFixed(1) : "0";
        goalWeightDisplay.textContent = goalWeight ? goalWeight.toFixed(1) : "0";
        calculateMilestones();
    }

    const chartCanvas = document.getElementById("weightChart").getContext("2d");
    const weightChart = new Chart(chartCanvas, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Weight (kg)",
                data: weightData,
                borderColor: "#0077cc",
                backgroundColor: "rgba(0, 119, 204, 0.1)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false },
                x: { display: true }
            }
        }
    });

    function initialize() {
        initializeNewUser();
        loadGoalsFromStorage();
        updateChart();
        updateHistory();
        updateWeightLost();
        motivationText.textContent = "You're doing great! Keep it up!";
    }

    addWeightBtn.addEventListener("click", addWeight);
    setGoalBtn.addEventListener("click", updateGoals);

    initialize();
});