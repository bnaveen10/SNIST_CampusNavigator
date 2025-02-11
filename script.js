const nodes = [
    "College Gate", "Pole", "Canteen", "Admin Block", "First Year Block", "Ground", "Stationary", "Library", "CSE Block", "ECE Block", "Drawing Lab", "FSD Lab",
    "Parking", "Comfort Hostel", "Dhruv Hostel", "Joyz Pizza", "Reddy's Hostel", "RTC Bus stop", "Picnic Restaurant", "University Building"
];

const graph = [
    [[12, 30, 2], [1, 20, 1], [13, 200, -2]], // College Gate
    [[9, 20, -2], [3, 10, 1], [2, 10, 2], [0, 20, -1]], // Pole
    [[1, 10, -1], [4, 5, 1]], // Canteen
    [[1, 10, -1], [8, 10, 2], [9, 20, -2], [7, 30, 1]], // Admin Block
    [[5, 10, 1], [8, 5, -2], [2, 5, -1]], // First Year Block
    [[11, 20, 1], [6, 20, -2], [7, 20, -2], [4, 10, 1]], // Ground
    [[5, 20, 2], [7, 10, -1], [10, 10, 1]], // Stationary
    [[6, 10, 1], [9, 10, 2], [19, 10, -2], [3, 30, -1], [5, 20, 2]], // Library
    [[7, 10, -2], [3, 10, -2], [4, 5, 2]], // CSE Block
    [[1, 20, -1], [3, 20, 2], [19, 10, 1]], // ECE Block
    [[6, 10, -1], [11, 15, 2]], // Drawing Lab
    [[10, 15, -2], [5, 20, -1]], // FSD Lab
    [[0, 30, 2]], // Parking
    [[0, 200, 2], [15, 300, -2], [14, 200, 1]], // Comfort Hostel
    [[15, 200, -2], [13, 200, -1], [16, 600, 1]], // Dhruv Hostel
    [[14, 200, 2], [13, 300, 2], [17, 400, 1]], // Joyz Pizza
    [[14, 600, -1], [17, 150, -2]], // Reddy's Hostel
    [[18, 500, 1], [16, 150, 2], [15, 400, -1]], // RTC Bus stop
    [[17, 500, 1]], // Picnic Restaurant
    [[9, 10, -1], [7, 30, 2]] // University Building
];

const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");

// Populate dropdowns with nodes
nodes.forEach((node, index) => {
    sourceSelect.innerHTML += `<option value="${index}">${node}</option>`;
    destinationSelect.innerHTML += `<option value="${index}">${node}</option>`;
});

// Set default values: Source = RTC Bus stop (17), Destination = College Gate (0)
sourceSelect.value = 17;
destinationSelect.value = 0;

// Function to get direction text
function getDirection(directionCode) {
    switch (directionCode) {
        case 1: return "North";
        case -1: return "South";
        case 2: return "East";
        case -2: return "West";
        default: return "";
    }
}

// Dijkstra's algorithm to find the shortest path
function dijkstra(source, destination) {
    const numNodes = graph.length;
    const distance = Array(numNodes).fill(Infinity);
    const visited = Array(numNodes).fill(false);
    const previous = Array(numNodes).fill(-1);

    distance[source] = 0;
    const pq = [[0, source]];

    while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [dist, u] = pq.shift();

        if (visited[u]) continue;
        visited[u] = true;

        if (u === destination) break;

        for (const [v, weight, dir] of graph[u]) {
            if (!visited[v] && distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
                previous[v] = u;
                pq.push([distance[v], v]);
            }
        }
    }

    const path = [];
    const distances = [];
    const directions = [];
    let current = destination;

    while (current !== -1) {
        if (previous[current] !== -1) {
            const edge = graph[previous[current]].find(([v]) => v === current);
            distances.unshift(edge[1]);
            directions.unshift(edge[2]);
        }
        path.unshift(nodes[current]);
        current = previous[current];
    }

    return {
        distance: distance[destination],
        path: path,
        distances: distances,
        directions: directions
    };
}

// Function to find and display the shortest path
function findShortestPath() {
    const source = +sourceSelect.value;
    const destination = +destinationSelect.value;

    if (source === destination) {
        document.getElementById("error").innerHTML = "Source and Destination cannot be the same. Please change the inputs.";
        document.getElementById("result").innerHTML = "";
        return;
    }

    document.getElementById("error").innerHTML = "";

    const result = dijkstra(source, destination);
    let pathDetails = "";

    for (let i = 0; i < result.path.length - 1; i++) {
        pathDetails += `<span>${result.path[i]} (${result.distances[i]}m ${getDirection(result.directions[i])}) → ${result.path[i + 1]} </span>`;
    }

    document.getElementById("result").innerHTML = `
        <strong>Total Distance:</strong> ${result.distance} meters<br>
        <div class="path-details"><strong>Path:</strong><br>${pathDetails}</div>
    `;
}