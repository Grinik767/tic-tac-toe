const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let dim = 0;

function createMatrix() {
    let result = [];

    for (let i = 0; i < dim; i++) {
        result.push([]);
        for (let j = 0; j < dim; j++) {
            result[i].push(EMPTY);
        }
    }

    return result;
}

function askForDimension(){
    let result = Number(prompt("Введите размер поля:"));
    if (isNaN(result) || result < 3){
        result = askForDimension();
    }

    return result;
}


const container = document.getElementById('fieldWrapper');

let data = null;

startGame();
addResetListener();

function startGame() {
    dim = askForDimension();
    data = createMatrix();
    renderGrid(dim);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

let cur = CROSS;
let countMoves = 0;
let isHaveWinner = false;

function cellClickHandler(row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (data[row][col] !== EMPTY || isHaveWinner) {
        return;
    }

    data[row][col] = cur;
    renderSymbolInCell(cur, row, col);
    countMoves++;

    if (cur === CROSS) {
        cur = ZERO;
    } else {
        cur = CROSS;
    }

    let winner = getWinner(row, col);
    if (countMoves === (data.length * data.length) && winner === null) {
        alert("Победила дружба");
    } else if (winner != null) {
        alert(`Победил ${winner.winner}`);
        colorCells(winner.combination, winner.winner)
        isHaveWinner = true;
    }

}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    isHaveWinner = false;
    countMoves = 0;
    cur = CROSS;
    startGame();
}

function getWinner() {
    for (let i = 0; i < dim; i++) {
        if (data[i][0] !== EMPTY && data[i].every(cell => cell === data[i][0])) {
            return {winner: data[i][0], combination: Array.from({length: dim}, (_, j) => [i, j])};
        }
        if (data[0][i] !== EMPTY && data.every(row => row[i] === data[0][i])) {
            return {winner: data[0][i], combination: Array.from({length: dim}, (_, j) => [j, i])};
        }
    }

    if (data[0][0] !== EMPTY && data.every((row, index) => row[index] === data[0][0])) {
        return {winner: data[0][0], combination: Array.from({length: dim}, (_, i) => [i, i])};
    }
    if (data[0][dim - 1] !== EMPTY && data.every((row, index) => row[dim - 1 - index] === data[0][dim - 1])) {
        return {winner: data[0][dim - 1], combination: Array.from({length: dim}, (_, i) => [i, dim - 1 - i])};
    }

    return null;
}


function colorCells(cells, symbol){
    for (const cell of cells){
        renderSymbolInCell(symbol, cell[0], cell[1], 'red')
    }
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
