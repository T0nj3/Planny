document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveEntryBtn");
    const noteTitle = document.getElementById("noteTitle");
    const noteText = document.getElementById("noteText");
    const noteCategory = document.getElementById("noteCategory");
    const noteDate = document.getElementById("noteDate");
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const entryList = document.getElementById("entryList");
    const logoutButton = document.getElementById("logoutBtn");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Du er ikke innlogget. Omdirigerer til innloggingssiden.");
        window.location.href = "/html/login.html";
        return;
    }

   
    const userKey = `diaryEntries_${loggedInUser.username}_${loggedInUser.id}`;
    let diaryEntries = JSON.parse(localStorage.getItem(userKey)) || [];

    function saveEntry() {
        const title = noteTitle.value.trim();
        const text = noteText.value.trim();
        const category = noteCategory.value;
        const date = noteDate.value || new Date().toLocaleDateString();

        if (!title || !text) {
            alert("Både tittel og tekst må fylles ut!");
            return;
        }

        diaryEntries.push({ title, text, category, date });
        localStorage.setItem(userKey, JSON.stringify(diaryEntries));
        clearForm();
        displayEntries();
    }

    function displayEntries() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value;

        const filteredEntries = diaryEntries.filter(entry => {
            const matchesText = entry.text.toLowerCase().includes(searchText) || 
                                entry.title.toLowerCase().includes(searchText);
            const matchesCategory = selectedCategory === "Alle" || entry.category === selectedCategory;
            return matchesText && matchesCategory;
        });

        entryList.innerHTML = filteredEntries.length === 0 
            ? '<p>Ingen notater funnet.</p>'
            : filteredEntries.map((entry, index) => `
                <div class="entry">
                    <h3>${entry.title}</h3>
                    <p>${entry.text}</p>
                    <small>Kategori: ${entry.category} | Dato: ${entry.date}</small>
                    <button onclick="deleteEntry(${index})">🗑 Slett</button>
                </div>
            `).join('');
    }

    function deleteEntry(index) {
        diaryEntries.splice(index, 1);
        localStorage.setItem(userKey, JSON.stringify(diaryEntries));
        displayEntries();
    }

    function clearForm() {
        noteTitle.value = "";
        noteText.value = "";
        noteDate.value = "";
        noteCategory.value = "Personlig";
    }

    searchInput.addEventListener("input", displayEntries);
    filterCategory.addEventListener("change", displayEntries);
    saveButton.addEventListener("click", saveEntry);

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/index.html";
    });

    window.deleteEntry = deleteEntry;

    displayEntries();
});