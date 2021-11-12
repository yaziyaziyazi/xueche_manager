'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	let jiaxiao = event.jiaxiao || event.queryStringParameters.jiaxiao
	let month = event.month || event.queryStringParameters.month
	let year = event.year || event.queryStringParameters.year
	const collection = db.collection('students')
	let res = await collection.get()
	let keer = 0
	var num1 = 0;
	let keer_rate = 0
	let keer_sum = 0
	
	let students_sum = 0
	
	for (var i = 0; i < res.data.length; i++) {
		if (jiaxiao == res.data[i].company) {
			if (year == res.data[i].application_time.year && month == res.data[i].application_time.month) {
				students_sum++
			}
		}
	}

	for (var i = 0; i < res.data.length; i++) {

		if (jiaxiao == res.data[i].company) {
			if (res.data[i].first != undefined) {
				if (res.data[i].first.enable == '1') {
					if (res.data[i].second == undefined) {
						var month1 = res.data[i].first.exam.match(/(\S*)月/)[1]
						if (year == res.data[i].first.year) {
							if (Number(month1) <= Number(month)) {
								keer_sum++;
							}
						}
						if (year > res.data[i].first.year) {
							keer_sum++;
						}

					} else {
						if (res.data[i].second.exam == undefined) {
							continue
						}
						var month2 = res.data[i].second.exam.match(/(\S*)月/)[1]

						if (res.data[i].second.enable == '1') {

						} else {
							if (year == res.data[i].second.year) {
								if (Number(month2) <= Number(month)) {
									keer_sum++;
								}
							}
							if (year > res.data[i].second.year) {
								keer_sum++;
							}
						}
						if (res.data[i].second.enable != undefined) {
							if (year >= res.data[i].second.year) {
								keer++;
								num1 += Number(res.data[i].second.enable)
							}


						}
					}
				}
			}
		}
	}


	keer_rate = (num1 / keer).toFixed(4)
	if(Number.isNaN(num1 / keer)){
		keer_rate=0
	}

	let kesan = 0
	var num2 = 0
	let kesan_rate = 0
	let kesan_sum = 0
	for (var i = 0; i < res.data.length; i++) {
		if (jiaxiao == res.data[i].company) {
			if (res.data[i].first != undefined) {
				if (res.data[i].second != undefined) {
					if (res.data[i].first.enable == '1' && res.data[i].second.enable == '1') {
						var month3 = res.data[i].second.exam.match(/(\S*)月/)[1]
						if (res.data[i].third == undefined) {
							if (year == res.data[i].second.year) {
								if (Number(month3) <= Number(month)) {
									kesan_sum++;
								}
							}
							if (year > res.data[i].second.year) {
								kesan_sum++;

							}



						} else {
							if (res.data[i].third.exam == undefined) {
								continue
							}
							var month4 = res.data[i].third.exam.match(/(\S*)月/)[1]

							if (res.data[i].third.enable == '1') {

							} else {
								if (year == res.data[i].third.year) {
									if (Number(month4) <= Number(month)) {
										kesan_sum++;
									}
								}
								if (year > res.data[i].third.year) {
									kesan_sum++;

								}


							}

							if (res.data[i].third.enable != undefined) {
								if (year >= res.data[i].third.year) {
									kesan++;
									num2 += Number(res.data[i].third.enable)
								}


							}

						}
					}
				}

			}

		}

	}
	kesan_rate = (num2 / kesan).toFixed(4)
	if(Number.isNaN(num2 / kesan)){
		kesan_rate=0
	}

	res = {
		company: {
			name: jiaxiao,
			rate: {
				month: month,
				keer_rate: keer_rate,
				keer_sum: keer_sum,
				kesan_rate: kesan_rate,
				kesan_sum: kesan_sum
			}
		}
	}

	await db.collection("companies").where({
		name: jiaxiao
	}).update({
		month: month,
		keer_rate: keer_rate,
		keer_sum: keer_sum,
		kesan_rate: kesan_rate,
		kesan_sum: kesan_sum,
		students_sum:students_sum
	})

	return res
	// return event
};
