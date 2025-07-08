import Player from "./Player.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";
import Amation from "./amation.js"

class Interface {
    constructor() {
        this.game = null;
    }

    registerEvents() {
        this.init();
        let iniciar = document.querySelector("input[type='button']");
        iniciar.onclick = this.init.bind(this);
    }

    init() {
        let color = "pink";
        this.game = new Amation(color === 'pink' ? Player.PLAYER1 : Player.PLAYER2);
        let tab = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < tab[i].length; j++) {
                let td = document.createElement("td");
                td.onclick = this.play.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.changeMessage();
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
     changeMessage() {
        const winner = this.game.endOfGame();

        if (winner !== Winner.NONE) {
            let finalMessage = "Game Over"; 
            if (winner === Winner.PLAYER1) {
                finalMessage = "Pink Wins!";
            }
            if (winner === Winner.PLAYER2) {
                finalMessage = "Blue Wins!";
            }

            this.setMessage(finalMessage);
            return; 
        }

        const turn = this.game.getTurn();
        const turnMessage = (turn === Player.PLAYER1) ? "Pink turn" : "Blue turn";
        this.setMessage(turnMessage);
    }

    changeborder(){
        


    }

    play(evt) {
        let td = evt.target;
        let cell = this.coordinates(td);
        try {
            let mr = this.game.move(cell);
            td.style.backgroundColor = this.game.getTurn() === Player.PLAYER1 ? "#84DCCF" : "#EF626C"; this.changeMessage(mr);
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
}
let gui = new Interface();
gui.registerEvents();
