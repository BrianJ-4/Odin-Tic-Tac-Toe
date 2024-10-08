// Board object holds Cell objects in a 2D array
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

    return {
        getBoard,
        selectCell
    };
}

// Cell object represents a cell on a Tic Tac Toe grid and holds the value
// of the player that selected it
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

// Player object represents a player and has a number that is used to mark
// cells
function Player(number)
{
    const playerNumber = number;

    const getPlayerNumber = () => {
        return playerNumber;
    }

    return {getPlayerNumber};
}

//GameController object controls the flow of the game
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
            if (checkRow(i))
                return gameBoard[i][0].getCellValue();
            if (checkColumn(i))
                return gameBoard[0][i].getCellValue();
        }
        
        if (checkLeftToRightDiagonal())
            return gameBoard[0][0].getCellValue();
        if (checkRightToLeftDiagonal())
            return gameBoard[0][2].getCellValue();
        
        return 0;        
    }

    const checkForTie = () => {
        const gameBoard = board.getBoard();

        const notEmpty = gameBoard.every(row => row.every(cell => cell.getCellValue() != 0));
        if(checkForWin() == 0 && notEmpty)
            return true;
        return false;
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
        checkForWin,
        resetGame,
        checkForTie
    };
}

// UiController object handles the game displayed to the user as well as
// user inputs
const UiController = (function ()
{
    const game = GameController();

    const gameGrid = document.querySelector("#game-grid");
    const playerOneIndicator = document.getElementById("player-one-indicator");
    const playerTwoIndicator = document.getElementById("player-two-indicator");
    const summary = document.getElementById("game-summary");
    const winnerDisplay = document.getElementById("winner-display");
    
    const resetButton = document.getElementById("play-again-button");
    resetButton.addEventListener("click", (event) => {
        game.resetGame();
        summary.close();
        updateGameBoard();
        playerOneIndicator.setAttribute("visible", "true");
        playerTwoIndicator.setAttribute("visible", "false");
    })

    playerOneIndicator.setAttribute("visible", "true");
    playerTwoIndicator.setAttribute("visible", "false");

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

                    gameCell.addEventListener('mouseover', () => {                        
                        if(!gameCell.hasChildNodes())
                        {
                            const hoverIcon = getIcon(game.getActivePlayer().getPlayerNumber());
                            hoverIcon.setAttribute("type", "hover");
                            gameCell.appendChild(hoverIcon);
                        }                            
                    });

                    gameCell.addEventListener('mouseout', () => {                        
                        gameCell.removeChild(gameCell.firstChild);
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
        if(game.getActivePlayer().getPlayerNumber() == 1)
        {
            playerOneIndicator.setAttribute("visible", "true");
            playerTwoIndicator.setAttribute("visible", "false");
            
        }
        else if(game.getActivePlayer().getPlayerNumber() == 2)
        {
            playerTwoIndicator.setAttribute("visible", "true");
            playerOneIndicator.setAttribute("visible", "false");    
        }
            
        updateGameBoard();
        
        const tie = game.checkForTie();
        
        if(tie)
        {
            summary.showModal();
            winnerDisplay.innerText = "Tie!";
        }
        
        const result = game.checkForWin();    
        if(result != 0)
        {   
            summary.showModal();
            winnerDisplay.innerText = "Player " + result + " Wins!";
        }
    }

    const getIcon = (cellValue) => {
        const icon = document.createElement("i");
        if(cellValue == 1)
        {
            icon.className = "fa-solid fa-xmark";
            icon.setAttribute("icon", "playerOne");                
        }
        else if(cellValue == 2)
        {
            icon.className = "fa-regular fa-circle";
            icon.setAttribute("icon", "playerTwo");                   
        }
        return icon;
    }

    updateGameBoard();
})();