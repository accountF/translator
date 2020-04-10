import {JetView} from "webix-jet";

export default class Authorization extends JetView {
	config() {
		return {
			view: "window",
			localId: "authorizationWindow",
			position: "center",
			head: {
				cols: [
					{template: "#nameForm#", localId: "windowHeader", type: "header", borderless: true},
					{
						view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				view: "form",
				localId: "userDataForm",
				elements: [
					{view: "text", name: "formType", localId: "formType", hidden: true},
					{view: "text", label: "Login", name: "login", labelWidth: 150, width: 400, invalidMessage: "Login can not be empty"},
					{view: "text", label: "Password", name: "password", labelWidth: 150, width: 400, invalidMessage: "Password can not be empty"},
					{view: "text", localId: "repeatedPassword", label: "Repeat password", name: "repeatedPassword", labelWidth: 150, invalidMessage: "Repeated password can not be empty"},
					{view: "button", localId: "formButton", value: "Sign in", click: () => this.signInOrSignUp()}
				],
				rules: {
					login: webix.rules.isNotEmpty,
					password: webix.rules.isNotEmpty,
					repeatedPassword: webix.rules.isNotEmpty
				}
			}
		};
	}

	init() {
		this.windowComponent = this.$$("authorizationWindow");
		this.formComponent = this.$$("userDataForm");
		this.repeatPasswordInput = this.$$("repeatedPassword");
		this.formTypeInput = this.$$("formType");
		this.buttonComponent = this.$$("formButton");
	}

	showWindow(action) {
		this.$$("windowHeader").setValues({nameForm: action});
		if (action === "Sign in") {
			this.repeatPasswordInput.hide();
			this.formTypeInput.setValue(action);
			this.buttonComponent.setValue(action);
		}
		else if (action === "Sign up") {
			this.repeatPasswordInput.show();
			this.formTypeInput.setValue(action);
			this.buttonComponent.setValue(action);
		}
		this.getRoot().show();
	}

	closeWindow() {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		this.windowComponent.hide();
	}

	signIn(userData) {
		webix.ajax().post("http://localhost:3000/signIn", userData).then((data) => {
			let result = data.text();
			if (result) {
				webix.message(`${result} success`);
				this.closeWindow();
				this.app.callEvent("onUserLogIn", [result]);
			}
			else {
				webix.message("Sign up please or check your data");
			}
		});
	}

	signUp(userData) {
		if (userData.password === userData.repeatedPassword) {
			webix.ajax().post("http://localhost:3000/signUp", userData).then((data) => {
				let result = data.text();
				if (result) {
					webix.message(`${result} successful log up`);
					this.closeWindow();
				}
				else {
					webix.message("User existed");
				}
			});
		}
	}

	signInOrSignUp() {
		let userData = this.formComponent.getValues();
		if (this.formComponent.validate()) {
			if (userData.formType === "Sign in") {
				this.signIn(userData);
			}
			else if (userData.formType === "Sign up") {
				this.signUp(userData);
			}
		}
	}
}
