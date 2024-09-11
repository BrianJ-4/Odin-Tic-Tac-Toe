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

function Cell()
{
    let value = 0;

    const pickCell = (player) => {
        value = player;
    };

    const getCellValue = () => {
        return value;
    }

    return {
        pickCell,
        getCellValue
    };
}

function GameController()