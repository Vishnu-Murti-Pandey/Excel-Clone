async function isGraphCylicTracePath(graphComponentMatrix, cycleResponse) {
    let [srcr, srcc] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

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

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (visited[i][j] === false) {
    //             let response = dfsCylicDetection(graphComponentMatrix, i, j, visited, dfsVisited);
    //             if (response === true) {
    //                 return [i, j];
    //             }
    //         }
    //     }
    // }

    let response = await dfsCylicDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited);
    if (response === true) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}

// for delay and wait
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000)
    });
}


// Coloring cells for tracking
async function dfsCylicDetectionTracePath(graphComponentMatrix, i, j, visited, dfsVisited) {
    visited[i][j] = true;
    dfsVisited[i][j] = true;

    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); // code flow is paused for 1000 sec, for color showing

    for (let children = 0; children < graphComponentMatrix[i][j].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[i][j][children];
        if (visited[nbrr][nbrc] === false) {
            let response = await dfsCylicDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);

            cyclicCell.style.backgroundColor = "lightsalmon"  // cycle is detected here
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent"

            cell.style.backgroundColor = "transparent"  // remove the color from cell where cycle started (A1 -> D1+10) => remove color from D1
            await colorPromise();
            return Promise.resolve(true);
        }
    }
    dfsVisited[i][j] = false;
    return Promise.resolve(false);
}