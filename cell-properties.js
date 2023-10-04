//Storage

let collectedSheetDB = [];  // contains all sheet DB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector('.sheet-add-icon');
    addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < cols; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#ecf0f1",
//             value: "",
//             formula: "",
//             children: [],
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

// Selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let addressBarValue = document.querySelector(".address-bar");
let activeColorProp = "#d1d8e0"
let inactiveColorProp = "#ecf0f1"

//Application of two way binding
// Attach property listeners
bold.addEventListener("click", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.bold = !cellProp.bold; //Data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI Change (1)
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //UI Change (2)
});

italic.addEventListener("click", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.italic = !cellProp.italic; //Data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI Change (1)
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //UI Change (2)
});

underline.addEventListener("click", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.underline = !cellProp.underline; //Data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI Change (1)
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //UI Change (2)
});

fontSize.addEventListener("change", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.fontSize = fontSize.value; //Data change   
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener("change", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.fontFamily = fontFamily.value; //Data change   
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.fontColor = fontColor.value; //Data change   
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
});

BGcolor.addEventListener("change", (e) => {
    let address = addressBarValue.value;
    let [cell, cellProp] = activeCell(address);

    // console.log(BGcolor.value);
    cellProp.BGcolor = BGcolor.value; //Data change   
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
});

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBarValue.value;
        let [cell, cellProp] = activeCell(address);

        let alignValue = e.target.classList[0];

        cellProp.alignment = alignValue; //Data change   
        console.log(cellProp);
        cell.style.textAlign = cellProp.alignment; // UI Change(1)

        switch (alignValue) {   // UI Change background color according to selected icon
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {

    cell.addEventListener("click", (e) => {
        let address = addressBarValue.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        //Apply cell properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        // Apply properties UI Prop Container   
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

        let formularBar = document.querySelector(".formula-bar");
        formularBar.value = cellProp.formula;
        cell.innerText = cellProp.value;

    });
}

function activeCell(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    //Access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);

    // Search in DB for the obj
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    // address => A1
    let rowID = Number(address.slice(1)) - 1;
    let colID = Number(address.charCodeAt(0)) - 65;
    return [rowID, colID];
}

console.log({ sheetDB });