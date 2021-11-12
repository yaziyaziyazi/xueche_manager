<template>
	<view>
		<view class="uni-header">
			<text space="emsp">科四学员  表九</text>
			<el-select  style="width: 120px;" v-model="value_company" placeholder="请选择驾校" @change="change_company">
				<el-option v-for="(item,index) in company" :value="item" :key="index">
				</el-option>
			</el-select>
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('./add_kesi_students')">新增</button>

			</view>
		</view>
		<view class="uni-container">
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" :where="sWhere"
				collection="students">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<uni-table border stripe style="width:1000px" emptyText="无此学员">
						<uni-tr>
							<uni-th align="center" style="width:20%;background-color: #f4f4f5;">序号</uni-th>

							<uni-th align="center" style="width:40%">姓名</uni-th>
							<uni-th align="center" style="width:40%">电话</uni-th>
							
						</uni-tr>
		
						<uni-tr v-for="(item,index) in data" :key="index">
							<uni-td align="center">{{index+1}}</uni-td>
							
							<uni-td align="center">{{item.name}}</uni-td>
	
							<uni-td align="center">{{item.mobile}}</uni-td>

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
				coach: [],
				company: [],
				obj: [],
				value_month: '',
				value_company: '',
				query: '',
				where: '',
				time: '',
				month: '',
				name: '',
				bool: false,
				sWhere: ''
			}
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
			this.change_content()
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
			tetete(){
				db.collection('students,coachs').get()
				.then((res)=>{
					console.log(res)
				})
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
										month: this.month
									}
								}).then(res => {
									console.log(res)

									if (res.success == true) {
										this.n++
										if (this.n == this.coach.length) {
											this.test()
										}
										console.log(this.n)
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
						
						this.change_company()
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
					console.log("zzzzzzzzzzzzzzzz")

					// }, 1000)

					resolve( /* 这里是需要返回的数据 */ )
				});
			},

			change_company() {
				this.bool = false
				this.sWhere = "company=='" + this.value_company+ "' &&( (third.enable == '1' &&second.enable == '1'&&first.enable=='1')||(fourth != undefined) )"
					
				// }) 
				this.$nextTick(() => {
					this.bool = true
					})


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
