'use strict';
const db = uniCloud.database()
const dbCmd = db.command;

exports.main = async (event, context) => {
	let name = event.name || event.queryStringParameters.name
	let exam = event.exam || event.queryStringParameters.exam
	let year = event.year || event.queryStringParameters.year
	let mobile = event.mobile || event.queryStringParameters.mobile

	//event为客户端上传的参数
	// console.log('event : ', event)
	const collection = db.collection('students')
	await collection.where({
		name:name,
		mobile:mobile
	}).update({
		third: {
			pause: dbCmd.remove(),
			enable:dbCmd.remove()
		}
	})
	
let res = 	await db.collection("students").where({
		name:name,
		mobile:mobile
	}).update({
		third: {
			year:year,
			exam:exam
		}
	})
	
	//返回数据给客户端
	return res
};
