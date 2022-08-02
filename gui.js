let pane = new Tweakpane.Pane();

function generateGUI() {
	let generators = {
		width: function (params, p, folder, changers) {
			folder
				.addInput(params, p, {
					step: 5,
					min: 20,
					max: 100,
				})
				.on("change", (ev) => {
					changers[p](ev.value);
				});
		},
		font: function (params, p, folder, changers) {
			//debugger
			subfolder = folder.addFolder({ title: "font", expanded: false });
			changers = changers[p];
			params = params[p];
			subfolder.addInput(params, "size").on("change", (ev) => {
				changers["size"](ev.value);
			});
			if (changers["weight"])
				subfolder
					.addInput(params, "weight", {
						options: arrayToObj(["normal", "bold", "bolder", "lighter"]),
					})
					.on("change", (ev) => {
						changers["weight"](ev.value);
					});
			if (changers["style"])
				subfolder
					.addInput(params, "style", {
						options: arrayToObj(["normal", "italic", "oblique"]),
					})
					.on("change", (ev) => {
						changers["style"](ev.value);
					});
		},
		border: function (params, p, folder, changers) {
			subfolder = folder.addFolder({ title: "border", expanded: false });
			changers = changers[p];
			params = params[p];
			subfolder
				.addInput(params, "style", {
					options: arrayToObj([
						"none",
						"solid",
						"dotted",
						"dashed",
						"double",
						"groove",
					]),
				})
				.on("change", (ev) => {
					changers["style"](ev.value);
				});
			subfolder.addInput(params, "color").on("change", (ev) => {
				changers["color"](ev.value);
			});
			subfolder.addInput(params, "width").on("change", (ev) => {
				changers["width"](ev.value);
			});
			if (changers["radius"])
				subfolder.addInput(params, "radius").on("change", (ev) => {
					changers["radius"](ev.value);
				});
		},
		theme: function (params, p, folder, changers) {
			folder
				.addInput(params, p, { options: arrayToObj(Object.keys(themes)) })
				.on("change", (ev) => {
					changers[p](ev.value);
				});
		},
		language: function (params, p, folder, changers) {
			folder
				.addInput(params, p, {
					options: arrayToObj(hljs.listLanguages().sort()),
				})
				.on("change", (ev) => {
					changers[p](ev.value);
				});
		},
	};

	pane.dispose();
	pane = new Tweakpane.Pane();

	let tab = pane.addTab({
		pages: [{ title: "Structure" }, { title: "Styling" }, { title: "Presets" }],
	});
	let structure = tab.pages[0];
	let styling = tab.pages[1];
	let presets = tab.pages[2];

	const rerender = () => {
		importPreset(state);
		generateGUI();
	};

	for (let r = 0; r < sheet.children.length; r++) {
		row = sheet.children[r];
		rf = structure.addFolder({ title: "row " + r });
		for (let c = 0; c < row.children.length; c++) {
			col = row.children[c];
			cf = rf.addFolder({ title: "column " + c, expanded: false });
			for (let it = 0; it < col.children.length; it++) {
				infotable = col.children[it];
				trs = infotable.children[0].children;
				itf = cf.addFolder({ title: "infotable " + it });
				for (tr of trs) {
					let element = tr.children[0];
					let label = "";
					if (element.className.includes("code")) label = "code";
					else if (element.className.includes("heading")) label = "heading";
					else label = "description";
					itf.addBlade({
						view: "text",
						label: label,
						parse: (v) => String(v),
						value: element.innerText.trim().substring(0, 12).concat("..."),
						disabled: true,
					});
				}
				for (type of ["heading", "description", "code"])
					itf.addButton({ title: "Add " + type }).on("click", () => {
						addElementTo(getTable(r, c, it), type);
						rerender();
					});
				itf.addButton({ title: "Remove last element" }).on("click", () => {
					if (trs.length > 1) trs[trs.length - 1].remove();
				});
				itf.addButton({ title: "Remove infotable " + it }).on("click", () => {
					infotable.remove();
				});
			}
			cf.addButton({ title: "Add infotable" }).on("click", () => {
				addTableToSheet(r, c);
				rerender();
			});
			cf.addButton({ title: "Remove column " + c }).on("click", () => {
				col.remove();
			});
		}
		rf.addButton({ title: "Add column" }).on("click", () => {
			addColumnToRow(r);
			rerender();
		});
	}

	runThroughParams(params, styling, change, generators);

	styling.addButton({ title: "Re-highlight" }).on("click", () => {
		highlightAll();
	});

	for (p of tab.pages) {
		p.addButton({ title: "Save" }).on("click", saveState);
	}

	presets.addButton({ title: "Export" }).on("click", () => {
		saveState();
		let content = state;
		let fileName = "cheatsheet" + Date.now() + ".txt";
		contentType = "text/plain";
		let a = document.createElement("a");
		let file = new Blob([content], { type: contentType });
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	});

	/*function presetGuiList() {
		let arr = [];
		ps = Object.keys(presetlist);
		for (p of ps) {
			arr.push({ text: p, value: p });
		}
		arr.push({ text: "new...", value: "NEWPRESET" });
		console.log(arr);
		return arr;
	}*/

	pane.on("change", () => {
		saveState();
	});
}

function runThroughParams(params, folder, changers, generators) {
	for (let p in params) {
		if (generators.hasOwnProperty(p)) {
			generators[p](params, p, folder, changers);
		} else if (typeof params[p] === "object" && params[p] !== null) {
			subfolder = folder.addFolder({ title: p, expanded: false });
			runThroughParams(params[p], subfolder, changers[p], generators);
		} else if (params.hasOwnProperty(p)) {
			folder.addInput(params, p).on("change", (ev) => {
				changers[p](ev.value);
			});
		}
	}
}

generateGUI();

(function () {
	var beforePrint = function () {
		pane.hidden = true;
	};
	var afterPrint = function () {
		pane.hidden = false;
	};

	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia("print");
		mediaQueryList.addListener(function (mql) {
			if (mql.matches) {
				beforePrint();
			} else {
				afterPrint();
			}
		});
	}

	window.onbeforeprint = beforePrint;
	window.onafterprint = afterPrint;
})();
