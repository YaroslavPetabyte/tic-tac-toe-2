// advanced game:
// https://www.codebrainer.com/blog/tic-tac-toe-javascript-game

const PLAYER_X_CLASS = 'x'
const PLAYER_O_CLASS = 'circle'
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const arrAcumX = [];
const arrAcumO = [];
let switcher = 1;

const cellElements = document.querySelectorAll('[data-cell]')
const boardElement = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.getElementById('winningMessageText')
const turnQueue = document.getElementById('X-or-O');
let isPlayer_O_Turn = false

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
	arrAcumX.length = 0;
	arrAcumO.length = 0;
	isPlayer_O_Turn = false
	cellElements.forEach(cell => {
		cell.style.backgroundColor = '';
		cell.classList.remove(PLAYER_X_CLASS)
		cell.classList.remove(PLAYER_O_CLASS)
		cell.removeEventListener('click', handleCellClick)
		cell.addEventListener('click', handleCellClick, {once: true})
		switcher = 1;
	})
	setBoardHoverClass()
	winningMessageElement.classList.remove('show')
}


function handleCellClick(e) {
	const cell = e.target
	const currentClass = isPlayer_O_Turn ? PLAYER_O_CLASS : PLAYER_X_CLASS
    turnQueue.textContent = isPlayer_O_Turn ? 'X': 'O'

	placeMark(cell, currentClass)
	if (checkWin(currentClass)) {
		endGame(false)
        turnQueue.textContent = 'X'
	} else if (isDraw()) {
		endGame(true)
	} else {
		swapTurns()
		setBoardHoverClass()
	}

	checkingSequenceOfMoves()
	trackerNumberPressedCell()
}

let dobleEvent1 = false;
let dobleEvent2 = false;


function checkingSequenceOfMoves() {
	const arrCellElement = Array.from(cellElements);
	if(arrAcumX.length < 2) return
	if(arrAcumO.length < 2) return

	if(switcher === 4) {
		// console.log("Умова", 4)
		switcher = 1
		processPlayersMove(arrCellElement, arrAcumO, 'circle')
		return false
	}

	if(switcher === 3) {
		// console.log("Умова", 3)
		switcher++
		processPlayersMove(arrCellElement, arrAcumX, 'x')
		return false
	}


	if(switcher === 2) {
		// console.log("Умова", 2)
		switcher++
		paintingBackgroundElement(arrCellElement, arrAcumO)
		dobleEvent2 = true;
		return false
	}

	if(switcher === 1) {

		// console.log("Умова", 1)
		switcher++
		paintingBackgroundElement(arrCellElement, arrAcumX)
		dobleEvent1 = true;
		return false
	}
}

function processPlayersMove(proccessElement, proccessArr, sign) {
	proccessElement[proccessArr[0]].removeEventListener('click', handleCellClick)
	proccessElement[proccessArr[0]].classList.remove(sign)
	proccessElement[proccessArr[0]].style.backgroundColor = ''
	proccessElement[proccessArr[0]].addEventListener('click', handleCellClick, {once: true})
	proccessArr.shift()
	if (dobleEvent2) {
		paintingBackgroundElement(proccessElement, proccessArr)
		if(sign === 'circle') {
			switcher = 3;
		}
	}
}

function paintingBackgroundElement(proccessElement, proccessArr) {
	proccessElement[proccessArr[0]].style.backgroundColor = '#473464'
}


function endGame(draw) {

    if (draw) {
        winningMessageTextElement.innerText = "It's a draw!"
    } else {
        winningMessageTextElement.innerText = `Player with ${isPlayer_O_Turn ? "0's" : "X's"} wins!`
    }
    winningMessageElement.classList.add('show')

}

function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS)
	})
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass)
}

function swapTurns() {
	isPlayer_O_Turn = !isPlayer_O_Turn
}

function setBoardHoverClass() {
	boardElement.classList.remove(PLAYER_X_CLASS)
	boardElement.classList.remove(PLAYER_O_CLASS)
	if (isPlayer_O_Turn) {
		boardElement.classList.add(PLAYER_O_CLASS)
	} else {
		boardElement.classList.add(PLAYER_X_CLASS)
	}
}

function checkWin(currentClass) {
	return WINNING_COMBINATIONS.some(combination => { // метод .some повертая true, якщо хочаб один елемент відповідає умові callback функції
		return combination.every(index => {           // метод .every повертая true, якщо всі елементи відповідають умові callback функції
			return cellElements[index].classList.contains(currentClass)
		})
	})
}

function trackerNumberPressedCell() {

	let numPush = Array.from(cellElements).findIndex((a, i) => {
		return (a.classList.contains(PLAYER_X_CLASS) || a.classList.contains(PLAYER_O_CLASS)) && !arrAcumX.includes(i) && !arrAcumO.includes(i)
	});

	if(numPush === -1) return
	if(!isPlayer_O_Turn) {
		arrAcumO.push(numPush)
	} else if(isPlayer_O_Turn) {
		arrAcumX.push(numPush)
	}
	// console.log(` ${[...arrAcumO]} - O \n`, `${[...arrAcumX]} - X`)
}
