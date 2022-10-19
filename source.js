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
