document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const prevDayBtn = document.getElementById("prevDay");
    const nextDayBtn = document.getElementById("nextDay");
    const mealInput = document.getElementById("meal");
    const calorieInput = document.getElementById("calories");
    const addMealBtn = document.getElementById("addMeal");
    const mealList = document.getElementById("mealList");
    const totalCaloriesDisplay = document.getElementById("totalCalories");
    const calorieGoalInput = document.getElementById("calorieGoal");
    const setGoalBtn = document.getElementById("setGoalBtn");
    const calorieGoalDisplay = document.getElementById("calorieGoalDisplay");
    const progressBar = document.getElementById("progress-bar");
    const mealCountDisplay = document.getElementById("mealCount");
    const avgCaloriesDisplay = document.getElementById("avgCalories");
    const clearMealsBtn = document.getElementById("clearMeals");
    const filterMealsBtn = document.getElementById("filterMeals");
    const logoutButton = document.getElementById("logoutBtn");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You are not logged in!");
        window.location.href = "/index.html";
        return;
    }

    const userKey = `calorieData_${loggedInUser.username}`;
    let dailyData = JSON.parse(localStorage.getItem(userKey)) || {};
    let selectedDay = new Date();

    function formatDate(date) {
        return date.toISOString().split("T")[0];
    }

    function displayDate() {
        carousel.textContent = selectedDay.toDateString();
    }

    function loadDayData() {
        const dayKey = formatDate(selectedDay);
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = { meals: [], totalCalories: 0, goal: 2000 };
        }

        const dayData = dailyData[dayKey];
        renderMeals(dayData.meals);
        totalCaloriesDisplay.textContent = dayData.totalCalories;
        calorieGoalDisplay.textContent = dayData.goal;
        updateSummary();
    }

    function saveDayData() {
        localStorage.setItem(userKey, JSON.stringify(dailyData));
    }

    function renderMeals(meals) {
        mealList.innerHTML = meals.map((meal, index) =>
            `<li>${meal.name} - ${meal.calories} kcal 
                <button class="remove-btn" data-index="${index}">✖</button>
            </li>`
        ).join("");
        attachRemoveHandlers();
    }

    function attachRemoveHandlers() {
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const dayKey = formatDate(selectedDay);
                const index = e.target.dataset.index;
                const dayData = dailyData[dayKey];
                dayData.totalCalories -= dayData.meals[index].calories;
                dayData.meals.splice(index, 1);
                saveDayData();
                loadDayData();
            });
        });
    }

    function updateProgressBar() {
        const dayKey = formatDate(selectedDay);
        const dayData = dailyData[dayKey];
        const progress = (dayData.totalCalories / dayData.goal) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    function updateSummary() {
        const dayKey = formatDate(selectedDay);
        const dayData = dailyData[dayKey];
        const totalMeals = dayData.meals.length;
        const avgCalories = totalMeals > 0 ? (dayData.totalCalories / totalMeals).toFixed(2) : 0;

        mealCountDisplay.textContent = totalMeals;
        avgCaloriesDisplay.textContent = avgCalories;
        updateProgressBar();
    }

    addMealBtn.addEventListener("click", () => {
        const meal = mealInput.value.trim();
        const calories = parseInt(calorieInput.value.trim(), 10);

        if (meal && calories > 0) {
            const dayKey = formatDate(selectedDay);
            dailyData[dayKey].meals.push({ name: meal, calories });
            dailyData[dayKey].totalCalories += calories;

            saveDayData();
            loadDayData();

            mealInput.value = "";
            calorieInput.value = "";
        }
    });

    setGoalBtn.addEventListener("click", () => {
        const goal = parseInt(calorieGoalInput.value, 10);
        if (goal > 0) {
            const dayKey = formatDate(selectedDay);
            dailyData[dayKey].goal = goal;
            saveDayData();
            loadDayData();
        }
    });

    clearMealsBtn.addEventListener("click", () => {
        const dayKey = formatDate(selectedDay);
        dailyData[dayKey].meals = [];
        dailyData[dayKey].totalCalories = 0;
        saveDayData();
        loadDayData();
    });

    filterMealsBtn.addEventListener("click", () => {
        const dayKey = formatDate(selectedDay);
        const filteredMeals = dailyData[dayKey].meals.filter(meal => meal.calories > 500);
        alert(`High-Calorie Meals (> 500 kcal):\n${filteredMeals.map(meal => `${meal.name} - ${meal.calories} kcal`).join("\n") || "None"}`);
    });

    prevDayBtn.addEventListener("click", () => {
        selectedDay.setDate(selectedDay.getDate() - 1);
        displayDate();
        loadDayData();
    });

    nextDayBtn.addEventListener("click", () => {
        selectedDay.setDate(selectedDay.getDate() + 1);
        displayDate();
        loadDayData();
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/index.html";
    });

    displayDate();
    loadDayData();
});