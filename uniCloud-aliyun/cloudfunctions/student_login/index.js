'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const collection = db.collection('students')
	let res = await collection.where({
		name: event.name||event.queryStringParameters.name,
		mobile: event.mobile||event.queryStringParameters.mobile
	}).count()
	if (res.total == 0) {

		res = {
			msg: "用户信息错误",
			code: 0,
		}
	} else {
		res = {
			msg: "用户信息正确",
			code: 1,
		}
	}


	//返回数据给客户端
	return res
};
