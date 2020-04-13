import {JetView} from "webix-jet";

export default class TestResult extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "datatable",
			localId: "resultTable",
			columns: [
				{id: "ordinalNumber", header: _("Ordinal number"), minWidth: 150},
				{id: "result", header: _("Result"), width: 100},
				{id: "groupName", header: _("Word groups"), fillspace: true},
				{id: "date", header: _("Date"), format: webix.i18n.longDateFormatStr, minWidth: 200}
			]
		};
	}

	init() {
		this.tableComponent = this.$$("resultTable");
		let token = webix.storage.local.get("token");
		webix.ajax().headers({
			Auth: token
		}).get("http://localhost:3000/results").then((results) => {
			this.tableComponent.parse(results);
		});
	}
}
