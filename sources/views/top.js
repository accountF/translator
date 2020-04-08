import {JetView} from "webix-jet";

export default class TopView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					padding: 3,
					elements: [
						{
							view: "icon", icon: "mdi mdi-menu", click: () => this.toggleSidebar()
						},
						{view: "label", label: "Translator"}
					]
				},
				{
					cols: [
						{
							view: "sidebar",
							localId: "menu",
							data: [
								{id: "start", icon: "mdi mdi-table-edit", value: "Start"},
								{id: "data", icon: "mdi mdi-table-edit", value: "Data"},
							]
						},
						{$subview: true}
					]
				}
			]
		};
	}

	init(view, url) {
		this.menuComponent = this.$$("menu");
		this.menuComponent.select(url[1].page);
		this.menuComponent.attachEvent("onAfterSelect", (newValue) => {
			this.show(`./${newValue}`);
		});
	}

	toggleSidebar() {
		this.menuComponent.toggle();
	}
}
