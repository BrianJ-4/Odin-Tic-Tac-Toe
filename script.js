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

    return getPlayerNumber;
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
        playTurn
    };
}

const UiController = (function ()
{
    const game = GameController();
})();