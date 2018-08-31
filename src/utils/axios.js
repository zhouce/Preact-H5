import axios from 'axios';

const Axios = axios.create({
	baseURL: 'https://service.miaokanvideo.com'
});
export default Axios;