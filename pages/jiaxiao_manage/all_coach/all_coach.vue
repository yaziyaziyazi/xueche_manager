<template>
	<view>
		<view class="uni-header">
			<text space="emsp">{{value_company}}公司及本公司各个教练  表十二</text>
			
			<year-choice style="width: 120px;" @change="costPlannedAmountChange($event)"></year-choice>
			<el-select  style="width: 120px;" v-model="value_month" placeholder="请选择月份" @change="change_month">
				<el-option v-for="(item,index) in 12" :value="(index+1)+'月'" :key="index"></el-option>
			</el-select>
			<el-select style="width: 120px;display: none;" v-model="value_city" placeholder="请选择城市" @change="change_city">
				<el-option v-for="(item,index) in city" :value="item" :key="index">
				</el-option>
			</el-select>
			<el-select  style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<unicloud-db v-if="bool2" v-slot:default="{data, loading, error, options}" collection="companies" :where="`city == '${value_city}'`"  @load="handleLoad">
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
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add_coachs?company='+value_company)">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" v-if="bool" v-slot:default="{data, loading, error, options}" :where="`company == '${value_company}'`"
				collection="coachs">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe style="width: 1250px;">
						<uni-tr style="background-color: rgba(0,0,0,.1);">
							<uni-th align="center">序号</uni-th>
							<uni-th align="center">编号</uni-th>
							<uni-th align="center">教练姓名</uni-th>
							<uni-th align="center">电话</uni-th>
							<uni-th align="center">报名人数</uni-th>
							<uni-th align="center">科二在学人数</uni-th>
							<uni-th align="center">科二考试人数</uni-th>
							<uni-th align="center">科二及格率</uni-th>
							<uni-th align="center">科三在学人数</uni-th>
							<uni-th align="center">科三考试人数</uni-th>
							<uni-th align="center">科三及格率</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(item,index) in data" :key="index">
							<uni-td align="center">{{index+1}}部</uni-td>
							<uni-td align="center">{{item.number}}</uni-td>
							<uni-td align="center">{{item.name}}</uni-td>
							<uni-td align="center">{{item.phone}}</uni-td>
							<uni-td align="center">{{item.students_sum}}</uni-td>
							<uni-td align="center">{{item.keer_sum}}</uni-td>
							<uni-td align="center">{{item.keer_exam_sum}}</uni-td>
							<uni-td align="center" v-if="!item.keer_rate">0</uni-td>
							<uni-td align="center" v-else>{{item.keer_rate*100}}%</uni-td>
							<uni-td align="center">{{item.kesan_sum}}</uni-td>
							<uni-td align="center">{{item.kesan_exam_sum}}</uni-td>
							<uni-td align="center" v-if="!item.kesan_rate">0</uni-td>
							<uni-td align="center" v-else>{{item.kesan_rate*100}}%</uni-td>
							<uni-td align="center"><button type="warn" @click="delete_coach(item)" size="mini">删除</button></uni-td>
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
				n: '0',
				value_city:'',
				coach: [],
				city: [],
				company: [],
				obj: [],
				value_month: '',
				value_company: '',
				value_year:'',
				query: '',
				where: '',
				time: '',
				month: '',
				name: '',
				bool: false,
				bool2:''
			}
		},
		computed: {

		},
		onLoad() {
			const value = uni.getStorageSync('city')
			this.value_city = value
			this.bool2=true
		},
		created() {
			var myDate = new Date;
			this.value_month=myDate.getMonth()+1+"月"
			this.change_content()
		},
		methods: {
			handleLoad(data, ended, pagination) {
				if(data[0]){
					this.value_company=data[0].name
				}
				
			},
			change_city(){
				this.bool2=false,
				this.bool=false
				this.value_company=''
				this.$nextTick(() => {
					this.bool2 = true
					// this.bool = true
				})
				this.change_month()
			},
			delete_coach(item) {
				db.collection("students").where({
						coach: item.name
					}).count()
					.then(res => {
						if(res.result.total>0){
							uni.showToast({
								icon:"error",
								title:"禁止删除，该教练有学员"
							})
						}
						if(res.result.total==0){
							this.$refs.udb.remove(item._id, {
							  action: '', // 删除前后的动作
							  confirmTitle: '提示', // 确认框标题
							  confirmContent: '确认是否删除该教练',  // 确认框内容
							  success: (res) => { // 删除成功后的回调
							    const { code, message } = res
								console.log(res)
							  },
							  fail: (err) => { // 删除失败后的回调
							    const { message } = err
								console.log(err)
							  },
							  complete: () => { // 完成后的回调
							  }
							})
						}
					}).catch(err => {
						console.error(err)
					})
			},
			costPlannedAmountChange(value) {
				this.bool = false
				this.value_year = value
				this.change_month()
			},
			navigateTo(url) { 
				uni.navigateTo({
					url
				})
			},
			async test3(){
				this.bool = false
				if(await this.show1()){
					this.bool = true
				}
			},
			async show1() {
				return new Promise((resolve, reject) => {
					db.collection("students").field("coach")
						.get()
						.then(async (res) => {
							for (var i = 0; i < res.result.data.length; i++) {
								this.coach[i] = res.result.data[i].coach
							}
							this.coach = this.deletefunc(this.coach)
							var i = 0;
							while (i < this.coach.length){
								if(await this.test2(i)){
									i++
								}
							}
							resolve(true)
						})
					});
			},
			async test2(i){
				return new Promise((resolve, reject) => {
								uniCloud.callFunction({
									name: "coach_passing_rate",
									data: {
										coach: this.coach[i],
										month: this.month,
										year:this.value_year
									}
								}).then(res => {
									resolve(res.success)
								})
							});
			},
			show() {
				this.n = '0'
					//你的逻辑代码
					db.collection("students").field("coach")
						.get()
						.then((res) => {
							for (var i = 0; i < res.result.data.length; i++) {
								this.coach[i] = res.result.data[i].coach
							}
							this.coach = this.deletefunc(this.coach)
							for (var i = 0; i < this.coach.length; i++) {
								uniCloud.callFunction({
									name: "coach_passing_rate",
									data: {
										coach: this.coach[i],
										month: this.month,
										year:this.value_year
									}
								}).then(res => {
									console.log(res)
									if (res.success == true) {
										this.n++
										if (this.n == this.coach.length) {
											this.bool=true
											
										}
										
									}
								})
							}
						})
			},

			change_content() {

				db.collection("companies")
					.get()
					.then((res) => {
						
						for (var i = 0; i < res.result.data.length; i++) {
							this.city[i] = res.result.data[i].city
						}
						this.city = this.deletefunc(this.city)
						
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
			change_month() {
				this.bool = false
				if(this.value_year!=''&&this.value_month!=''){
					this.month = this.value_month.match(/(\S*)月/)[1]
					// this.test3()
					this.show()
				}
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
