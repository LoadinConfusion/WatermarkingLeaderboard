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
    renderScatterplot(tabId, data); // Call to render the scatterplot
}

function renderScatterplot(tabId, data) {
    const scatterplotContainer = document.getElementById(`${tabId}-scatterplot`);
    scatterplotContainer.innerHTML = ""; // Clear existing plot

    const svg = d3.select(scatterplotContainer)
        .append("svg")
        .attr("width", 400)
        .attr("height", 400);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.score)])
        .range([0, 400]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.score2)])
        .range([400, 0]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.score))
        .attr("cy", d => yScale(d.score2))
        .attr("r", 5)
        .attr("fill", "blue");

    svg.append("g")
        .attr("transform", "translate(0,400)")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));
};

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