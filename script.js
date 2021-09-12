const gridContainer = document.getElementById('gridContainer');
const gridSize = document.getElementById('gridSize');
const mode = document.getElementById('modePicker');

// These will be defined in createGrid()
let gridItems; // gridItems = document.querySelectorAll(`.gridItems`);
let gridArray, gridMatrix; // gridArray = Array.from(gridItems), gridMatrix = arrToMatrix(gridArray, currentDimension);

const rainbow = document.getElementById('rainbow');
const fill = document.getElementById('fill');

const eraser = document.getElementById('eraser');
const darken = document.getElementById('darken');

const gridLines = document.getElementById('gridLines');
const resetGrid = document.getElementById('resetGrid');

let canvasCurrentColor = `${gridContainer.style.background}`;
let penCurrentColor = `#333333`;
let currentDimension = +gridSize.textContent.substr(0, 2);

window.onload = () => {
    createGrid(currentDimension);
    mouseOverColor();
}

starter();

function starter() {
    canvasUpdate();
    penUpdate();
    mode.addEventListener('click', drawMode);
    
    rainbow.addEventListener('click', rainbowToggle);
    fill.addEventListener('click', fillMode);
    
    eraser.addEventListener(`click`, eraserToggle);
    gridLines.addEventListener(`click`, gridLinesToggle);
    updateGrid();
    resetGrid.addEventListener('click', clearGrid);
}

/* Everything on left tool bar #settings */

/* Toggle one of the options above the slider */
function activate(id) {
    const currentOption = document.getElementById(`${id}`);
    const options = document.querySelectorAll(`.options`);

    if(id !== 'gridLines') {
        options.forEach(option => {
            option.classList.remove(`active`);
        });
    } 

    currentOption.classList.add(`active`);
    removeFillOnClick(); // remove click Event of fillMode to avoid duplicating events

    if(mode.textContent === 'Hold') mode.textContent = 'Hover';
    drawMode();
}

function deactivate(id) {
    const currentOption = document.getElementById(`${id}`);

    currentOption.classList.remove('active');

    if(id === `fill`) {
        if(mode.textContent === 'Hold') mode.textContent = 'Hover';
        drawMode();
    }
}

/* RAINBOW */
function rainbowToggle() {
    if(rainbow.classList.contains(`active`)) {
        penCurrentColor = `${penUpdate()}`;
        deactivate("rainbow");
    } else {
        activate("rainbow");
        penCurrentColor = randomColor();
    }
} 
// for rainbow on mouseHold mode to work, randomColor() is also called in mouseHoldColor() and removeMouseHold()
function randomColor() {
    // const randomH = Math.floor(Math.random() * 360); 
    // const randomS = Math.floor(Math.random() * 100);
    // const randomL = Math.floor(Math.random() * 100);
    
    // return `hsl(${randomH}, ${randomS}%, ${randomL}%)`;

    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    return `rgb(${randomR}, ${randomG}, ${randomB})`;
}

/* FILL MODE */
function fillMode() {
    if(fill.classList.contains(`active`)) {
        penCurrentColor = `${penUpdate()}`;
        removeFillOnClick();
        deactivate("fill");
    } else {
        const options = document.querySelectorAll(`.options`);

        if(eraser.classList.contains(`active`)) {
            penCurrentColor = `${penUpdate()}`;
        }

        options.forEach(option => {
            option.classList.remove(`active`);
        });

        fill.classList.add(`active`);
        fillActive();
    }
}

function fillActive() {
    removeMouseHold();
    removeMouseOver();

    let itemClickedIndex;
    let seedColor;
    const gridItems = document.querySelectorAll(`.gridItems`);

    gridItems.forEach(gridItem => {
        gridItem.addEventListener('click', fillOnClickEvent);
    });
}

function removeFillOnClick() {
    gridItems.forEach(gridItem => {
        gridItem.removeEventListener('click', fillOnClickEvent);
    });
}

function fillOnClickEvent(e) {
    itemClickedIndex = gridArray.indexOf(e.target);
    seedColor = e.target.style.background;

    let matrixRow = Math.floor(itemClickedIndex / currentDimension);
    let matrixCol = itemClickedIndex % currentDimension;

    floodFill(matrixRow, matrixCol, seedColor);
}

// const waitForSeconds = (secs) => {
//     return new Promise(resolve => {
//         setTimeout(resolve, secs * 1000);
//     });
// }

const floodFill = (row, col, seedColor) => {
    const fillColor = penCurrentColor;
    const nodes = [{row, col}];
    let loopNum = 0;

    while(nodes.length > 0) {
        const {row: r, col: c} = nodes.pop();

        if(r < 0 || r > gridMatrix.length - 1) continue;

        if(c < 0 || c > gridMatrix[r].length - 1) continue;
        
        const node = gridMatrix[r][c];

        if(node.style.background === fillColor) continue;
        if(node.style.background !== seedColor) continue;

        // The reason why these two lines of code exist is because my dumb brain can't figure out
        loopNum++;  // how to stop the loop when the whole canvas is filled with one color and then filled with that same color again
        if(loopNum === currentDimension * currentDimension + 10) break;

        node.style.background = fillColor;

        // await waitForSeconds(0.1);

        nodes.push({row: r + 1, col: c});
        nodes.push({row: r - 1, col: c});
        nodes.push({row: r, col: c - 1});
        nodes.push({row: r, col: c + 1});
    }
}

function arrToMatrix(arr, elementsPerSubArray) {
    const matrix = [];
    let rows = -1;

    for(let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
        if (arrIndex % elementsPerSubArray === 0) {
            rows++;
            matrix[rows] = [];
        }

        matrix[rows].push(arr[arrIndex]);
    }

    return matrix;
}

/* ERASER */
function eraserToggle() {
    if(eraser.classList.contains(`active`)) {
        penCurrentColor = `${penUpdate()}`;
        deactivate("eraser");
    } else {
        activate("eraser");
        penCurrentColor = canvasCurrentColor;
    }
}

/* DARKEN */
function darkenToggle() {
    if(darken.classList.contains(`active`)) {
        penCurrentColor = `${penUpdate()}`;
        deactivate("darken");
    } else {
        activate("darken");
    }
}

/* Change Grid Dimension*/
function updateGrid() {
    const slider = document.getElementById('slider');
    
    slider.onchange = (e) => {
        gridSize.textContent = `${e.target.value} x ${e.target.value}`;
        currentDimension = +e.target.value;
        
        if(gridLines.classList.contains('active')) {
            deleteGrid();
            createGrid(e.target.value);
            gridLinesActive(currentDimension);
        } else {
            deleteGrid();
            createGrid(e.target.value);
        }

        if(fill.classList.contains(`active`)) {
            gridItems.forEach(gridItem => {
                gridItem.addEventListener('click', fillOnClickEvent);
            });
        }

        /* Maintain the same mode after new grid since drawMode() will invert it  */
        if(mode.textContent === 'Hover') mode.textContent = 'Hold';
        else mode.textContent = 'Hover';
        drawMode();
    }
}

function createGrid(dimension) {
    gridContainer.style.gridTemplate = `repeat(${dimension}, 1fr) / repeat(${dimension}, 1fr)`;
    
    for(let i = 0; i < dimension * dimension; i++) {
        const itemsInit = document.createElement('div');
        itemsInit.classList.add('gridItems');
        gridContainer.appendChild(itemsInit);
        gridItems = document.querySelectorAll(`.gridItems`);
        gridArray = Array.from(gridItems);
        gridMatrix = arrToMatrix(gridArray, currentDimension);
    }
}

function deleteGrid() {
    gridContainer.innerHTML = ``;
}

/* Toogle GRID LINES */
function gridLinesToggle() {
    if(gridLines.classList.contains(`active`)) {
        gridItems.forEach(gridItem => {
            gridItem.style.border = `none`;
        });

        deactivate("gridLines");
    } else {
        gridLinesActive(currentDimension);
        
        if(fill.classList.contains(`active`)) {
            gridLines.classList.add(`active`);
        } else {
            activate("gridLines");
        }
    }
}

function gridLinesActive(dimension) {
    const maxItemsNum = dimension * dimension;

    gridItems.forEach(gridItem => {
        gridItem.style.borderTop = `1px solid black`;
        gridItem.style.borderLeft = `1px solid black`;
    });

    for(let i = dimension - 1; i < maxItemsNum; i += dimension) {
        gridItems[i].style.borderRight = `1px solid black`;
    }

    for(let i = maxItemsNum - 1; i >= maxItemsNum - dimension; i--) {
        gridItems[i].style.borderBottom = `1px solid black`;
    }
}

/* RESET */
function clearGrid() {
    gridItems.forEach(gridItem => {
        gridItem.style.background = canvasCurrentColor;
    });
}

/* Everything above the canvas #drawingSection */
function canvasUpdate() {
    const canvasPicker = document.getElementById('forCanvas');

    canvasPicker.onchange = (e) => {
        gridContainer.style.background = `${e.target.value}`;
    }
}

function penUpdate() {
    const penPicker = document.getElementById('forPen');

    penPicker.onchange = (e) => penCurrentColor = `${e.target.value}`;

    return penPicker.value;
}

function changeColor() {
    this.style.background = penCurrentColor;

    if(rainbow.classList.contains(`active`)) {
        this.style.background = randomColor();
    }
}

/* DRAWING MODE */
function drawMode() {
    if(fill.classList.contains(`active`)) return;
    
    if(mode.textContent === 'Hover') {
        mode.textContent = 'Hold';
        removeMouseOver();
        mouseHoldColor();
    } else {
        mode.textContent = 'Hover';
        removeMouseHold();
        mouseOverColor();
    }
}

function mouseOverColor() {
    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mouseover", changeColor);
    });
}

function removeMouseOver() {
    gridItems.forEach(gridItem => {
        gridItem.removeEventListener("mouseover", changeColor);
    });
}

function mouseHoldColor() {
    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mousedown", changeColor);
        gridItem.addEventListener("mouseenter", mouseEnterEvent);
    });
}

function removeMouseHold() {
    gridItems.forEach(gridItem => {
        gridItem.removeEventListener("mousedown", changeColor);
        gridItem.removeEventListener("mouseenter", mouseEnterEvent);
    });
}

function mouseEnterEvent(e) {
    if(e.buttons > 0) {
        if(rainbow.classList.contains(`active`))
            e.target.style.background = randomColor();
        else e.target.style.background = penCurrentColor;
    }
}