document.getElementById("button").onclick = function () {
	var cols = document.getElementById("cols").value;
	var rows = document.getElementById("rows").value;

	console.log("Rows:" + rows + " Cols:" + cols);

	let t = new Table(rows, cols);
	console.log("Table: Rows:" + t.rows + " Cols:" + t.columns);
	t.buildTable();
}


class Table {
	constructor(rows, columns) {
	    this.rows = rows;
	    this.columns = columns;
	    this.state = new Array(this.rows*this.columns);
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.state[i*this.rows + j] = true;
			}
		}
		this.board = new Array(this.columns);
		for (let i = 0; i < this.columns; i++) {
			board[i] = new Array(4);
		}
	}

/*
    buildTable() {
	const table = document.createElement("table");
	const parent = document.getElementById("board");
	parent.append(table);

	for (let i = 0; i < this.rows; i++) {
	    var tr = document.createElement("tr");
	    table.append(tr);
	    for (let j = 0; j < this.cols; j++) {
		var td = document.createElement("td");
		tr.append(td);
		var X = document.createTextNode("X");
		td.append(X);
	    }
	}
    }

*/    
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
				circle.setAttribute("id", this.rows*i + j);
				circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid black; border-radius: 50%; margin: 0 auto; background-color: green;");
				col.append(circle);
				circle.onclick = () => this.play(i*this.rows + j);
		    }
		}
	}

	nextPlay() {
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
		let j = Math.floor(Math.random()*counter);
		let pick = choice[j];
		var circle = document.getElementById(pick);
		this.state[pick] = false;
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
		while(pick%this.rows != 0 && pick >=0) {
			pick = pick-1;
		    circle = document.getElementById(pick);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pick] = false;
		}

		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a* this.rows + b]) {
					isFinished=false;
				}
			}
		}
		if (isFinished) this.endGame();
	}

    play(pos) {
		console.log(pos);
		var circle = document.getElementById(pos);
		this.state[pos] = false;
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
		while(pos%this.rows != 0 && pos >=0) {
			pos = pos-1;
		    circle = document.getElementById(pos);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pos] = false;
		}
		this.nextPlay();
/*		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (this.state[i*this.rows + j]) {
					return;
				}
			}
		}
		this.endGame();*/

		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a* this.rows + b]) {
					isFinished=false;
				}
			}
		}
		if (isFinished) this.endGame();
    }

	endGame() {
		var board = document.getElementById("board");
		var body = document.getElementById("body");
		board.remove();
		const div = document.createElement("div");
		const txt = document.createTextNode("The game has ended!");

	}
/*
	decompose(col, num) {
		let i = 
		while(true) {}
	}
*/

}


function hideDivTabela() {

	const DIV = document.getElementById("DIVtable");

	if (DIV.style.display === "block") {
		DIV.style.display = "none";
	} else {
		DIV.style.display = "block";
	}
}

function hideDivRegras() {

	const DIV = document.getElementById("DIVregras");

	if (DIV.style.display === "block") {
		DIV.style.display = "none";
	} else {
		DIV.style.display = "block";
	}
}