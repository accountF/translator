import {JetView} from "webix-jet";

export default class Words extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "datatable",
					localId: "wordGroupsTable",
					select: true,
					editable: true,
					columns: [
						{
							id: "groupName",
							header: _("Groups name"),
							fillspace: true,
							sort: "string",
							editor: "text"
						},
						{
							id: "date",
							header: _("Date"),
							width: 150,
							sort: "string",
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "numberOfWords",
							header: _("Number of words"),
							width: 150,
							sort: "string"
						}
					]
				},
				{
					cols: [
						{view: "button", value: _("Add Group"), click: () => this.addGroup()},
						{
							view: "button",
							localId: "btnExcel",
							value: _("Export to excel"),
							click: () => this.exportToExcel(),
							disabled: true
						}
					]
				},
				{
					view: "datatable",
					localId: "wordsTable",
					select: true,
					editable: true,
					columns: [
						{
							id: "wordInEnglish",
							header: _("Word in english"),
							fillspace: true,
							sort: "string",
							editor: "text"
						},
						{
							id: "wordInRussian",
							header: _("Word in russian"),
							fillspace: true,
							sort: "string",
							editor: "text"
						},
						{
							id: "partOfSpeech",
							header: _("Part of speech"),
							width: 150,
							sort: "string",
							editor: "text"
						}
					]
				},
				{
					view: "button",
					value: _("Add word"),
					localId: "btnAddWord",
					click: () => this.addWord(),
					disabled: true
				}
			]
		};
	}

	init() {
		this.groupsTable = this.$$("wordGroupsTable");
		this.wordsTable = this.$$("wordsTable");

		this.token = webix.storage.local.get("token");
		webix.ajax().headers({Auth: this.token}).get("http://localhost:3000/wordGroups").then((wordGroups) => {
			this.groupsTable.parse(wordGroups);
		});

		this.groupsTable.attachEvent("onAfterSelect", (id) => {
			webix.ajax().get(`http://localhost:3000/words/${id}`).then((data) => {
				this.wordsTable.clearAll();
				this.wordsTable.parse(data);
				this.$$("btnAddWord").enable();
				this.$$("btnExcel").enable();
			});
		});

		this.groupsTable.attachEvent("onEditorChange", (id, value) => {
			let data = {
				[id.column]: value
			};
			webix.ajax().put(`http://localhost:3000/wordGroups/${id.row}`, data);
		});

		this.wordsTable.attachEvent("onEditorChange", (id, value) => {
			let data = {
				[id.column]: value
			};
			webix.ajax().put(`http://localhost:3000/words/${id.row}`, data);
		});

		this.on(this.app, "onWordChange", (word) => {
			if (word) {
				webix.ajax().headers({Auth: this.token}).get("http://localhost:3000/wordGroups").then((wordGroups) => {
					this.groupsTable.parse(wordGroups);
				});
			}
		});
	}

	addGroup() {
		let currentDate = new Date().toISOString().slice(0, 10);
		let newGroup = {
			groupName: "New Group",
			date: currentDate
		};
		webix.ajax().headers({Auth: this.token}).post("http://localhost:3000/wordGroups", newGroup).then((data) => {
			this.groupsTable.add(data.json(), 0);
		});
	}

	addWord() {
		let selectedGroup = this.groupsTable.getSelectedId().row;
		let newWord = {
			wordInEnglish: "word",
			wordInRussian: "слово",
			wordGroupId: selectedGroup
		};
		webix.ajax().post("http://localhost:3000/words", newWord).then((data) => {
			let result = data.json();
			this.wordsTable.add(result, 0);
			this.app.callEvent("onWordChange", [result]);
		});
	}

	exportToExcel() {
		let selectedGroupItem = this.groupsTable.getSelectedItem();
		webix.toExcel(this.wordsTable, {
			filename: selectedGroupItem.groupName
		});
	}
}
