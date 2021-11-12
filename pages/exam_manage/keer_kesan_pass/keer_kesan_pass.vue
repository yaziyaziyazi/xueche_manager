<template>
	<view>
		<view class="uni-header">
			<text space="emsp">各月某教练考试合格率及考试人数 表七</text>

			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies" @load="set"
					:where="`city == '${value_city}'`">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</view>
				</unicloud-db>
			</el-select>
			<el-select style="width: 120px;" v-model="value_coach" placeholder="请选择教练" @change="change_coach">
				<unicloud-db v-if="bool2" v-slot:default="{data, loading, error, options}" collection="coachs"
					field="name" :where="`company=='${value_company}'`" @load="handleLoad">
					<!-- {{data}} -->
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name+'教练'" :key="index"></el-option>
					</view>
				</unicloud-db>

			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
			</view>
			<view class="">
				<button type="primary" @click="navigateTo('./add_exam')"
					style="width: 55px;font-size: small;font-weight: 100;">新增</button>
			</view>
		</view>
		<view class="uni-container">

			<uni-table v-if="bool" border stripe style="width:1000px">
				<uni-tr>
					<uni-th align="center" style="width:20%;background-color: #f4f4f5;">科目</uni-th>
					<uni-th align="center" style="width:40%">科二</uni-th>
					<uni-th align="center" style="width:40%">科三</uni-th>
				</uni-tr>
				<!--  -->
				<uni-tr class="btn" v-for="(item,index) in obj" :key="index">
					<uni-td v-if="item.keer" align="center" style="width: 50px;background-color: #f4f4f5;">
						{{item.keer.exam}}
					</uni-td>
					<uni-td v-if="item.kesan" align="center" style="width: 50px;background-color: #f4f4f5;">
						{{item.kesan.exam}}
					</uni-td>

					<uni-th align="center">
						<uni-table border stripe style="" v-if="item.keer">
							<uni-td align="center" style="width: 50%;background-color: #f4f4f5;font-size: large;">
								<text>{{item.name}}</text>
							</uni-td>
							<uni-td align="center" class="juzhong">
								<button v-if="item.keer.enable== undefined" type="primary" style=""
									@click="input(item.name,1,1)">通过</button>
								<button v-if="item.keer.enable== undefined" type="warn" style=""
									@click="input(item.name,0,1)">不通过</button>
								<button v-if="item.keer.enable==1" type="primary" disabled style=""
									@click="input(item.name,1,1)">通过</button>
								<button v-if="item.keer.enable==0" type="warn" disabled style=" "
									@click="input(item.name,0,1)">不通过</button>
							</uni-td>
						</uni-table>
					</uni-th>
					<uni-th align="center">
						<uni-table border stripe style="" v-if="item.kesan">
							<uni-td align="center" style="width:50%;background-color: #f4f4f5;font-size: large;">
								<text>{{item.name}}</text>
							</uni-td>
							<!-- margin-right: 20px;margin-right: 20px; margin-right: 20px;  margin-right: 20px;-->
							<uni-td align="center" class="juzhong">
								<button v-if="item.kesan.enable == undefined" type="primary" style=""
									@click="input(item.name,1,2)">通过</button>
								<button v-if="item.kesan.enable == undefined" type="warn" style=" "
									@click="input(item.name,0,2)">不通过</button>
								<button v-if="item.kesan.enable==1" type="primary" disabled style=" "
									@click="input(item.name,1,2)">通过</button>
								<button v-if="item.kesan.enable==0" type="warn" disabled style=""
									@click="input(item.name,0,2)">不通过</button>
							</uni-td>
						</uni-table>
					</uni-th>
				</uni-tr>

			</uni-table>

		</view>
	</view>


</template>

<script>
	import {
		enumConverter
	} from '../../../js_sdk/validator/students.js';

	const db = uniCloud.database()
	const dbCmd = db.command;
	export default {
		data() {
			return {
				value_month: '',
				value_coach: '',
				query: '',
				where: '',
				obj: [],
				cout: [],
				day: '',
				time: '',
				coach: '',
				month: '',
				param: {},
				name: '',
				value_city: '',
				year: '',
				value_company: '',
				value_year: '',
				bool: true,
				bool2: false,
			}
		},
		computed: {

		},
		onLoad() {
			const value = uni.getStorageSync('city')
			this.value_city = value
			var myDate = new Date;
			this.value_month = myDate.getMonth() + 1 + "月"
		},
		methods: {
			set(data, ended, pagination) {
				this.value_company = data[0].name
				this.bool2 = true
			},
			handleLoad(data, ended, pagination) {
				if (data[0]) {
					this.value_coach = data[0].name + "教练"
					this.students()
					this.$nextTick(() => {
						this.bool = true
					})
				}



			},

			costPlannedAmountChange(value) {

				this.bool = false
				this.value_year = value

				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},
			change_company() {
				this.value_coach = ''
				this.bool = false

			},
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
			input(name_val, bool, item) {
				if (item == 1) {
					db.collection("students").where({
							name: name_val
						}).update({
							second: {
								enable: bool
							}
						})
						.then((res) => {
							uniCloud.callFunction({
								name: "update_pass",
								data: {
									name: name_val
								},
								success: (res) => {
									console.log(res)
								},
								fail: () => {
									console.log(res)
								}
							})

							uni.showToast({
								title: '新增成功'
							})
							this.$router.go(0);
						})
						.catch((err) => {
							uni.showModal({
								content: err.message || '新增失败',
								showCancel: false
							})
						})
				}
				if (item == 2) {
					db.collection("students").where({
							name: name_val
						}).update({
							third: {
								enable: bool

							}
						})
						.then((res) => {
							uniCloud.callFunction({
								name: "update_pass",
								data: {
									name: name_val
								},
								success: (res) => {
									// console.log(res)
								},
								fail: () => {
									console.log(res)
								}
							})

							uni.showToast({
								title: '新增成功'
							})
							this.$router.go(0);

						})
						.catch((err) => {
							uni.showModal({
								content: err.message || '新增失败',
								showCancel: false
							})
						})
				}
			},
			reflesh() {


			},
			change_month() {
				this.bool = false
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},
			change_coach() {
				this.bool = false
				this.$nextTick(() => {
					this.bool = true
				})
				this.students()
			},

			students() {
				db.collection("students").get()
					.then((res) => {
						this.scoll(res)
					})
			},
			scoll(res) {
				this.obj = []

				for (var i = 0; i < res.result.data.length; i++) {

					this.name = res.result.data[i].name
					this.coach = res.result.data[i].coach + '教练'
					if (typeof(res.result.data[i].second) != 'undefined') {
						if (typeof(res.result.data[i].second.exam) != 'undefined') {
							if (this.value_coach != '') {
								if (this.value_month != '') {
									if (this.value_year != '') {
										if (this.coach == this.value_coach) {
											this.time = res.result.data[i].second.exam
											this.year = res.result.data[i].second.year
											var month1 = this.time.match(/(\S*)月/)[1] + "月"

											if (this.year == this.value_year) {
												if (this.value_month == month1) {
													var param = {};
													param.name = res.result.data[i].name;
													param.keer = res.result.data[i].second;
													this.obj.push(param);
												}
											}
										}
									}
								}
							}
						}
					}
					if (typeof(res.result.data[i].third) != 'undefined') {
						if (typeof(res.result.data[i].third.exam) != 'undefined') {
							if (this.value_coach != '') {
								if (this.value_month != '') {
									if (this.value_year != '') {
										if (this.coach == this.value_coach) {
											this.time = res.result.data[i].third.exam
											this.year = res.result.data[i].third.year
											var month2 = this.time.match(/(\S*)月/)[1] + "月"
											if (this.year == this.value_year) {
												if (this.value_month == month2) {
													var param = {};
													param.name = res.result.data[i].name;
													param.kesan = res.result.data[i].third;
													this.obj.push(param);
												}
											}
										}
									}
								}
							}
						}
					}


				}
				this.test2()
			},
			test2() {

				this.obj = this.selectionSort(this.obj)

			},
			selectionSort(arr) {
				var len = arr.length;
				var minIndex, temp;
				for (var i = 0; i < len - 1; i++) {
					minIndex = i;


					for (var j = i + 1; j < len; j++) {
						if (arr[j].kesan != undefined && arr[minIndex].keer != undefined) {
							if (Number(arr[j].kesan.exam.match(/月(\S*)号/)[1]) < Number(arr[minIndex].keer.exam.match(
									/月(\S*)号/)[1])) { // 寻找最小的数
								minIndex = j; // 将最小数的索引保存
							}
						}
						if (arr[j].keer != undefined && arr[minIndex].keer != undefined) {
							if (Number(arr[j].keer.exam.match(/月(\S*)号/)[1]) < Number(arr[minIndex].keer.exam.match(
									/月(\S*)号/)[1])) { // 寻找最小的数
								minIndex = j; // 将最小数的索引保存
							}
						}
						if (arr[j].keer != undefined && arr[minIndex].kesan != undefined) {

							if (Number(arr[j].keer.exam.match(/月(\S*)号/)[1]) < Number(arr[minIndex].kesan.exam.match(
									/月(\S*)号/)[1])) { // 寻找最小的数
								minIndex = j; // 将最小数的索引保存
							}

						}
						if (arr[j].kesan != undefined && arr[minIndex].kesan != undefined) {


							if (Number(arr[j].kesan.exam.match(/月(\S*)号/)[1]) < Number(arr[minIndex].kesan.exam.match(
									/月(\S*)号/)[1])) { // 寻找最小的数
								minIndex = j; // 将最小数的索引保存
							}

						}
					}
					temp = arr[i];
					arr[i] = arr[minIndex];
					arr[minIndex] = temp;
				}
				return arr;
			},

			deletefunc(totalList) {
				var temp = [] //一个新的临时数组
				for (var i = 0; i < totalList.length; i++) {
					if (temp.indexOf(totalList[i]) == -1) {
						temp.push(totalList[i])
					}
				}
				return temp
			}
		},
	}
</script>
<style scoped>
	.juzhong {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn button {
		font-size: small;
		padding: 0px;
		width: 55px;
		display: inline-block;
		font-weight: 100;
	}

	/* // uni-table { */
	/deep/ .uni-table-loading {
		display: none !important;
	}

	/deep/.uni-table-td {
		vertical-align: middle;
	}

	/* // } */

	.time {
		background-color: #e3e3e3;
	}

	.morning {
		background-color: #ebeff6;
		/* z-index: 9; */
	}

	.afternoon {
		background-color: #e5ffe4;
	}

	.evening {
		background-color: #fffeed;
	}

	.top {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 2;
	}

	.sticky {

		position: -webkit-sticky;
		position: sticky;
		left: 0;
		z-index: 1;
	}

	.el-dropdown {
		vertical-align: top;
	}

	.el-dropdown+.el-dropdown {
		margin-left: 15px;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>
