import {JetView} from "webix-jet";
import authorization from "./top/authorization";

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
						{view: "label", label: "Translator"},
						{
							localId: "inOrUp",
							cols: [
								{view: "button", label: "Sign in", width: 150, css: "webix_primary", click: () => this.signIn()},
								{view: "button", label: "Sign up", width: 150, css: "webix_primary", click: () => this.signUp()}
							]
						},
						{
							localId: "out",
							hidden: true,
							cols: [
								{localId: "userLogin", template: "User login: #login#", css: "user-login", borderless: true},
								{view: "button", label: "Log out", width: 150, css: "webix_primary", click: () => this.logOut()}

							]
						}
					]
				},
				{
					cols: [
						{
							view: "sidebar",
							localId: "menu",
							data: [
								{id: "words", icon: "mdi mdi-table-edit", value: "Words"},
								{id: "test", icon: "mdi mdi-clipboard-text-outline", value: "Test"},
								{id: "testResult", icon: "mdi mdi-table-large", value: "Test result"}
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

		this.window = this.ui(authorization);

		this.on(this.app, "onUserLogIn", (login) => {
			if (login) {
				this.$$("inOrUp").hide();
				this.$$("out").show();
				this.$$("userLogin").setValues({login});
			}
		});
	}

	toggleSidebar() {
		this.menuComponent.toggle();
	}

	signIn() {
		this.window.showWindow("Sign in");
	}

	signUp() {
		this.window.showWindow("Sign up");
	}

	logOut() {
		this.$$("inOrUp").show();
		this.$$("out").hide();
	}
}
