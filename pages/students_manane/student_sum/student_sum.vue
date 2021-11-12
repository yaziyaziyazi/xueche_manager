<template>
	<view>
		<view class="uni-header">
			<text space="emsp">月度公司报名人数表 表一</text>
			<text></text>
			<yearChoice style="width: 120px;" @change="costPlannedAmountChange($event)"></yearChoice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies" @load="handleLoad"
					:where="`city == '${value_city}'`">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</view>
				</unicloud-db>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">


			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" @load="sum"
				:where="`company=='${value_company}'`" collection="coachs">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe>
						<uni-tr>
							<uni-th align="center">教练</uni-th>

							<uni-th align="center">报名人数</uni-th>

						</uni-tr>

						<uni-tr v-for="(item,index) in data" :key="index">

							<uni-td align="center">{{item.name}}</uni-td>

							<uni-td align="center">{{item.students_sum}}</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</unicloud-db>
			<view class="" style="margin-top: 50px;" v-if="bool">
				<text>{{value_company}} 报名总人数：</text>
				<text v-if="people_total">{{people_total}}</text>
				<text v-else>0</text>
			</view>

		</view>
	</view>


</template>

<script>
	import {
		enumConverter
	} from '../../../js_sdk/validator/students.js';
	import yearChoice from '../../../components/year-choice/year-choice'
	const db = uniCloud.database()


	export default {
		data() {
			return {
				people_total: '',
				n: '0',
				coach: [],
				company: [],
				obj: [],
				value_month: '',
				value_company: '',
				query: '',
				where: '',
				swhere: '',
				time: '',
				month: '',
				year: "",
				value_city: '',
				name: '',
				bool: false
			}
		},
		components: {
			yearChoice
		},
		computed: {

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
			this.value_month = myDate.getMonth() + 1 + "月"
		},
		methods: {
			sum(data, ended, pagination) {
				this.people_total = 0
				for (var i = 0; i < data.length; i++) {
					// console.log(data[i])
					this.people_total = Number(data[i].students_sum) + Number(this.people_total)
				}
			},
			handleLoad(data, ended, pagination) {
				if(this.value_company ==''){
					this.value_company=data[0].name
				}
				
				this.bool = true
			},
			costPlannedAmountChange(value) {
				this.bool = false
				this.year = value
				this.getSum()

			},
			getSum() {
				if (this.month != "" && this.year != "") {
					db.collection("coachs").get()
						.then(res => {
							// console.log(res)
							for (var i = 0; i < res.result.data.length; i++) {
								uniCloud.callFunction({
									name: "coach_passing_rate",
									data: {
										coach: res.result.data[i].name,
										year: this.year,
										month: this.month,
										company: res.result.data[i].company,
									},
									success: (res) => {
										// console.log(res)
										this.$nextTick(() => {
											this.bool = true
										})
									},
									fail: (err) => {
										console.log(err)
									},
									complete: () => {

									}
								})
							}
						})

				}

			},

			change_month() {

				this.bool = false

				this.month = this.value_month.match(/(\S*)月/)[1]
				this.getSum()

				// this.show()
			},

			change_company() {
				this.change_month()
			},

		},


	}
</script>
<style>
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
