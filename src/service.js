/**
 * Created by likaituan on 26/12/2017.
 */

let ajax = require('seek-ajax');

module.exports = {
	getList: params => ajax.get('/service/getList', params),
	search: params => ajax.get('/service/search', params),
	delSong: params => ajax.get('/service/delSong', params),
	addSong: params => ajax.post('/service/addSong', params),
	addClick: params => ajax.post('/service/addClick', params),
	setMood: params => ajax.post('/service/setMood', params),
	getCode: params => ajax.getText('/service/getCode', params)
};