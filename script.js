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

    // Sort data alphabetically by name to ensure consistent legend order
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

    // Predefined distinct colors
    const predefinedColors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5", "#F5FF33", "#FF8C33"
    ];

    // Generate unique colors for each data point
    const colors = sortedData.map((_, index) => predefinedColors[index % predefinedColors.length] || `hsl(${Math.random() * 360}, 70%, 50%)`);

    // Create scatterplot
    window[`${tabId}Chart`] = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: sortedData.map((entry, index) => ({
                label: entry.name, // Use the software name as the legend label
                data: [{ x: entry.score2, y: entry.score }], // Single data point per dataset
                backgroundColor: colors[index], // Assign unique color
                pointRadius: 6,
                pointHoverRadius: 8
            }))
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: (${context.raw.x}, ${context.raw.y})`; // Show name and coordinates
                        }
                    }
                },
                legend: {
                    display: true, // Show legend
                    labels: {
                        usePointStyle: true, // Use dot style in the legend
                        boxWidth: 10 // Adjust box size for better visibility
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
    // Attach event listeners to tab buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const tabId = button.getAttribute("data-tab");
            switchTab(event, tabId);
        });
    });

    // Initialize the default tab
    populateLeaderboard("attack-free");
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleCheckbox = document.getElementById("theme-toggle");
    const themeLabel = document.getElementById("theme-label");
    const body = document.body;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggleCheckbox.checked = true;
        themeLabel.textContent = "Dark Mode"; // Update label text
    }

    // Add event listener to toggle switch
    themeToggleCheckbox.addEventListener("change", () => {
        if (themeToggleCheckbox.checked) {
            body.classList.add("dark-mode");
            themeLabel.textContent = "Dark Mode"; // Update label text
            localStorage.setItem("theme", "dark"); // Save theme preference
        } else {
            body.classList.remove("dark-mode");
            themeLabel.textContent = "Light Mode"; // Update label text
            localStorage.setItem("theme", "light"); // Save theme preference
        }
    });
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