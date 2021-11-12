'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	let coach = event.coach || event.queryStringParameters.coach
	let month = event.month || event.queryStringParameters.month
	let year = event.year || event.queryStringParameters.year
	// let company = event.company || event.queryStringParameters.company

	const collection = db.collection('students')
	let res = await collection.get()
	// let keer = 0
	// var num1 = 0;
	let students_sum = 0

	for (var i = 0; i < res.data.length; i++) {
		if (coach == res.data[i].coach) {
			if (year == res.data[i].application_time.year && month == res.data[i].application_time.month) {
				students_sum++
			}
		}
	}

	let keyi_sum = 0
	let keyi_exam_sum = 0
	// let keyi_pause_sum = 0
	for (var i = 0; i < res.data.length; i++) {
		if (coach == res.data[i].coach) {
			if (res.data[i].first != undefined) {
				if (res.data[i].first.exam != undefined) {
					var month1 = res.data[i].first.exam.match(/(\S*)月/)[1]
					if (year == res.data[i].first.year) {
						if (Number(month1) == Number(month)) {
							keyi_exam_sum++;
						}
					}
					if (res.data[i].first.enable != '1') {
						keyi_sum++
					}
				} else {
					if (res.data[i].first.pause != '1') {
						if (year >= res.data[i].first.year) {
							keyi_sum++
						}
						
						
					} else {
						// keyi_pause_sum++
					}
				}
			}
		}
	}

	let keer_sum = 0
	let keer_exam_sum = 0
	// let keer_pause_sum = 0
	let keer_rate = 0
	let num2 = 0
	for (var i = 0; i < res.data.length; i++) {
		if (coach == res.data[i].coach) {
			if (res.data[i].first != undefined) {
				if (res.data[i].first.enable == "1" && res.data[i].first.pause != "1") {
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

					}
					if (res.data[i].second != undefined) {
						if (res.data[i].second.exam == undefined) {
							if (res.data[i].second.pause == "1") {
								// keer_pause_sum++
							} else {
								if (year >= res.data[i].second.year) {
									keer_sum++
								}
								
								
							}
						}
						if (res.data[i].second.exam != undefined) {
							var month2 = res.data[i].second.exam.match(/(\S*)月/)[1]
							if (year == res.data[i].second.year) {
								if (Number(month2) == Number(month)) {
									keer_exam_sum++;
								}
							}


							if (res.data[i].second.enable != '1') {
								if (year == res.data[i].second.year) {
									if (Number(month2) <= Number(month)) {
										keer_sum++;
									}
								}
								if (year > res.data[i].second.year) {
									keer_sum++;
								}


							}
							if (res.data[i].second.enable == '1') {
								if (year == res.data[i].second.year) {
									if (Number(month2) == Number(month)) {
										num2++;
									}
								}


							}
						}
					}
				}
			}
		}
	}
	keer_rate = (num2 / keer_exam_sum).toFixed(4)
	if(Number.isNaN(num2 / keer_exam_sum)){
		keer_rate=0
	}

	var num3 = 0
	let kesan_rate = 0
	let kesan_sum = 0
	let kesan_exam_sum = 0


	for (var i = 0; i < res.data.length; i++) {
		if (coach == res.data[i].coach) {
			if (res.data[i].first != undefined) {
				if (res.data[i].second != undefined) {
					if (res.data[i].first.enable == '1' && res.data[i].second.enable == '1') {
						if (res.data[i].third == undefined) {
							var month3 = res.data[i].second.exam.match(/(\S*)月/)[1]
							if (year == res.data[i].second.year) {
								if (Number(month3) <= Number(month)) {
									kesan_sum++;
								}
							}
							if (year > res.data[i].second.year) {
								kesan_sum++;
							}



						}
						if (res.data[i].third != undefined) {
							if (res.data[i].third.exam == undefined) {
								if (res.data[i].third.pause != "1") {
									if (year > res.data[i].third.year) {
										kesan_sum++
									}
									
									
								}
							}
							if (res.data[i].third.exam != undefined) {
								var month4 = res.data[i].third.exam.match(/(\S*)月/)[1]
								if (year == res.data[i].third.year) {
									if (Number(month4) == Number(month)) {
										kesan_exam_sum++;
									}
								}


								if (res.data[i].third.enable != '1') {
									if (year >= res.data[i].third.year) {
										kesan_sum++
									}
									
									
								}
								if (res.data[i].third.enable == '1') {
									if (year == res.data[i].third.year) {
										if (Number(month4) == Number(month)) {
											num3++
										}
									}



								}
							}
						}
					}
				}
			}
		}
	}
	kesan_rate = (num3 / kesan_exam_sum).toFixed(4)
	if(Number.isNaN(num3 / kesan_exam_sum)){
		kesan_rate=0
	}

	res = {
		coach: {
			name: coach,
			rate: {
				month: month,
				keer_rate: keer_rate,
				keer_sum: keer_sum,
				keer_exam_sum: keer_exam_sum,
				kesan_rate: kesan_rate,
				kesan_sum: kesan_sum,
				kesan_exam_sum: kesan_exam_sum,
				students_sum: students_sum,
				keyi_exam_sum: keyi_exam_sum,
			}
		}
	}


	
		await db.collection("coachs").where({
				name: coach
			})
			.update({
				month: month,
				year: year,
				keer_rate: keer_rate,
				keer_sum: keer_sum,
				keer_exam_sum: keer_exam_sum,
				kesan_rate: kesan_rate,
				kesan_sum: kesan_sum,
				kesan_exam_sum: kesan_exam_sum,
				students_sum: students_sum,
				keyi_exam_sum: keyi_exam_sum,
				// company: company
			})
	



	return res

};
