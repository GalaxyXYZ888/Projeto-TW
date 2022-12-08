document.getElementById("createbutton").onclick = function () {
	var cols = document.getElementById("cols").value;
	var rows = document.getElementById("rows").value;
	var dif = document.getElementById("dificuldadeButton").value;
	console.log("dif: " + dif);
	let difficulty = 0;
	if (dif == "pl") {
		difficulty = 1;
	} else {
		difficulty = 2;
	}
	var start = document.getElementById("whoStartsButton").value;
	let startP = false;
	if (start == "pl") {
		startP = true;
	} else {
		startP = false;
	}

	console.log("Rows:" + rows + " Cols:" + cols);

	var boardCont = document.getElementById("boardContainer");
	if (boardCont.hasChildNodes()) {
		boardCont.firstChild.remove();
	}

	var b = document.createElement("div");
	
	b.setAttribute("id", "board");
	boardCont.appendChild(b);

	if (cols > 10) {
		cols = 10;
	} if (rows > 10) {
		rows = 10;
	}

	let t = new Table(rows, cols, difficulty, startP);
	console.log("Table: Rows:" + t.rows + " Cols:" + t.columns);
	t.buildTable();
}

document.getElementById("quit").onclick = function () {
	var bCont = document.getElementById("boardContainer");
	if (bCont.hasChildNodes()) {
		bCont.firstChild.remove();
	}

}

class Table {
	constructor(rows, columns, dif, firstPlayer) {
		this.posAI = 0;
		this.rows = rows;
		this.firstPlayer = firstPlayer;
		this.columns = columns;
		this.state = new Array(this.rows * this.columns);
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.state[i * this.rows + j] = true;
			}
		}
		this.board = new Array(this.columns);
		for (let i = 0; i < this.columns; i++) {
			this.board[i] = new Array(4);
		}
		this.dif = dif;
	}

	buildTable() {
		const parent = document.getElementById("board");
		const br = document.createElement("br");
		parent.append(br);
		var length = 2 * this.rows;
		for (let i = 0; i < this.columns; i++) {
			console.log(length);
			const col = document.createElement("div");
			const tab = document.createTextNode("\t");
			parent.append(col);
			parent.append(tab);
			col.setAttribute("style", "width: 2em; height: " + length + "em; border: 2px solid black; float: left; margin-right: 1em; margin-left: 1em;");
			for (let j = 0; j < this.rows; j++) {
				var circle = document.createElement("div");
				circle.setAttribute("id", this.rows * i + j);
				circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid black; border-radius: 50%; margin: 0 auto; background-color: green;");
				col.append(circle);
				circle.onclick = () => this.play(i * this.rows + j);
			}
		}
		for (let i = 0; i < this.columns; i++) {
			this.decompose(i, this.rows);
		}
		if (!this.firstPlayer) {
			this.bestChoice();
			this.nextPlay(this.posAI);
		}
	}

	nextPlay(pos) {
		let pick = 0;
		if (this.dif == 1) {
			let i = this.rows * this.columns;
			let counter = 0;
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					counter = counter + 1;
				}
			}
			let choice = new Array(counter);
			let w = 0;
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					choice[w] = k;
					w++;
				}
			}
			let j = Math.floor(Math.random() * counter);
			pick = choice[j];
		}
		if (this.dif == 2) {
			pick = pos;
		}

		var circle = document.getElementById(pick);
		this.state[pick] = false;
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
		while (pick % this.rows != 0 && pick >= 0) {
			pick = pick - 1;
			circle = document.getElementById(pick);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pick] = false;
		}

		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a * this.rows + b]) {
					isFinished = false;
				}
			}
		}
		if (isFinished) this.endGame(false);
	}

	play(pos) {
		console.log(pos);
		var circle = document.getElementById(pos);
		this.state[pos] = false;
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
		while (pos % this.rows != 0 && pos >= 0) {
			pos = pos - 1;
			circle = document.getElementById(pos);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pos] = false;
		}

		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a * this.rows + b]) {
					isFinished = false;
				}
			}
		}
		if (isFinished) {
			this.endGame(true);
		} else {
			let intcounter = 0;
			for (let c = 0; c < this.columns; c++) {
				intcounter = 0;
				for (let d = 0; d < this.rows; d++) {
					if (this.state[c * this.rows + d]) {
						intcounter = intcounter + 1;
					}
				}
				this.decompose(c, intcounter);
			}
			this.bestChoice();
			this.nextPlay(this.posAI);
		}
	}

	endGame(playerWon) {
		var board = document.getElementById("board");
		var body = document.getElementById("boardContainer");
		board.remove();
		if (playerWon) {
			const chat = document.createElement("div");
			const txt = document.createTextNode("You have won!");
			chat.appendChild(txt);
			body.appendChild(chat);
		} else {
			const chat = document.createElement("div");
			const txt = document.createTextNode("You have lost!");
			chat.appendChild(txt);
			body.appendChild(chat);
		}

	}


	decompose(col, num) {
		for (let i = 3; i >= 0; i--) {
			if (num - Math.pow(2, i) >= 0) {
				this.board[col][i] = 1;
				num = num - Math.pow(2, i);
			} else {
				this.board[col][i] = 0;
			}
		}
	}

	bestChoice() {
		let col = 0;
		let quantity = 0;
		let extra = 0;
		let unbalanced = false;
		for (let i = 0; i < this.columns; i++) {
			extra = 0;
			if (this.board[i][0]) {
				extra = extra + 1;
			}
			if (this.board[i][1] == 1) {
				unbalanced = true;
				col = i;
			}
			if (this.board[i][2] == 1) {
				extra = extra + 4;
			}
			if (this.board[i][3] == 1) {
				unbalanced = true;
				quantity = quantity + 8;
				col = i;
			}
			if (unbalanced) {
				break;
			}
		}
		if (unbalanced) {
			let total = extra + quantity;
			this.posAI = col * this.rows + (this.rows - total) + quantity - 1;

		} else {
			let i = this.rows * this.columns;
			let counter = 0;
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					counter = counter + 1;
				}
			}
			let choice = new Array(counter);
			let w = 0;
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					choice[w] = k;
					w++;
				}
			}
			let j = Math.floor(Math.random() * counter);
			this.posAI = choice[j];
		}
	}


}

const DIVTABLE = document.getElementById("DIVtable");
const DIVREGRAS = document.getElementById("DIVregras");

function hideDivTabela() {

	if (DIVTABLE.style.display === "block") {
		DIVTABLE.style.display = "none";
	} else {
		DIVREGRAS.style.display ="none";
		DIVTABLE.style.display = "block";
	}
}

function hideDivRegras() {

	if (DIVREGRAS.style.display === "block") {
		DIVREGRAS.style.display = "none";
	} else {
		DIVTABLE.style.display = "none";
		DIVREGRAS.style.display = "block";
	}
}