var ajax = require('sys.ajax');

ajax.get('/service/getMp3List', data => log({data}) );

document.body.innerHTML = '<h2>hello seekjs</h2>';