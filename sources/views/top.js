import {JetView} from "webix-jet";
import authorization from "./top/authorization";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
							view: "label", label: _("Translator")
						},
						{
							view: "radio",
							localId: "language",
							value: this.app.getService("locale").getLang(),
							options: [
								{id: "en", value: _("English")},
								{id: "ru", value: _("Russian")}
							],
							click: () => {
								this.toggleLanguage();
							}
						},
						{
							template: _("Sign in or sign up"),
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
									label: _("Sign in"),
									width: 200,
									css: "webix_primary",
									click: () => this.showAuthWindow("Sign in")
								},
								{
									view: "button",
									label: _("Sign up"),
									width: 200,
									css: "webix_primary",
									click: () => this.showAuthWindow("Sign up")
								}
							]
						},
						{
							localId: "out",
							hidden: true,
							cols: [
								{
									localId: "userLogin",
									template: `${_("User login")}: #login#`,
									css: "user-login",
									borderless: true
								},
								{
									view: "button",
									label: _("Log out"),
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
								{id: "words", icon: "mdi mdi-table-edit", value: _("Words")},
								{
									id: "test",
									icon: "mdi mdi-clipboard-text-outline",
									value: _("Test")
								},
								{
									id: "testResult",
									icon: "mdi mdi-table-large",
									value: _("Test result")
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
		this._ = this.app.getService("locale")._;
		this.menuComponent = this.$$("menu");
		this.mainRow = this.$$("cell");
		this.messageForUnknownUser = this.$$("msgForUnknownUser");
		this.btnForUnknownUser = this.$$("inOrUp");
		this.btnForKnownUser = this.$$("out");
		this.window = this.ui(authorization);
		if (url[1]) {
			this.menuComponent.select(url[1].page);
		}


		webix.ajax().get("http://localhost:3000/users").then((userInfo) => {
			let userInfoToJson = userInfo.json();
			if (userInfoToJson) {
				this.knownUser(userInfoToJson);
			}
			else {
				this.unknownUser();
			}
		});

		this.on(this.app, "onUserSignIn", (userInfo) => {
			this.knownUser(userInfo);
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
			this.$$("userLogin").setValues({login: userInfo.login});
			this.btnForUnknownUser.hide();
			this.messageForUnknownUser.hide();
		}
	}

	unknownUser() {
		if (window.location.href !== "http://localhost:3000/#!/top") {
			window.location.href = "http://localhost:3000/#!/top";
			window.location.reload(true);
		}
		this.mainRow.disable();
		this.btnForUnknownUser.show();
		this.btnForKnownUser.hide();
		this.messageForUnknownUser.show();
	}

	toggleSidebar() {
		this.menuComponent.toggle();
	}

	showAuthWindow(windowType) {
		this.window.showWindow(windowType);
	}

	logOut() {
		this.unknownUser();
		webix.ajax().get("http://localhost:3000/users/logout");
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}
