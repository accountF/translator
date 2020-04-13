import {JetView} from "webix-jet";

export default class Test extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [
						{view: "template", template: "Select group please", type: "header"},
						{
							view: "list",
							localId: "groupList",
							select: true,
							template: group => `${group.groupName}`
						},
						{
							view: "form",
							localId: "testForm",
							hidden: true,
							elements: [
								{name: "wordInRussian", view: "label", localId: "russianWord"},
								{name: "version0", view: "button", click: id => this.clickOnTest(id)},
								{name: "version1", view: "button", click: id => this.clickOnTest(id)},
								{name: "version2", view: "button", click: id => this.clickOnTest(id)},
								{name: "version3", view: "button", click: id => this.clickOnTest(id)}

							]
						},
						{
							view: "template",
							localId: "endOfTest",
							template: "Test Completed! #point# points!",
							type: "header",
							hidden: true
						}
					]
				}
			]
		};
	}

	init() {
		this.listComponent = this.$$("groupList");
		this.formComponent = this.$$("testForm");
		this.templateComponent = this.$$("endOfTest");
		this.token = webix.storage.local.get("token");
		webix.ajax().headers({Auth: this.token}).get("http://localhost:3000/wordGroups").then((wordGroups) => {
			this.listComponent.parse(wordGroups);
		});
		this.listComponent.attachEvent("onAfterSelect", (id) => {
			this.click = 0;
			this.testResult = [];
			this.formComponent.show();
			this.templateComponent.hide();
			this.formComponent.clear();
			webix.ajax().get(`http://localhost:3000/wordsForTest/${id}`).then((data) => {
				this.dataForTest = data.json();
				this.formComponent.setValues(this.dataForTest[this.click]);
			});
		});
	}

	clickOnTest(id) {
		let englishWord = this.$$(id).getValue();
		let russianWord = this.$$("russianWord").getValue();
		let result = {
			wordInRussian: russianWord,
			wordInEnglish: englishWord
		};
		this.testResult.push(result);
		this.click += 1;

		if (this.click < this.dataForTest.length) {
			this.formComponent.setValues(this.dataForTest[this.click], true);
		}
		else {
			this.formComponent.hide();
			this.templateComponent.show();
			let selectedGroupId = this.listComponent.getSelectedId();
			webix.ajax().post("http://localhost:3000/getResult", {testResult: this.testResult, groupId: selectedGroupId}).then((point) => {
				let pointForClient = point.json();
				this.templateComponent.parse(pointForClient);
				let currentDate = new Date().toISOString().slice(0, 10);
				let resutTestForServer = {
					result: pointForClient.point,
					date: currentDate,
					wordGroup: selectedGroupId
				};
				webix.ajax().headers({Auth: this.token}).post("http://localhost:3000/setResult", resutTestForServer);
			});
		}
	}
}
