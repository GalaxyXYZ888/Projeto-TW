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

		for (let i = 0; i < this.columns; i++) {
			const col = document.createElement("div");
			const tab = document.createTextNode("\t");
			parent.append(col);
			parent.append(tab);
			for (let j = 0; j < this.rows; j++) {
				const nl = document.createTextNode("\n");
				const ndiv = document.createElement("div");
				if (j != 0) {
					col.append(nl);
				}
				col.append(ndiv);
				ndiv.setAttribute("style", "width: 2em; height: 2em; border: 2px solid black;");
			}
		}


	}

}    
