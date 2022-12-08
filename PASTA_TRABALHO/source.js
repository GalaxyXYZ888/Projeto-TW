document.getElementById("submitB").onclick = function () {
	console.log("button clicked");
	var name = document.getElementById("loginB").value;
	var pass = document.getElementById("passwordB").value;

	if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://twserver.alunos.dcc.fc.up.pt:8008/register', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState < 4) return;
		if (xhr.status == 200)  {
			console.log(xhr.responseText);
		}
	}

	xhr.send(JSON.stringify({ 'nick': name, 'password': pass}));

}

document.getElementById("button").onclick = function () {
	console.log("ola");
	var cols = document.getElementById("cols").value;
	var rows = document.getElementById("rows").value;
	var dif = document.getElementById("dificuldadeButton").value;     // difficulty


	// Setting the difficulty based on the form value received
	let difficulty = 0;
	if (dif == "pl") {
		difficulty = 1;
	} else {
		difficulty = 2;
	}


	// Deciding who starts: if startP is true, then the player starts, otherwise the computer starts
	var start = document.getElementById("whoStartsButton").value; 
	let startP = false;
	if (start == "pl") {
		startP = true;
	} else {
		startP = false;
	}


	// Check the boardContainer element, if it has a child, then a board already exists and we will delete it
	var boardCont = document.getElementById("boardContainer");
	if (boardCont.hasChildNodes()) {
		boardCont.firstChild.remove();
	}


	// Now that there is no board, we will create a new one and append it to boardCont
	var newBoard = document.createElement("div");
	newBoard.setAttribute("class", "DIVcenter");
	newBoard.setAttribute("id", "board");
	boardCont.appendChild(newBoard);


	// Limiting the columns and rows of the board by 10
	if (cols > 10) {
		cols = 10;
	} if (rows > 10) {
		rows = 10;
	}


	// Create a new Table class, which will create the desired table in the "newBoard" div class
	let t = new Table(rows, cols, difficulty, startP);
	t.buildTable();

}


// If a player clicks on the "quit" button, then the div class containing the board gets removed
document.getElementById("quit").onclick = function () {
	var bCont = document.getElementById("boardContainer");
	if (bCont.hasChildNodes()) {
		bCont.firstChild.remove();
	}

}


class Table {
	constructor(rows, columns, dif, firstPlayer) {

	    this.columns = columns;		
	    this.rows = rows;
		this.firstPlayer = firstPlayer;                      // firstPlayer, if true it's the player, if false it's the computer
		this.dif = dif;                                      // Lvl of difficulty, if =1 it's the easy verion, if =2 it's the hard version

		this.posAI = 0;										 // This variable will be the position the computer plays (if lvl of diff = 2)

		this.state = new Array(this.rows*this.columns);      // state array contains boolean values, if true then there exists an object in that position

		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.state[i*this.rows + j] = true;
			}
		}

		// Create an array that contains the binary decomposition of the ammount of objects a column contains
		this.board = new Array(this.columns);

		// initializing the array
		for (let i = 0; i < this.columns; i++) {
			this.board[i] = new Array(4);                 // it only needs 4 elements, because there is a maximum of 10 objects per column, 2^(4) = 16
		}


	}
   
	buildTable() {

		const parent = document.getElementById("board");  // div that will contain the board

		const br = document.createElement("br");
		parent.append(br);

		// length will be the length of each column
		var length = 2 * this.rows;

	    // for loop to create the elements of the table
		for (let i = 0; i < this.columns; i++) {

			const col = document.createElement("div");
		    const tab = document.createTextNode("\t");

			parent.append(col);
		    parent.append(tab);

			// Changing the style of the column to be visible and resemble a container
			col.setAttribute("style", "width: 2em; height: " + length + "em; border: 2px solid black; float: left; margin-right: 1em; margin-left: 1em;");

			// for each column, we add the objects
			for (let j = 0; j < this.rows; j++) {

				// variable for the element, which will be a circle
				var circle = document.createElement("div"); 

				circle.setAttribute("id", this.rows*i + j);
				circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid black; border-radius: 50%; margin: 0 auto; background-color: green;");

				col.append(circle);

				// Creating an onclick event, when the circle is clicked it will call the play fucntion
				circle.onclick = () => this.play(i*this.rows + j); 
		    }
		}

		
		// Initially we do the binary decomposition for each column, using the decompose function
		for (let i = 0; i < this.columns; i++) {
			this.decompose(i, this.rows);
		}


		// In case the first move is made by the computer
		if (!this.firstPlayer) {
			this.bestChoice();
			this.nextPlay(this.posAI);
		}
	}


	// plays the next move of the computer
	nextPlay(pos) {


		// pick is the variable that will contain the chosen postion to play
		let pick = 0;


		// if the difficulty is easy, then the computer choses a random position to play
		if (this.dif == 1) {

			// total ammount of positions
			let i = this.rows * this.columns; 

			// counter will have the ammount of objects still in the table
			let counter = 0;

			// for loop to count the objects still in the table
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					counter = counter + 1;
				}
			}


			// we create an array with all the possible choices
			let choice = new Array(counter);
			let w = 0;
			for (let k = 0; k < i; k++) {
				if (this.state[k]) {
					choice[w] = k;
					w++;
				}
			}


			// we create a random number from 0 to counter(the number of possible choices) and we pick that number from the array
			let j = Math.floor(Math.random()*counter);
			pick = choice[j];
		}


		// if the difficulty is hard, then the computer will chose an optimum move, which is recorded on the pos variable
		if (this.dif == 2) {
			pick = pos;
		}

		var circle = document.getElementById(pick);

		// turns the state of that position to false
		this.state[pick] = false;
		
		// removing the circle by turning it invisible
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
		
		// removes all the objects above that position in that column
		while(pick%this.rows != 0 && pick >=0) {
			pick = pick-1;
		    circle = document.getElementById(pick);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pick] = false;
		}


		// Checks if the game is finished (if the state array is false for all positions) and records it in the isFinished variable
		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a* this.rows + b]) {
					isFinished=false;
				}
			}
		}


		// if the game is finished, calls the endGame function with the value false because the player lost
		if (isFinished) this.endGame(false);
	}



	play(pos) {


		// erasing the circle that was clicked on by the player, by making it invisible
		var circle = document.getElementById(pos);
		this.state[pos] = false;
		circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");


		// erasing all of the circles above the position given, in the same column
		while(pos%this.rows != 0 && pos >=0) {
			pos = pos-1;
		    circle = document.getElementById(pos);
			circle.setAttribute("style", "width: 1.8em; height: 1.9em; border: 1px solid rgb(255 186 96); border-radius: 50%; margin: 0 auto; background-color: rgb(255 186 96); visibility: none");
			this.state[pos] = false;
		}


		// checking if the game has finished, and recording the result in the isFinished variable
		var isFinished = true;
		for (let a = 0; a < this.columns; a++) {
			for (let b = 0; b < this.rows; b++) {
				if (this.state[a* this.rows + b]) {
					isFinished=false;
				}
			}
		}

		// if the game is finished, call the endGame function with the value true because the player won
		if (isFinished) {
			this.endGame(true);
		} else {

			// for loop to count how many objects a column has
			let objcounter = 0;
			for (let c = 0; c < this.columns; c++) {
				objcounter = 0;
				for (let r = 0; r < this.rows; r++) {
					if (this.state[c*this.rows + r]) {
						objcounter=objcounter+1;
					}
				}
				// updating the table containing the binary decomposition of each row
				this.decompose(c, objcounter);
			}

			// functions to decide the best position to play and making the computer play in that position (if diff lvl = 2)
			this.bestChoice();
			this.nextPlay(this.posAI);
		}
    }


	endGame(playerWon) {


		// removing the div containing the board
		var board = document.getElementById("board");
		var body = document.getElementById("boardContainer");
		board.remove();

		// if the player won, create a message saying "You have won!", other wise "You have lost!"
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


	// Function to do the binary deomposition of a column col with a number num of objects
	decompose(col, num) {

		// Since the maximum number of objects in a column is 10, then we only need 4 bits, so we start at number 3
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

		// for loop to find the first unbalanced column. If there is none then the unbalanced variable will be false
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


		// if unbalanced, then the computer will chose the option to balance the column
		if (unbalanced) {
			let total = extra + quantity;
			this.posAI = col * this.rows + (this.rows-total) + quantity - 1;

		} else {

			//if balanced, then the computer choses a random play
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
			this.posAI = choice[j];
		}
	}


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