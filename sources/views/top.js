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
									click: () => this.signIn()
								},
								{
									view: "button",
									label: _("Sign up"),
									width: 200,
									css: "webix_primary",
									click: () => this.signUp()
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
								{id: "test", icon: "mdi mdi-clipboard-text-outline", value: _("Test")},
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

		this.on(this.app, "onUserSignIn", (userInfo) => {
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

	signIn() {
		this.window.showWindow(this._("Sign in"));
	}

	signUp() {
		this.window.showWindow(this._("Sign up"));
	}

	logOut() {
		this.unknownUser();
		webix.storage.local.remove("token");
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}
