<template>
	<view>
		<view class="uni-header">
			<text space="emsp">月度各部科一考试安排  表五</text>
			
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-slot:default="{data, loading, error, options}" collection="companies" @load="set" :where="`city == '${value_city}'`">
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index">
						</el-option>
					</view>
				</unicloud-db>
			</el-select>
			<el-select style="width: 120px;" v-model="value_coach" placeholder="请选择教练" @change="change_coach">
				<unicloud-db v-if="bool2"  v-slot:default="{data, loading, error, options}" collection="coachs" field="name"  @load="get"
					:where="`company=='${value_company}'`">
					<!-- {{data}} -->
					<view v-if="error">{{error.message}}</view>
					<view v-else>
						<el-option v-for="(item,index) in data" :value="item.name" :key="index"></el-option>
					</view>
				</unicloud-db>

			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add_keyi_exam')">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" @load="handleLoad"
				collection="students" :where="swhere" field="name,first,coach,company">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe style="width: 1000px;">
						<uni-tr>
							<uni-th align="center" style="width: 50%;"></uni-th>
							<uni-th align="center" style="width: 50%;">姓名</uni-th>
						</uni-tr>
						<uni-tr v-for="(n,index) in obj" :key="index">
							<uni-td align="center" v-if="obj.length!=0 " style="width: 50px;">{{n.first.exam}}</uni-td>
							<uni-td align="center">
								<text>{{n.name}}</text>
							</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</unicloud-db>




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
				obj: [],
				value_company: '',
				value_month: '',
				value_coach: '',
				where: '',
				value_city: '',
				look: '',
				day: '',
				time: '',
				coach: '',
				bool2:false,
				month: '',
				swhere: '',
				name: '',
				bool: false,
				value_year: ''
			}
		},

		onLoad(option) {
			const value = uni.getStorageSync('city')
			this.value_city = value
			var myDate = new Date;
			this.value_month=myDate.getMonth()+1+"月"
			if(option.index){
				
			this.value_coach =	option.index  
			}
		},
	
		methods: {
			get(data, ended, pagination){
					if(data[0]){
						if(this.value_coach ==''){
							this.value_coach=data[0].name
						}
						// this.value_coach=data[0].name
					this.change_coach()
					}
			},
			set(data, ended, pagination) {
				this.value_company=data[0].name
				 this.bool2=true
			},
			costPlannedAmountChange(value) {
				
				this.bool = false
				this.value_year = value
				this.change_coach()
			},
			navigateTo(url) { 
				uni.navigateTo({
					url
				})
			},
			selectionSort(arr) {
				var len = arr.length;
				var minIndex, temp;
				for (var i = 0; i < len - 1; i++) {
					minIndex = i;
					for (var j = i + 1; j < len; j++) {
						if (Number(arr[j].first.exam.match(/月(\S*)号/)[1]) < Number(arr[minIndex].first.exam.match(
								/月(\S*)号/)[1])) { // 寻找最小的数
							minIndex = j; // 将最小数的索引保存
						}
					}
					temp = arr[i];
					arr[i] = arr[minIndex];
					arr[minIndex] = temp;
				}
				return arr;
			},
			handleLoad(data, ended, pagination) {
				
				this.obj = []
				// console.log(data)
				for (var i = 0; i < data.length; i++) {
					if (data[i].first != undefined) {
						if (data[i].first.exam != undefined && data[i].first.enable == undefined) {
							if (data[i].first.year == this.value_year) {
								if (data[i].first.exam.match(/(\S*)月/)[1] + '月' == this.value_month) {
									this.obj.push(data[i])
								}
							}
						}
					}
				}
				// this.time = res.result.data[i].frist.exam
				this.obj = this.selectionSort(this.obj)
				// console.log(this.obj)
			},

			change_month() {
				this.bool = false
				this.change_coach()
			
			},
			change_company() {
				this.value_coach = ''
				
				this.change_coach()
			},
			change_coach() {
				this.bool = false
				this.swhere = "coach=='" + this.value_coach + "'"
				this.$nextTick(() => {
					this.bool = true
				})
				// this.students()
			},

			students() {
				var that = this
				uniCloud.callFunction({
					name: "car_appointment",
					success(res) {
						that.scoll(res)

					},
					fail(err) {
						console.log(err)
					}
				})
			},
			scoll(res) {
				for (var i = 0; i < res.result.data.length; i++) {

					this.name = res.result.data[i].name
					this.coach = res.result.data[i].coach + '教练'
					// if(res.result.data[i].frist.exam){
					// 	this.time = res.result.data[i].frist.exam
					// }
					if (typeof(res.result.data[i].frist) != 'undefined') {

						if (typeof(res.result.data[i].frist.exam) != 'undefined') {
							this.time = res.result.data[i].frist.exam
							if (this.coach == this.value_coach) {

								this.insert()
							}
						}
					}
				}
			},

			insert() {
				console.log("zzzzzzzzzzzzzz")

				if (this.value_month != '') {
					// console.log(this.$refs[this.time])
					// console.log(this.name)

					for (var i = 0; i < this.$refs[this.time].length; i++) {
						// console.log(this.$refs[this.time][i].$el.innerHTML)
						if (this.$refs[this.time][i].$el.innerHTML == "<span></span>") {
							this.$refs[this.time][i].$el.innerHTML = this.name
							return
						}
					}
				}
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
