(function() {
    const modeSelector = document.querySelector('[data-modeSelector]')
    const levelSelector = document.querySelector('[data-levelSelector]')
    const modesAvailable = ['1 VS 1', '1 VS AI']
    var currentMode = 0
    const levelsAvailable = ['Easy', 'Hard']
    var gameStarted = false
    var currentLevel = 1
    const gameBoard = document.querySelector('[data-gameBoard]')
    const cells = document.querySelectorAll('[data-cell]')
    var currentMark
    const winingCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    const endMessageScreen = document.querySelector('[data-endMessageScreen]')
    const endMessageSlot = document.querySelector('[data-endMessageSlot]')
    const restartButton = document.querySelector('[btn-restart]')
    var boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    initialize()

    function initialize() {
        boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        gameStarted = false;
        endMessageScreen.classList.remove('show')
        cells.forEach(cell => {
            cell.classList.remove('cross');
            cell.classList.remove('circle');
        })
        gameBoard.classList.remove('circle')
        gameBoard.classList.remove('cross')
        var rand = Math.floor((Math.random() * 10));
        currentMark = rand % 2 == 0 ? 'cross' : 'circle'
        gameBoard.classList.add(currentMark)
        if (currentMode == 1 && currentMark == 'circle')
            computerTurn()
    }

    modeSelector.addEventListener('click', () => {

        if ((!gameStarted) || (gameStarted && alertMessage('Game already started! are you sure you want to change mode? (game will restart)'))) {
            if (currentMode == 0) {
                currentMode = 1
                levelSelector.style.opacity = '100%'
            } else {
                currentMode = 0
                levelSelector.style.opacity = '0%'
            }
            modeSelector.innerText = modesAvailable[currentMode]
            initialize()
        }
    })

    levelSelector.addEventListener('click', () => {
        if (levelSelector.style.opacity == '0') return
        if ((!gameStarted) || (gameStarted && alertMessage('Game already started! are you sure you want to change level? (game will restart)'))) {
            currentLevel == 1 ? currentLevel = 0 : currentLevel += 1;
            levelSelector.innerText = levelsAvailable[currentLevel]
            initialize()
        }
    })

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (cell.classList.length == 1) {
                gameStarted = true;
                cell.classList.add(currentMark)
                boardArray[index] = currentMark
                if (checkWin(boardArray, currentMark))
                    activateEndMessage(`${currentMark} wins!`)
                else if (checkDraw())
                    activateEndMessage('Draw!')
                else {
                    swapTurn()
                    if (currentMode == 1 && currentMark == 'circle')
                        computerTurn()
                }
            }
        })
    })

    restartButton.addEventListener('click', () => {
        initialize()
    })

    function activateEndMessage(message) {
        endMessageSlot.innerText = message
        endMessageScreen.classList.add('show')
    }

    function checkWin(boardToCheck, mark) {
        return winingCombinations.some(combination => {
            return combination.every(cell => {
                return boardToCheck[cell] == mark //cells[cell].classList.contains(currentMark)
            })
        })
    }

    function checkDraw() {
        return boardArray.every(cell => {
            return cell != 0
        })
    }

    function swapTurn() {
        gameBoard.classList.remove(currentMark)
        currentMark = currentMark == 'cross' ? 'circle' : 'cross';
        gameBoard.classList.add(currentMark)
    }

    function computerTurn() {
        if (levelsAvailable[currentLevel] == 'Easy')
            easyAi()
        else
            hardAi()
    }

    function easyAi() {
        var rand = Math.floor((Math.random() * 9));
        while (cells[rand].classList.contains('circle') || cells[rand].classList.contains('cross')) {
            rand = Math.floor((Math.random() * 9));
        }
        cells[rand].click()
    }

    function hardAi() {
        let bestScore = -Infinity
        let bestMove = -Infinity
        let score

        for (let i = 0; i < 9; i += 1) {
            if (boardArray[i] == 0) {
                boardArray[i] = currentMark;
                score = minimax(boardArray, 0, false)
                boardArray[i] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        cells[bestMove].click()
    }

    function minimax(board, depth, isMaximizing) {
        let score
        if (checkWin(board, 'cross')) {
            return -1;
        } else if (checkWin(board, 'circle')) {
            return 1;
        } else if (checkDraw(board))
            return 0;
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == 0) {
                    board[i] = 'circle';
                    let score = minimax(board, depth + 1, false)
                    board[i] = 0;
                    if (score > bestScore)
                        bestScore = score
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == 0) {
                    board[i] = 'cross';
                    score = minimax(board, depth + 1, true)
                    board[i] = 0;
                    if (score < bestScore)
                        bestScore = score
                }
            }
            return bestScore;
        }
    }

    function alertMessage(message) {
        return window.confirm(message)
    }
})()