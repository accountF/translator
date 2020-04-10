import {JetView} from "webix-jet";

export default class TestResult extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "resultTable",
			columns: [
				{id: "ordinalNumber", header: "Ordinal number", minWidth: 150},
				{id: "result", header: "Result", width: 100},
				{id: "groupName", header: "Word groups", fillspace: true},
				{id: "date", header: "Date", format: webix.i18n.longDateFormatStr, minWidth: 200}
			]
		};
	}

	init() {
		this.tableComponent = this.$$("resultTable");
		this.tableComponent.load("http://localhost:3000/results");
	}
}
