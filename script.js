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

    board.printBoard();

    return {
        getActivePlayer,
        switchActivePlayer,
        playTurn,
        getBoard: board.getBoard,
        printBoard: board.printBoard
    };
}

const UiController = (function ()
{
    const game = GameController();

    const gameGrid = document.querySelector("#game-grid");
    const playerOneDisplay = document.getElementById("player-one-display");
    const playerTwoDisplay = document.getElementById("player-two-display");

    const updateGameBoard = () => {
        gameGrid.replaceChildren();

        const activePlayer = game.getActivePlayer();
        const gameBoard = game.getBoard();

        gameBoard.forEach(row => {
            row.forEach(cell => {
                const gameCell = document.createElement("div");
                gameCell.setAttribute("owner", cell.getCellValue());
                gameCell.addEventListener('click', () => {
                    if(cell.getCellValue() == 0)
                    {
                        game.playTurn(cell);
                        game.switchActivePlayer();
                        updateGameBoard();
                        game.printBoard();
                    }
                });
                gameCell.innerText = "asd"
                gameGrid.appendChild(gameCell);    
            });
        });
    }
    updateGameBoard();
})();