// Storage
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        // Why Array -> More than 1 child relation
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

// True -> Cylic, False -> Non-cylic
function isGraphCylic(graphComponentMatrix) {
    // Dependency -> visited, dfsvisited (2d array)
    let visited = [];    // Node visit trace
    let dfsVisited = []; // Stack visit trace

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                let response = dfsCylicDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (response === true) {
                    // found cycle so return true, no need to explore more path
                    return true;
                }
            }
        }
    }
    // found cycle so return false
    return false;
}

// Start -> visited(true), then dfsVisited(true)
// End -> dfsVisited(false)
// if (visited[i][j] == true && dfsVisited[i][j] == true)
// Cycle Detection condition -> if(vis[i][j] == true && dfsVisited[i][j] == true) -> cycle
// Return -> True Or False
function dfsCylicDetection(graphComponentMatrix, i, j, visited, dfsVisited) {
    //Start
    visited[i][j] = true;
    dfsVisited[i][j] = true;

    // A1 -> [ [0, 1], [1, 0], [5, 10]... ]
    for (let children = 0; children < graphComponentMatrix[i][j].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[i][j][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCylicDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {
                // found cycle so return, no need to explore more path
                return true;
            }
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            // found cycle so return, no need to explore more path
            return true;
        }
    }
    // End
    dfsVisited[i][j] = false;
    return false;
}



