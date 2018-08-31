import {observable, action, runInAction} from 'mobx';
import axios from 'utils/axios';
import { Base64 } from 'js-base64';

class Store {
	@observable
	topics = [];
	@observable
	answers = [];
	@observable
	rightId = null;

	@action
    getAnswers = async (tid) => {
		try {
			const response = await axios.get(`/Work/GetAnswer?tid=${tid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				const result = data.result;
				for (let i = 0,len = result.length; i < len; i++) {
					const answer = result[i];
					if (answer.isRight) {
						runInAction(() => {
							this.answers = [...result];
							this.rightId = answer.id;
						});
						break;
                    }
				}
			}
		} catch (error) {
			runInAction(() => {
				this.answers = [];
			});
		}
	};

    @action
    getTopics = async (uid) => {
        try {
            const response = await axios.get(`/work/GetTopic?uidx=${uid}&aes=false`);
            const data = response.data;
            if (data.errorcode == '00000:ok') {
                const result = data.result;
                const topics = [];
                for (let i = 0,len = result.length; i < len; i++) {
                    const topic = result[i];
                    topic.videoUrl = Base64.decode(topic.videoUrl);
					topics.push(topic);
                }
				runInAction(() => {
					this.topics = topics;
				});
				this.getAnswers(topics[0].id);
            }
        } catch (error) {
            runInAction(() => {
				this.topics = [];
            });
        }
    };

	@action
	getReviveCard = async (uid, callback) => {
		try {
			const response = await axios.get(`/Work/GetResurgenceCard?uidx=${uid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				callback(data.resurgenceCard);
			}
		} catch (error) {
		}
	};

	@action
	getBonus = async (uid, callback) => {//获取奖金
		try {
			const response = await axios.get(`/Work/GetBonus?uidx=${uid}&aes=false`);
			const data = response.data;
			if (data.errorcode == '00000:ok') {
				callback(data.result);
			}
		} catch (error) {
		}
	};

	@action
	addAnswerNum = async (uid, p) => {//增加答题次数
		try {
			const response = await axios.get(`/Work/AddAnswerNum?uidx=${uid}&platform=${p}&aes=false`);
			if (response.data.errorcode == '00000:ok') {
				this.getTopics(uid)
			}
		} catch (error) {
		}
	};

	@action
	statRightWrong = (isRight, uid, tid) => {//统计做错和做对的题
		axios.get(`/Work/${isRight ? 'StatAnswerRightNum' : 'StatAnswerWrongNum'}?uidx=${uid}&tid=${tid}&aes=false`);
	};

    @action
    initData = () => {
		this.topics = [];
		this.answers = [];
		this.rightId = null;
    }
}

export default new Store();