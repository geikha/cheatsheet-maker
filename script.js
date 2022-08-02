const body = document.body;
const header = document.getElementById("header");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const sheet = document.getElementById("sheet").children[0];

// table funcs

const getSheetElement = function (row = 0, col = 0) {
	return sheet.children[row].children[col];
};

const getTable = function (row = 0, col = 0, n = 0) {
	return getSheetElement(row, col).children[n].children[0];
};

const addRowToSheet = function (columns) {
	row = document.createElement("tr");
	for (let i = 0; i < columns; i++) {
		col = document.createElement("td");
		row.appendChild(col);
	}
};

const addColumnToRow = function (row = 0) {
	_row = sheet.children[row];
	td = document.createElement("td");
	_row.appendChild(td);
};

const resetSheet = function () {
	sheet.innerHTML = "";
};

const addElementTo = function (
	table,
	type = "description",
	content = "lorem ipsum"
) {
	row = document.createElement("tr");
	element = document.createElement("td");
	if (type != "code") {
		element.className = type;
		element.innerText = content;
	} else {
		element.className = "code-container";
		pre = document.createElement("pre");
		code = document.createElement("code");
		code.innerText = content;
		pre.appendChild(code);
		element.appendChild(pre);
	}
	element.className = element.className.concat(" infotable-element");
	element.setAttribute("contenteditable", "true");
	row.appendChild(element);
	table.appendChild(row);
};

const removeElementFrom = function (table) {
	table.lastChild.remove();
};

const addTableToSheet = function (row = 0, col = 0) {
	getSheetElement(row, col).appendChild(initTable());
};

const initTable = function () {
	table = document.createElement("table");
	table.className = "infotable";
	tbody = document.createElement("tbody");
	table.appendChild(tbody);
	addElementTo(tbody, "heading");
	return table;
};

// hljs

const escapeHtml = (unsafe) => {
	return unsafe
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
};

const highlightAll = function () {
	elements = document.querySelectorAll("pre code");
	let i = 0;
	for (let el of elements) {
        el.className = "";
		el.innerHTML = escapeHtml(el.innerText);
		hljs.highlightElement(el);
		i++;
	}
	return i;
};

// style changer funcs

const changeSelector = function (selector, changer) {
	elements = document.querySelectorAll(selector);
	for (let el of elements) {
		changer(el);
	}
};

const change = {
	background: {
		color: function (color) {
			body.style.backgroundColor = color;
		},
	},
	header: {
		color: function (color) {
			header.style.color = color;
		},
		title: {
			font: {
				size: function (size) {
					title.style.fontSize = size;
				},
				weight: function (size) {
					title.style.fontWeight = size;
				},
				style: function (size) {
					title.style.fontStyle = size;
				},
			},
			width: function (width) {
				title.style.width = width;
			},
		},
		subtitle: {
			font: {
				size: function (size) {
					subtitle.style.fontSize = size;
				},
				weight: function (size) {
					subtitle.style.fontWeight = size;
				},
				style: function (size) {
					subtitle.style.fontStyle = size;
				},
			},
		},
	},
	infotable: {
		border: {
			style: function (style) {
				changeSelector(".infotable", (el) => (el.style.borderStyle = style));
			},
			color: function (color) {
				changeSelector(".infotable", (el) => (el.style.borderColor = color));
			},
			width: function (width) {
				changeSelector(".infotable", (el) => (el.style.borderWidth = width));
			},
		},
		elements: {
			border: {
				style: function (style) {
					changeSelector(
						".infotable-element",
						(el) => (el.style.borderStyle = style)
					);
				},
				color: function (color) {
					changeSelector(
						".infotable-element",
						(el) => (el.style.borderColor = color)
					);
				},
				width: function (width) {
					changeSelector(
						".infotable-element",
						(el) => (el.style.borderWidth = width)
					);
				},
                radius: function (radius) {
					changeSelector(
						".infotable-element",
						(el) => (el.style.borderRadius = radius)
					);
				},
			},
		},
	},
	heading: {
		backgroundColor: function (color) {
			changeSelector(".heading", (el) => (el.style.backgroundColor = color));
		},
		color: function (color) {
			changeSelector(".heading", (el) => (el.style.color = color));
		},
		font: {
			size: function (size) {
				changeSelector(".heading", (el) => (el.style.fontSize = size));
			},
			weight: function (size) {
				changeSelector(".heading", (el) => (el.style.fontWeight = size));
			},
			style: function (size) {
				changeSelector(".heading", (el) => (el.style.fontStyle = size));
			},
		},
	},
	description: {
		backgroundColor: function (color) {
			changeSelector(
				".description",
				(el) => (el.style.backgroundColor = color)
			);
		},
		color: function (color) {
			changeSelector(".description", (el) => (el.style.color = color));
		},
		font: {
			size: function (size) {
				changeSelector(".description", (el) => (el.style.fontSize = size));
			},
			weight: function (size) {
				changeSelector(".description", (el) => (el.style.fontWeight = size));
			},
			style: function (size) {
				changeSelector(".description", (el) => (el.style.fontStyle = size));
			},
		},
	},
	code: {
		font: {
			size: function (size) {
				changeSelector(".code-container", (el) => (el.style.fontSize = size));
			},
		},
        padding: function (pad) {
            changeSelector("pre code", (el) => (el.style.padding = pad));
        },
		theme: function (theme) {
			if (themes[theme]) {
				document.querySelector("link.codestyle").href = themes[theme];
				highlightAll();
			}
		},
		language: function (lang) {
			hljs.configure({ languages: [lang] });
            highlightAll();
		},
	},
};

// tweakpane

let params = {};

/*TODO
 * setear highlight js -done
 * generar la pagina desde un objeto -done
 * poder exportar dicho objeto -done
 * generar la gui correspondiente para dicho objeto -done
 * html escape inner text antes de re-highlightear -done
 */
/*
hypers = document.querySelectorAll('a[title$="min.css"]')
styles = {}
for(let hy of hypers){
    let name = hy.title.replace(".min.css","")
    let href = hy.href.replace("browse/","")
    styles[name] = href
}
*/
