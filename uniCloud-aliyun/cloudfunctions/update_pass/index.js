'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let name = event.name || event.queryStringParameters.name
	
	let res1= await db.collection("students").where({
		name: name,
		first:{
			enable: dbCmd.eq('1')
		},
		second:{
			enable: dbCmd.neq('1')
		}
	}).update({
		second:{
			examined:dbCmd.inc(1)
		}
	})
	
	let res2 = await db.collection("students").where({
		name: name,
		second:{
			enable: dbCmd.eq('1')
		},
		third:{
			enable: dbCmd.neq('1')
		}
	}).update({
		third:{
			examined:dbCmd.inc(1)
		}
	})
	let res = {
		res1,res2
	}
	//返回数据给客户端
	return res
};
