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
    if (tabId === "attack-free") {
        // High y-axis (score) and high x-axis (score2) are good
        data.sort((a, b) => b.score - a.score || b.score2 - a.score2);
    } else {
        // High y-axis (score) and low x-axis (score2) are good
        data.sort((a, b) => b.score - a.score || a.score2 - b.score2);
    }

    data.forEach((entry, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.score2}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    renderScatterplot(tabId, data); // Call to render the scatterplot
}

function renderScatterplot(tabId, data) {
    const ctx = document.getElementById(`scatter-${tabId}`).getContext("2d");

    // Destroy existing chart instance if it exists
    if (window[`${tabId}Chart`]) {
        window[`${tabId}Chart`].destroy();
    }

    const colors = data.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`)

    // Create scatterplot
    window[`${tabId}Chart`] = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: `${tabId} Scatterplot`,
                data: data.map(entry => ({ x: entry.score2, y: entry.score, label: entry.name })),
                backgroundColor: colors,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw.label; // Show software name on hover
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Normalized Utility"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Detectability"
                    }
                }
            }
        }
    });
}

// Initialize leaderboards on page load
document.addEventListener("DOMContentLoaded", () => {
    populateLeaderboard("attack-free"); // Default tab
});

// Tab switching functionality
function switchTab(event, tabId) {
    // Hide all tab content (including headers)
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none"; 
    });

    // Remove active class from all buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    // Show only the selected tab
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.classList.add("active");

    // Populate leaderboard for the selected tab
    populateLeaderboard(tabId);
}