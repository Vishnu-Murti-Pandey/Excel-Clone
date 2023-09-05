// Performing blur operation and extracting the data of particular cell and passing its value to cellProp Obj
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBarValue.value;
            let [activeCellProp, cellProp] = activeCell(address);
            let enteredData = activeCellProp.innerText;

            if (enteredData === cellProp.value) {
                return;
            }
            // If data is modified by using keyboard then formula is of no use thus break - 

            removeChildFromParent(cellProp.formula); //  P-C relationship
            cellProp.value = enteredData; // update childrens with the modified value
            cellProp.formula = "";  // empty the formula key in objectx
            updateChildernCells(address); // update the child accordingly
        });
    }
}

// work on formula bar 
let formularBar = document.querySelector(".formula-bar");
formularBar.addEventListener("keydown", (e) => {
    let inputFormula = formularBar.value;
    if (e.key === "Enter" && inputFormula) {
        // check if formula has been changed or not
        console.log({ inputFormula });
        let address = addressBarValue.value;
        let [cell, cellProp] = activeCell(address);
        if (cellProp.formula !== inputFormula) {
            removeChildFromParent(cellProp.formula); // give this old formula so that it can remove it.
        }

        addChildToGraphComponent(inputFormula, address);

        //Check is formula is cyclic or not then only evaluate
        let isCylic = isGraphCylic(graphComponentMatrix);
        if (isCylic === true) {
            alert("Your formula is Cylic");
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        // To update cell UI And Obj(cell prop) in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        console.log({ sheetDB });
        updateChildernCells(address);
    }
});

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let char = encodedFormula[i].charCodeAt(0);
        if (char >= 65 && char <= 90) { // check if formula contains characters if yes then decode them
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            // prid -> i, pcid -> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let char = encodedFormula[i].charCodeAt(0);
        if (char >= 65 && char <= 90) { // check if formula contains characters if yes then decode them
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            // prid -> i, pcid -> j
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

// if one cell has changed its formula, then its child (whereever that cell adsress is used) should also get updated accordingly
function updateChildernCells(parentAddress) {
    let [parentCell, parentCellProp] = activeCell(parentAddress);
    let children = parentCellProp.children;

    //base case if child address lenght is 0
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = activeCell(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        // recursive call
        updateChildernCells(childAddress);
    }
}

// add child to parent for bacause some block have inter linked dependecies
function addChildToParent(formula) {
    let childAddress = addressBarValue.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let char = encodedFormula[i].charCodeAt(0);
        if (char >= 65 && char <= 90) { // check if formula contains characters if yes then decode them
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

// if we change formula from formula bar, then need to remove old child from its parent
function removeChildFromParent(formula) {
    let childAddress = addressBarValue.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let char = encodedFormula[i].charCodeAt(0);
        if (char >= 65 && char <= 90) { // check if formula contains characters if yes then decode them
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            let index = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(index, 1);
        }
    }
}


// Evaluate the formula using the expression passed
function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let char = encodedFormula[i].charCodeAt(0);
        if (char >= 65 && char <= 90) { // check if formula contains characters if yes then decode them
            let [cell, cellProp] = activeCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}


/* Set evaluated value to UI And Store value and formula in Database so that when ever click on that perticular 
cell we can get the exact value and formula for that cell*/
function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = activeCell(address);

    // UI Update
    cell.innerText = evaluatedValue;

    // Update the obj (DB update)
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;

}




