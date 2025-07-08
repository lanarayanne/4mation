import Player from "./Player.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";

export default class Amation {
    constructor(player) {
        this.turn = player;
        this.rows = 7;
        this.cols = 7;
        this.lastMove = null;
        this.board = [
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],

        ];
    }
    getBoard() {
        return this.board;
    }

    getTurn() {
        return this.turn;
    }

    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.rows) && inLimit(y, this.cols));
    }

    getValidAdjacentMoves() {
        if (!this.lastMove) return [];

        const { x: lastR, y: lastC } = this.lastMove;
        const validMoves = [];
        for (let r_offset = -1; r_offset <= 1; r_offset++) {
            for (let c_offset = -1; c_offset <= 1; c_offset++) {
                if (r_offset === 0 && c_offset === 0) continue;

                const potentialMove = { x: lastR + r_offset, y: lastC + c_offset };

                if (this.onBoard(potentialMove) && this.board[potentialMove.x][potentialMove.y] === CellState.EMPTY) {
                    validMoves.push(potentialMove);
                }
            }
        }
        return validMoves;
    }

    move(cell) {
        let { x: or, y: oc } = cell;

        if (!this.onBoard(cell)) {
            throw new Error("Cell is not on board.");
        }

        if (this.board[or][oc] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }

        if (this.lastMove !== null) {
            const validAdjacentMoves = this.getValidAdjacentMoves();

            if (validAdjacentMoves.length > 0) {
                const isMoveAdjacent = validAdjacentMoves.some(move => move.x === or && move.y === oc);
                if (!isMoveAdjacent) {
                    throw new Error("Move not allowed");
                }
            }
        }

        this.board[or][oc] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.lastMove = cell;
        this.turn = (this.turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;

        const validNextMoves = this.getValidAdjacentMoves();
        const table = document.querySelector("table");

        for (let row of table.rows) {
            for (let td of row.cells) {
                td.style.borderColor = "";
            }
        }

        validNextMoves.forEach(move => {
            const td = table.rows[move.x].cells[move.y];
            if (td) {
                td.style.borderColor = "#F6E8EA";
            }
        });

        return this.endOfGame();
    }



    endOfGame() {
        const R = this.rows;
        const C = this.cols;
        const board = this.board;

        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                const player = board[r][c];

                if (player === CellState.EMPTY) {
                    continue;
                }


                if (c + 3 < C) {
                    if (
                        board[r][c + 1] === player &&
                        board[r][c + 2] === player &&
                        board[r][c + 3] === player
                    ) {
                        return player === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
                    }
                }

                if (r + 3 < R) {
                    if (
                        board[r + 1][c] === player &&
                        board[r + 2][c] === player &&
                        board[r + 3][c] === player
                    ) {
                        return player === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
                    }
                }

                if (r + 3 < R && c + 3 < C) {
                    if (
                        board[r + 1][c + 1] === player &&
                        board[r + 2][c + 2] === player &&
                        board[r + 3][c + 3] === player
                    ) {
                        return player === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
                    }
                }

                if (r - 3 >= 0 && c + 3 < C) {
                    if (
                        board[r - 1][c + 1] === player &&
                        board[r - 2][c + 2] === player &&
                        board[r - 3][c + 3] === player
                    ) {
                        return player === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
                    }
                }
            }
        }

        const emptyCells = board.flat().filter(cell => cell === CellState.EMPTY).length;
        if (emptyCells === 0) {
            return Winner.DRAW;
        }

        return Winner.NONE;
    }
}
