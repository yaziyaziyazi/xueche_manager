<template>
	<view>
		<view class="uni-header">
			<text space="emsp">月度各教练考试合格率及考试人数  表三</text>
			
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>

			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<el-option v-for="(item,index) in company" :value="item" :key="index">
				</el-option>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
	

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}"  @load="handleLoad"
				:where="`company == '${value_company}'`" collection="coachs">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe style="width:1000px">
						<uni-tr style="background-color: rgba(0,0,0,.1);">
							<uni-th align="center" style="width:10%;">教练</uni-th>

							<uni-th align="center" style="width:20%">科一</uni-th>
							<uni-th align="center" style="width:35%">科二</uni-th>
							<uni-th align="center" style="width:35%">科三</uni-th>

						</uni-tr>
						<uni-tr>
							<uni-td align="center" style=""></uni-td>
							<uni-td align="center">考试人数</uni-td>
							<uni-td align="center">
								<uni-table border stripe style="">
									<uni-td align="center" style="width: 50%;">
										<text>考试人数</text>
									</uni-td>
									<uni-td align="center" class="juzhong">
										<text>及格率</text>
									</uni-td>
								</uni-table>
							</uni-td>
							<uni-td align="center">
								<uni-table border stripe style="">
									<uni-td align="center" style="width: 50%;">
										<text>考试人数</text>
									</uni-td>
									<uni-td align="center" class="juzhong">
										<text>及格率</text>
									</uni-td>
								</uni-table>
							</uni-td>
						</uni-tr>
						<uni-tr v-for="(item,index) in data" :key="index">

							<uni-td align="center">{{item.name}}</uni-td>
							
							<uni-td v-if="!item.keyi_exam_sum" align="center">0</uni-td>
							<uni-td v-else align="center">{{item.keyi_exam_sum}}</uni-td>
							<uni-td align="center">
								<uni-table border stripe style="">
									<uni-td align="center" style="width: 50%;">
										<text v-if="!item.keer_exam_sum">0</text>
										<text v-else-if="item.keer_exam_sum=='NaN'">0</text>
										<text v-else>{{item.keer_exam_sum}}</text>
									</uni-td>
									<uni-td align="center" class="juzhong">
										<text v-if="!item.keer_rate"></text>
										<text v-else-if="item.keer_rate=='NaN'">0</text>
										<text v-else>{{item.keer_rate*100}}%</text>
									</uni-td>
								</uni-table>
							</uni-td>

							<uni-td align="center">
								<uni-table border stripe style="">
									<uni-td align="center" style="width: 50%;">
										<text v-if="!item.kesan_exam_sum">0</text>
										<text v-else-if="item.kesan_exam_sum=='NaN'">0</text>
										<text v-else>{{item.kesan_exam_sum}}</text>
									</uni-td>
									<uni-td align="center" class="juzhong">
										<text v-if="!item.keer_rate"></text>
										<text v-else-if="item.kesan_rate=='NaN'">0</text>
										
										<text v-else>{{item.kesan_rate*100}}%</text>
									</uni-td>
								</uni-table>
							</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</unicloud-db>
			<view class="" style="margin-top: 50px;" v-if="bool">
				<text>科一 考试总人数：</text>
				<text space="emsp" v-if="keyi_total">{{keyi_total}}</text>
				<text v-else>0</text>
				
			</view>
			<view class="" style="margin-top: 30px;" v-if="bool">
				<text>科二	考试总人数：</text>
				<text space="emsp" v-if="keer_total">{{keer_total}}&nbsp;及格率：</text>
				<text v-else>0&nbsp;及格率：</text>
				
				<text v-if="keer_total_rate=='NaN'">0</text>
				<text v-else>{{keer_total_rate*100}}%</text>
			</view>
			<view class="" style="margin-top: 30px;" v-if="bool">
				<text>科三	考试总人数：</text>
				<text space="emsp" v-if="kesan_total">{{kesan_total}}&nbsp;及格率：</text>
				<text v-else>0&nbsp;及格率：</text>
				
				<text v-if="kesan_total_rate=='NaN'">0</text>
				<text v-else>{{kesan_total_rate*100}}%</text>
			</view>
			
		</view>
	</view>


</template>

<script>
	import {
		enumConverter
	} from '../../../js_sdk/validator/students.js';

	const db = uniCloud.database()


	export default {
		data() {
			return {
				n: '0',
				coach: [],
				company: [],
				obj: [],
				value_month: '',
				value_company: '',
				query: '',
				where: '',
				keyi_total:'',
				keer_total:'',
				keer_total_rate:'',
				kesan_total:'',
				kesan_total_rate:'',
				time: '',
				month: '',
				name: '',
				value_year:'',
				value_city:'',
				bool: false
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.index){
				console.log(option.index)
			this.value_company =	option.index 
			}
		},
		created() {
			const value = uni.getStorageSync('city')
			this.value_city = value
			var myDate = new Date;
			this.value_month=myDate.getMonth()+1+"月"
			this.change_content()
		},
		methods: {
			handleLoad(data, ended, pagination) {
				this.keyi_total = 0
				this.keer_total =0
				this.kesan_total =0
				this.keer_total_rate =0
				this.kesan_total_rate =0
				let num1 =0
				let num2 =0
			  for(var i=0;i<data.length;i++){
				  this.keyi_total = Number(this.keyi_total)+Number(data[i].keyi_exam_sum)
				this.keer_total = Number(this.keer_total)  + Number(data[i].keer_exam_sum)
				this.kesan_total = Number(this.kesan_total)  + Number(data[i].kesan_exam_sum)
				if(data[i].keer_rate!="NaN"){
					this.keer_total_rate = Number(this.keer_total_rate)  + Number(data[i].keer_rate)
					num1++
				}
				if(data[i].kesan_rate!="NaN"){
					this.kesan_total_rate = Number(this.kesan_total_rate)  + Number(data[i].kesan_rate)
					num2++
				}

			  }
			  this.keer_total_rate = (this.keer_total_rate / num1).toFixed(4)
			  this.kesan_total_rate = (this.kesan_total_rate / num2).toFixed(4)
			},
			costPlannedAmountChange(value) {
				// console.log(value)
				this.bool = false
				this.value_year = value
				this.change_month()
			},
			show() {
				this.n = '0'
				return new Promise((resolve, reject) => {
					//你的逻辑代码
					db.collection("students").field("coach")
						.get()
						.then((res) => {
							// console.log(res)
							for (var i = 0; i < res.result.data.length; i++) {
								this.coach[i] = res.result.data[i].coach
							}
							this.coach = this.deletefunc(this.coach)

							for (var i = 0; i < this.coach.length; i++) {
								// console.log()
								uniCloud.callFunction({
									name: "coach_passing_rate",
									data: {
										coach: this.coach[i],
										month: this.month,
										year: this.value_year
									}
								}).then(res => {
									// console.log(res)

									if (res.success == true) {
										this.n++
										if (this.n == this.coach.length) {
											this.test()
										}
										// console.log(this.n)
									}
								})

							}
						})
					resolve( /* 这里是需要返回的数据 */ )

				});
			},



			change_content() {

				db.collection("companies").where({
					'city':this.value_city
				})
					.get()
					.then((res) => {
						if(this.value_company ==''){
							this.value_company=res.result.data[0].name
						}
						
						for (var i = 0; i < res.result.data.length; i++) {
							this.company[i] = res.result.data[i].name
						}
						this.company = this.deletefunc(this.company)
						// console.log(this.city)
					})
			},
			deletefunc(totalList) {
				var temp = [] //一个新的临时数组
				for (var i = 0; i < totalList.length; i++) {
					if (temp.indexOf(totalList[i]) == -1) {
						temp.push(totalList[i])
					}
				}
				return temp
			},
			test() {
				return new Promise((resolve, reject) => {
					//你的逻辑代码
					var that = this

					// setTimeout(function() {
					that.bool = true
					// console.log("zzzzzzzzzzzzzzzz")

					// }, 1000)

					resolve( /* 这里是需要返回的数据 */ )
				});
			},
			change_month() {

				this.bool = false
				// })
				// this.$nextTick(() => {
				if (this.value_month != '' & this.value_year != '') {
					this.month = this.value_month.match(/(\S*)月/)[1]
					// console.log(this.month)
					this.show()
				}



			},

			change_company() {
				
			},

		},
	}
</script>
<style scoped>
	/deep/ .uni-table-loading {
		display: none !important;
	}

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
