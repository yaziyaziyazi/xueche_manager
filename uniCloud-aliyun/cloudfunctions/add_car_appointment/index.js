'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
exports.main = async (event, context) => {
	let month = event.month || event.queryStringParameters.month
	let day = event.day || event.queryStringParameters.day
	let time = event.time || event.queryStringParameters.time
	let year = event.name || event.queryStringParameters.year
	let name = event.name || event.queryStringParameters.name

	name = name.replace(/^\s+|\s+$/g, "")
	const collection = db.collection('car_appointment')
	let res = await collection
		.add({
			name: name,
			data: {
				year: year,
				month: month,
				day: day,
				time: time
			}

		})

	await db.collection("students").where({
		name: name
	}).update({
		first: {
			pause: dbCmd.remove()
		},
		second: {
			pause: dbCmd.remove()
		},
		third: {
			pause: dbCmd.remove()
		}
	})

	await db.collection("students").where({
		name: name,
		first: {
			enable: dbCmd.eq('1')
		},
		second: {
			enable: dbCmd.neq('1')
		}
	}).update({
		second: {
			studied: dbCmd.inc(1)
		}
	})
	await db.collection("students").where({
		name: name,
		second: {
			enable: dbCmd.eq('1')
		},
		third: {
			enable: dbCmd.neq('1')
		}
	}).update({
		third: {
			studied: dbCmd.inc(1)
		}
	})
	//返回数据给客户端
	return res
};
