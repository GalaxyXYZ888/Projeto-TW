document.getElementById("button").onclick = function () {
	var cols = document.getElementById("colsName").value;
	var rows = document.getElementById("rowsName").value;

	console.log("Rows:" + rows + " Cols:" + cols);

	let t = new Table(rows, cols);
	console.log("Table: Rows:" + t.rows + " Cols:" + t.columns);
	t.buildTable();
}


class Table {
	constructor(rows, columns) {
		this.rows = rows;
		this.columns = columns;
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