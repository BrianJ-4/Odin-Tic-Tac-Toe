function Board()
{
    const board = [];
    for (let i = 0; i < 3; i++) 
    {
        board[i] = [];
        for (let j = 0; j < 3; j++) 
        {
          board[i].push(Cell());
        }
    }

    const getBoard = () => {
        return board;
    }

    const selectCell = (cell, player) => {
        cell.pickCell(player);
    }

    const printBoard = () => {
        let boardString = "";
        board.forEach(row => {
            let rowString = ""
            row.forEach(column => {
                rowString += String(column.getCellValue());
            });
            boardString += rowString + "\n";
        });
        console.log(boardString);
    }

    return {
        getBoard,
        selectCell,
        printBoard
    };
}

function Cell()
{
    let value = 0;

    const pickCell = (player) => {
        value = player.getPlayerNumber();
    };

    const getCellValue = () => {
        return value;
    }

    return {
        pickCell,
        getCellValue
    };
}

function Player(number)
{
    const playerNumber = number;

    const getPlayerNumber = () => {
        return playerNumber;
    }

    return {getPlayerNumber};
}

function GameController()
{
    const board = Board();

    const playerOne = Player(1);
    const playerTwo = Player(2);

    let activePlayer = playerOne;

    const getActivePlayer = () => {
        return activePlayer;
    }

    const switchActivePlayer = () => {
        activePlayer = activePlayer == playerOne ? playerTwo : playerOne;
    }

    const playTurn = (cell) => {
        board.selectCell(cell, getActivePlayer())
    }

    const checkForWin = () => {
        const gameBoard = board.getBoard();

        const checkRow = (row) => {
            return gameBoard[row][0].getCellValue() != 0 &&
                   gameBoard[row][0].getCellValue() == gameBoard[row][1].getCellValue() &&
                   gameBoard[row][0].getCellValue() == gameBoard[row][2].getCellValue();
        };
        
        const checkColumn = (col) => {
            return gameBoard[0][col].getCellValue() != 0 &&
                   gameBoard[0][col].getCellValue() == gameBoard[1][col].getCellValue() &&
                   gameBoard[0][col].getCellValue() == gameBoard[2][col].getCellValue();
        };
        
        const checkLeftToRightDiagonal = () => {
            return gameBoard[0][0].getCellValue() != 0 &&
                   gameBoard[0][0].getCellValue() == gameBoard[1][1].getCellValue() &&
                   gameBoard[0][0].getCellValue() == gameBoard[2][2].getCellValue();
        };
        
        const checkRightToLeftDiagonal = () => {
            return gameBoard[0][2].getCellValue() != 0 &&
                   gameBoard[0][2].getCellValue() == gameBoard[1][1].getCellValue() &&
                   gameBoard[0][2].getCellValue() == gameBoard[2][0].getCellValue();
        };
        
        for (let i = 0; i < 3; i++)
        {
            if (checkRow(i)) return gameBoard[i][0].getCellValue();
            if (checkColumn(i)) return gameBoard[0][i].getCellValue();
        }
        
        if (checkLeftToRightDiagonal())
            return gameBoard[0][0].getCellValue();
        if (checkRightToLeftDiagonal())
            return gameBoard[0][2].getCellValue();
        
        return 0;        
    }

    const handleWin = (winner) => {
        console.log(`Player ${winner} wins!`);
        
    }
    
    const resetGame = () => {
        const gameBoard = board.getBoard();

        for (let i = 0; i < 3; i++) 
        {
            for (let j = 0; j < 3; j++) 
            {
                gameBoard[i][j] = Cell();
            }
        }
        activePlayer = playerOne;
    }

    return {
        getActivePlayer,
        switchActivePlayer,
        playTurn,
        getBoard: board.getBoard,
        printBoard: board.printBoard,
        checkForWin,
        handleWin,
        resetGame
    };
}

const UiController = (function ()
{
    const game = GameController();

    const gameGrid = document.querySelector("#game-grid");
    const playerOneDisplay = document.getElementById("player-one-display");
    const playerTwoDisplay = document.getElementById("player-two-display");
    const summary = document.getElementById("game-summary");
    
    const resetButton = document.getElementById("play-again-button");
    resetButton.addEventListener("click", (event) => {
        game.resetGame();
        summary.close();
        updateGameBoard();
    })

    const updateGameBoard = () => {
        gameGrid.replaceChildren();
        const gameBoard = game.getBoard();

        gameBoard.forEach(row => {
            row.forEach(cell => {
                const gameCell = document.createElement("div");
                const cellValue = cell.getCellValue();
                gameCell.className = "cell";
                
                if(cellValue == 0)
                {
                    gameCell.addEventListener('click', () => {
                        processMove(cell);
                    });
                }                

                if (cellValue != 0)
                    gameCell.appendChild(getIcon(cellValue));
                gameGrid.appendChild(gameCell);    
            });
        });
    }

    const processMove = (cell) => {
        game.playTurn(cell);
        game.switchActivePlayer();
        
        game.printBoard();
        updateGameBoard();
        
        const result = game.checkForWin();    
        if(result != 0)
        {   
            summary.showModal();
        }
    }

    const getIcon = (cellValue) => {
        const icon = document.createElement("i");
        if(cellValue == 1)
        {
            icon.className = "fa-solid fa-xmark";
            icon.setAttribute("icon", "playerOne")                    
        }
        else if(cellValue == 2)
        {
            icon.className = "fa-regular fa-circle";
            icon.setAttribute("icon", "playerTwo")                    
        }
        return icon;
    }

    updateGameBoard();
})();