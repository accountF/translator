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
						{
							view: "label", label: "Translator"
						},
						{
							template: "Please sign in or sign up",
							localId: "msgForUnknownUser",
							css: "user-login",
							hidden: true,
							borderless: true
						},
						{
							localId: "inOrUp",
							hidden: true,
							cols: [
								{
									view: "button",
									label: "Sign in",
									width: 150,
									css: "webix_primary",
									click: () => this.logIn()
								},
								{
									view: "button",
									label: "Sign up",
									width: 150,
									css: "webix_primary",
									click: () => this.logUp()
								}
							]
						},
						{
							localId: "out",
							hidden: true,
							cols: [
								{
									localId: "userLogin",
									template: "User login: #login#",
									css: "user-login",
									borderless: true
								},
								{
									view: "button",
									label: "Log out",
									width: 150,
									css: "webix_primary",
									click: () => this.logOut()
								}

							]
						}
					]
				},
				{
					localId: "cell",
					cols: [
						{
							view: "sidebar",
							localId: "menu",
							data: [
								{id: "words", icon: "mdi mdi-table-edit", value: "Words"},
								{id: "test", icon: "mdi mdi-clipboard-text-outline", value: "Test"},
								{
									id: "testResult",
									icon: "mdi mdi-table-large",
									value: "Test result"
								}
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
		this.mainRow = this.$$("cell");
		this.messageForUnknownUser = this.$$("msgForUnknownUser");
		this.btnForUnknownUser = this.$$("inOrUp");
		this.btnForKnownUser = this.$$("out");
		this.window = this.ui(authorization);
		this.menuComponent.select(url[1].page);

		let token = webix.storage.local.get("token");
		if (token) {
			webix.ajax().headers({
				Auth: token
			}).get("http://localhost:3000/getUser").then((userInfo) => {
				let userInfoToJson = userInfo.json();
				if (userInfoToJson) {
					this.knownUser(userInfoToJson);
				}
				else {
					this.unknownUser();
				}
			});
		}
		else {
			this.unknownUser();
		}

		this.on(this.app, "onUserLogIn", (userInfo) => {
			window.location.reload(true);
			this.knownUser(userInfo);
			webix.storage.local.put("token", userInfo.token);
		});

		this.menuComponent.attachEvent("onAfterSelect", (newValue) => {
			this.show(`./${newValue}`);
		});
	}

	knownUser(userInfo) {
		if (userInfo) {
			this.btnForKnownUser.show();
			this.mainRow.enable();
			this.messageForUnknownUser.hide();
			this.$$("userLogin").setValues({login: userInfo.userLogin});
			this.btnForUnknownUser.hide();
			this.messageForUnknownUser.hide();
		}
	}

	unknownUser() {
		this.mainRow.disable();
		this.btnForUnknownUser.show();
		this.btnForKnownUser.hide();
		this.messageForUnknownUser.show();
	}

	toggleSidebar() {
		this.menuComponent.toggle();
	}

	logIn() {
		this.window.showWindow("Sign in");
	}

	logUp() {
		this.window.showWindow("Sign up");
	}

	logOut() {
		this.unknownUser();
		webix.storage.local.remove("token");
	}
}
