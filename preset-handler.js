function arrayToObj(arr) {
	let obj = {};
	for (el of arr) obj[el] = el;
	return obj;
}

const importPreset = function (preset) {
	// header text
	title.innerText = preset["title"];
	subtitle.innerText = preset["subtitle"];

	// sheet creator
	resetSheet();
	rows = preset["sheet"];
	for (row of rows) {
		tr = document.createElement("tr");
		for (column of row) {
			td = document.createElement("td");
			for (infotable of column) {
				table = document.createElement("table");
				table.className = "infotable";
				tbody = document.createElement("tbody");
				for (element of infotable) {
					type = element["type"];
					content = element["content"];
					addElementTo(tbody, type, content);
				}
				table.appendChild(tbody);
				td.appendChild(table);
			}
			tr.appendChild(td);
		}
		sheet.appendChild(tr);
	}

	//highlightAll();

	// style handler
	style = preset["style"];
	function runThroughObject(obj, changer) {
		for (var k in obj) {
			if (typeof obj[k] === "object" && obj[k] !== null) {
				runThroughObject(obj[k], changer[k]);
			} else if (obj.hasOwnProperty(k)) {
				changer[k](obj[k]);
			}
		}
	}
	runThroughObject(style, change);

	highlightAll();

	params = style;
};

const exportPreset = function () {
	let preset = {};

	preset["title"] = title.innerText;
	preset["subtitle"] = subtitle.innerText;

	let _sheet = [];
	for (row of sheet.children) {
		let _row = [];
		for (column of row.children) {
			let _column = [];
			for (infotable of column.children) {
				let _infotable = [];
				for (tr of infotable.children[0].children) {
					let _element = {};
					let element = tr.children[0];
					if (element.className.includes("code")) _element["type"] = "code";
					else if (element.className.includes("heading"))
						_element["type"] = "heading";
					else _element["type"] = "description";
					_element["content"] = element.innerText;
					_infotable.push(_element);
				}
				_column.push(_infotable);
			}
			_row.push(_column);
		}
		_sheet.push(_row);
	}
	preset["sheet"] = _sheet;

	preset["style"] = params;

	return preset;
};

const exportJSON = function () {
	return JSON.stringify(exportPreset());
};

//let presetlist = {};
let state = {};
//let current = "preset 1";
firstTime = localStorage.length == 0;
if (firstTime) {
	state = Object.assign({}, defaultPreset);
	//presetlist = { "preset 1": state };
	//console.log(presetlist);
} else{
    state = JSON.parse(localStorage.getItem("state"))
}
const saveState = function(){
    state = exportPreset();
    localStorage.setItem("state",JSON.stringify(state));
}

importPreset(state);