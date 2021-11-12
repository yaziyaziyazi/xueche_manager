'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const collection = db.collection('car_appointment')
	let res = await collection.where(
		{
			data: dbCmd.exists(true)
		}
	).get()
	//返回数据给客户端
	return res
};
