let defaultPreset = {
	title: "> Cheatsheet Maker",
	subtitle: "This website is fully editable. Click anywhere to edit!",
	sheet: [
		[
			[
				[
					{ type: "heading", content: "Concept" },
					{ type: "description", content: "A description for the concept" },
					{ type: "code", content: "let myArray = [0,1,2,3,4]" },
				],
			],
			[],
			[],
		],
	],
	style: {
		background: {
			color: "#fff",
		},
		header: {
			color: "#000",
			title: {
				width: "40%",
				font: {
					size: "25pt",
					weight: "bold",
					style: "normal",
				},
			},
			subtitle: {
				font: {
					size: "10pt",
					weight: "normal",
					style: "normal",
				},
			},
		},
		infotable: {
			border: {
				style: "dotted",
				color: "#000",
				width: "2pt",
			},
			elements: {
				border: {
					style: "solid",
					color: "#000",
					width: "1pt",
					radius: "0pt"
				},
			},
		},
		heading: {
			backgroundColor: "#000",
			color: "#fff",
			font: {
				size: "14pt",
				weight: "bold",
				style: "normal",
			},
		},
		description: {
			backgroundColor: "#fff",
			color: "#000",
			font: {
				size: "8pt",
				weight: "normal",
				style: "italic",
			},
		},
		code: {
			font: {
				size: "10pt",
			},
			padding: "10pt",
			theme: "stackoverflow-light",
			language: "javascript",
		},
	},
};
