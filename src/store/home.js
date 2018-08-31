import {observable, action, runInAction} from 'mobx';
import axios from 'utils/axios';

class Store {
    @observable
    userInfo = {};
	@observable
	taskList = [];
	@observable
	answerNum = null;

	@action
	getUserInfo = async (uid) => {
		try {
			const response = await axios.get(`/Work/GetAnswerPageInfos?uidx=${uid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				runInAction(() => {
					this.userInfo = data.result[0];
					this.taskList = data.taskresult;
				});
			}
		} catch (error) {
			runInAction(() => {
				this.userInfo = {};
				this.taskList = [];
			});
		}
	};

	@action
	getAnswerNum = async (uid) => {
		try {
			const response = await axios.get(`/Work/GetAnswerNum?uidx=${uid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				const num = data.result[0].num;
				runInAction(() => {
					this.answerNum = num;
				});
			}
		} catch (error) {
			runInAction(() => {
				this.answerNum = null;
			});
		}
	};

	@action
	postInviteCode = async (uid, code, callback) => {
		try {
			const response = await axios.get(`/Work/UseInvitationCode?uidx=${uid}&invitationCode=${code}&aes=false`);
			callback(response.data);
		} catch (error) {
		}
	};
}

export default new Store();