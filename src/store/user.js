import {observable, action} from 'mobx';

class Store {
	@observable
	platform = '';
	@observable
	uid = null;

	@action
	setUserInfo = (p, uid) => {
		this.platform = p;
		this.uid = uid;
	}
}

export default new Store();