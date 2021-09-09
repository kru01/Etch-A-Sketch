const gridContainer = document.getElementById('gridContainer');
const mode = document.getElementById('modePicker');
const resetGrid = document.getElementById('resetGrid');

let canvasCurrentColor = `${gridContainer.style.background}`;
let penCurrentColor = `#333333`;

window.onload = () => {
    createGrid(16);
    mouseOverColor();
}

canvasUpdate();
penUpdate();
mode.addEventListener('click', drawMode);
eraserToggle();
updateGrid();
resetGrid.addEventListener('click', clearGrid);

/* Everything on left tool bar #settings */

/* Toggle one of the options above the slider */
function activate(id) {
    const currentOption = document.getElementById(`${id}`);
    const options = document.querySelectorAll(`.options`);

    options.forEach(option => {
        option.classList.remove(`active`);
    });

    currentOption.classList.add(`active`);

    if(mode.textContent === 'Hold') mode.textContent = 'Hover';
    drawMode();
}

function deactivate(id) {
    const currentOption = document.getElementById(`${id}`);

    currentOption.classList.remove('active');
}

/* ERASER */
function eraserToggle() {
    const eraser = document.getElementById('eraser');

    eraser.addEventListener(`click`, () => {
        if(eraser.classList.contains(`active`)) {
            penCurrentColor = penUpdate();
            deactivate("eraser");
        } else {
            activate("eraser");
            penCurrentColor = canvasCurrentColor;
        }
    });
}

/* Change Grid Dimension*/
function updateGrid() {
    const slider = document.getElementById('slider');
    const gridSize = document.getElementById('gridSize');
    
    slider.onchange = (e) => {
        gridSize.textContent = `${e.target.value} x ${e.target.value}`;
        deleteGrid();
        createGrid(e.target.value);

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
        gridItems.style.border = `1px solid black`;
        gridContainer.appendChild(gridItems);
    }
}

function deleteGrid() {
    gridContainer.innerHTML = ``;
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
            if(e.buttons > 0) gridItem.style.background = penCurrentColor;
        });
    });
}

function removeMouseHold() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.removeEventListener("mousedown", changeColor);
        gridItem.removeEventListener("mouseenter", (e) => {
            if(e.buttons > 0) gridItem.style.background = penCurrentColor;
        });
    });
}