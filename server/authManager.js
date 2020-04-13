class AuthManager {
	constructor() {
		this.storage = {};
	}

	startSession(userId, token) {
		this.storage[token] = userId;
	}

	getCurrentUser(token) {
		let userId;
		if (this.storage[token]) {
			userId = this.storage[token];
		}
		return userId;
	}
}

module.exports = new AuthManager();
