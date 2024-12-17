document.addEventListener("DOMContentLoaded", () => {
    const incomeInput = document.getElementById("income");
    const setIncomeButton = document.getElementById("setIncome");
    const incomeDisplay = document.querySelector("#incomeDisplay span");
    const plannedInputs = document.querySelectorAll(".plannedInput");
    const addExpenseButtons = document.querySelectorAll(".addExpense");
    const toggleDropdownButtons = document.querySelectorAll(".toggleDropdown");
    const resetButton = document.getElementById("resetBudget");
    const monthSelect = document.getElementById("monthSelect");
    const logoutButton = document.getElementById("logoutBtn");
    const totalPlanned = document.getElementById("totalPlanned");
    const totalSpent = document.getElementById("totalSpent");
    const remaining = document.getElementById("remaining");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
    }

    const userKey = `budgetData_${loggedInUser.username}`;
    let budgetData = JSON.parse(localStorage.getItem(userKey)) || {};

    function saveData() {
        localStorage.setItem(userKey, JSON.stringify(budgetData));
    }

    function initializeMonthSelector() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().toISOString().slice(0, 7);

        for (let month = 1; month <= 12; month++) {
            const monthValue = `${currentYear}-${month.toString().padStart(2, "0")}`;
            const option = document.createElement("option");
            option.value = monthValue;
            option.textContent = new Date(`${monthValue}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
            monthSelect.appendChild(option);
        }

        monthSelect.value = currentMonth;
        renderDataForMonth(currentMonth);

        monthSelect.addEventListener("change", () => {
            renderDataForMonth(monthSelect.value);
        });
    }

    function renderDataForMonth(month) {
        if (!budgetData[month]) budgetData[month] = { income: 0, planned: {}, expenses: {} };

        const monthData = budgetData[month];
        incomeInput.value = monthData.income || 0;
        incomeDisplay.innerText = monthData.income || 0;

        plannedInputs.forEach(input => {
            const category = input.id.replace("Planned", "");
            input.value = monthData.planned[category] || '';
            renderDropdown(category, monthData.expenses[category] || []);
        });

        renderSummary();
    }

    function renderSummary() {
        const currentMonth = monthSelect.value;
        const monthData = budgetData[currentMonth] || { planned: {}, expenses: {}, income: 0 };

        const plannedTotal = Object.values(monthData.planned || {}).reduce((a, b) => a + b, 0);
        const spentTotal = Object.values(monthData.expenses || {}).flat().reduce((a, b) => a + b, 0);

        totalPlanned.innerText = plannedTotal.toFixed(2);
        totalSpent.innerText = spentTotal.toFixed(2);
        remaining.innerText = (monthData.income - spentTotal).toFixed(2);
    }

    setIncomeButton.addEventListener("click", () => {
        const currentMonth = monthSelect.value;

        if (!budgetData[currentMonth]) budgetData[currentMonth] = { income: 0, planned: {}, expenses: {} };

        budgetData[currentMonth].income = parseFloat(incomeInput.value) || 0;
        incomeDisplay.innerText = budgetData[currentMonth].income;
        saveData();
        renderSummary();
    });

    plannedInputs.forEach(input => {
        input.addEventListener("input", () => {
            const currentMonth = monthSelect.value;

            if (!budgetData[currentMonth]) budgetData[currentMonth] = { income: 0, planned: {}, expenses: {} };

            const category = input.id.replace("Planned", "");
            budgetData[currentMonth].planned[category] = parseFloat(input.value) || 0;
            saveData();
            renderSummary();
        });
    });

    addExpenseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const currentMonth = monthSelect.value;
            const category = button.dataset.category;
            const amount = parseFloat(prompt(`Enter expense for ${category}:`)) || 0;

            if (amount > 0) {
                if (!budgetData[currentMonth].expenses[category]) budgetData[currentMonth].expenses[category] = [];
                budgetData[currentMonth].expenses[category].push(amount);
                renderDropdown(category, budgetData[currentMonth].expenses[category]);
                saveData();
                renderSummary();
            }
        });
    });

    toggleDropdownButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dropdown = button.nextElementSibling.nextElementSibling;
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });
    });

    function renderDropdown(category, expenses) {
        const list = document.getElementById(`${category}List`);
        list.innerHTML = expenses.length > 0
            ? expenses.map((amount, index) => `
                <li>
                    ${amount} NOK
                    <button class="removeExpense" data-category="${category}" data-index="${index}">🗑️</button>
                </li>
            `).join('')
            : `<li>No expenses added yet</li>`;
    }

    document.addEventListener("click", e => {
        if (e.target.classList.contains("removeExpense")) {
            const currentMonth = monthSelect.value;
            const { category, index } = e.target.dataset;
            budgetData[currentMonth].expenses[category].splice(index, 1);
            renderDropdown(category, budgetData[currentMonth].expenses[category]);
            saveData();
            renderSummary();
        }
    });

    resetButton.addEventListener("click", () => {
        const currentMonth = monthSelect.value;
        budgetData[currentMonth] = { income: 0, planned: {}, expenses: {} };
        renderDataForMonth(currentMonth);
        saveData();
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/index.html";
    });

    initializeMonthSelector();
});