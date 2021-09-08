const gridContainer = document.getElementById('gridContainer');

createGrid(16);
mouseHoldColor();

function createGrid(dimension) {
    gridContainer.style.gridTemplate = `repeat(${dimension}, 1fr) / repeat(${dimension}, 1fr)`;

    for(let i = 0; i < dimension * dimension; i++) {
        const gridItems = document.createElement('div');
        gridItems.classList.add('gridItems');
        gridItems.style.border = `1px solid black`;
        gridContainer.appendChild(gridItems);
    }
}

function mouseOverColor() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mouseover", changeColor);
    });
}

function mouseHoldColor() {
    const gridItems = document.querySelectorAll('.gridItems');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener("mousedown", changeColor);
        gridItem.addEventListener("mouseenter", (e) => {
            if(e.buttons > 0) gridItem.style.background = `black`;
        });
    });
}

function changeColor() {
    this.style.background = `black`;
}