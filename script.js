const gridContainer = document.getElementById('gridContainer');
const gridSize = document.getElementById('gridSize');
const mode = document.getElementById('modePicker');

const rainbow = document.getElementById('rainbow');
const eraser = document.getElementById('eraser');
const gridLines = document.getElementById('gridLines');
const resetGrid = document.getElementById('resetGrid');

let canvasCurrentColor = `${gridContainer.style.background}`;
let penCurrentColor = `#333333`;
let currentDimension = +gridSize.textContent.substr(0, 2);

window.onload = () => {
    createGrid(currentDimension);
    mouseOverColor();
}

canvasUpdate();
penUpdate();
mode.addEventListener('click', drawMode);

rainbow.addEventListener('click', rainbowToggle);

eraser.addEventListener(`click`, eraserToggle);
gridLines.addEventListener(`click`, gridLinesToggle);
updateGrid();
resetGrid.addEventListener('click', clearGrid);

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

    if(mode.textContent === 'Hold') mode.textContent = 'Hover';
    drawMode();
}

function deactivate(id) {
    const currentOption = document.getElementById(`${id}`);

    currentOption.classList.remove('active');
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

function randomColor() {
    const randomR = Math.floor(Math.random() * 256)
    const randomG = Math.floor(Math.random() * 256)
    const randomB = Math.floor(Math.random() * 256)
    return `rgb(${randomR}, ${randomG}, ${randomB})`
}

/* ERASER */
function eraserToggle() {
    if(eraser.classList.contains(`active`)) {
        penCurrentColor = penUpdate();
        deactivate("eraser");
    } else {
        activate("eraser");
        penCurrentColor = canvasCurrentColor;
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

        /* Maintain the same mode after new grid since drawMode() will invert it  */
        if(mode.textContent === 'Hover') mode.textContent = 'Hold';
        else mode.textContent = 'Hover';
        drawMode();
    }
}

function createGrid(dimension) {
    gridContainer.style.gridTemplate = `repeat(${dimension}, 1fr) / repeat(${dimension}, 1fr)`;
    
    for(let i = 0; i < dimension * dimension; i++) {
        const gridItems = document.createElement('div');
        gridItems.classList.add('gridItems');
        gridContainer.appendChild(gridItems);
    }
}

function deleteGrid() {
    gridContainer.innerHTML = ``;
}

/* Toogle GRID LINES */
function gridLinesToggle() {
    const gridItems = document.querySelectorAll('.gridItems');

    if(gridLines.classList.contains(`active`)) {
        gridItems.forEach(gridItem => {
            gridItem.style.border = `none`;
        });

        deactivate("gridLines");
    } else {
        gridLinesActive(currentDimension);
        activate("gridLines");
    }
}

function gridLinesActive(dimension) {
    const gridItems = document.querySelectorAll('.gridItems');
    const maxItemsNum = dimension * dimension;

    gridItems.forEach(gridItem => {
        gridItem.style.borderTop = `1px solid black`;
        gridItem.style.borderLeft = `1px solid black`;
    });

    for(let i = dimension - 1; i < maxItemsNum; i += dimension) {
        console.log(i);
        gridItems[i].style.borderRight = `1px solid black`;
    }

    for(let i = maxItemsNum - 1; i >= maxItemsNum - dimension; i--) {
        gridItems[i].style.borderBottom = `1px solid black`;
    }
}

/* RESET */
function clearGrid() {
    const gridItems = document.querySelectorAll('.gridItems');

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
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mouseover", changeColor);
    });
}

function removeMouseOver() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.removeEventListener("mouseover", changeColor);
    });
}

function mouseHoldColor() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mousedown", changeColor);
        gridItem.addEventListener("mouseenter", (e) => {
            if(e.buttons > 0) {
                if(rainbow.classList.contains(`active`))
                    gridItem.style.background = randomColor();
                else gridItem.style.background = penCurrentColor;
            }
        });
    });
}

function removeMouseHold() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.removeEventListener("mousedown", changeColor);
        gridItem.removeEventListener("mouseenter", (e) => {
            if(e.buttons > 0) {
                if(rainbow.classList.contains(`active`))
                    gridItem.style.background = randomColor();
                else gridItem.style.background = penCurrentColor;
            }
        });
    });
}