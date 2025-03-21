const leaderboardData = {
    "attack-free": [
        { name: "Software A", score: 95, score2: 35 },
        { name: "Software B", score: 89, score2: 33 },
        { name: "Software C", score: 78, score2: 45 },
        { name: "Software D", score: 92, score2: 62 }
    ],
    "attack-1": [
        { name: "Software A", score: 85, score2: 30 },
        { name: "Software C", score: 80, score2: 50 },
        { name: "Software B", score: 75, score2: 40 },
        { name: "Software D", score: 70, score2: 55 }
    ],
    "attack-2": [
        { name: "Software C", score: 90, score2: 33 },
        { name: "Software A", score: 88, score2: 36 },
        { name: "Software B", score: 80, score2: 30 },
        { name: "Software D", score: 72, score2: 60 }
    ]
};

// Function to populate leaderboards
function populateLeaderboard(tabId) {
    const tableBody = document.getElementById(`${tabId}-body`);
    tableBody.innerHTML = ""; // Clear existing rows

    const data = leaderboardData[tabId];
    data.sort((a, b) => b.score - a.score); // Sort descending

    data.forEach((entry, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.score2}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Initialize leaderboards on page load
document.addEventListener("DOMContentLoaded", () => {
    populateLeaderboard("attack-free"); // Default tab
});

// Tab switching functionality
function switchTab(event, tabId) {
    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(tab => tab.classList.remove("active"));

    // Show selected tab
    document.getElementById(tabId).classList.add("active");
    event.currentTarget.classList.add("active");

    // Populate leaderboard for the selected tab
    populateLeaderboard(tabId);
}