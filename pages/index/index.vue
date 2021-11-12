<template>
	<view class="index">


		<scroll-view style="padding: 15px;box-sizing: border-box;">
			<uni-icons type="undo" size="30" color="white" class="back" v-if="bool_icon1" @click="back_icon1">
			</uni-icons>
			<uni-icons type="undo" size="30" color="white" class="back" v-if="bool_icon2" @click="back_icon2">
			</uni-icons>
			<view class="top_box">

				<text>{{title}}</text>


			</view>
			<unicloud-db v-if="bool" v-slot:default="{data, loading, error, options}" collection="companies"
				:where="`city == '${value_city}'`">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<view style="">
						<uni-grid v-if="bool_company" :column="3" :showBorder="false" :Boolean="false">
							<uni-grid-item v-for="(item,index) in data" :key="index"
								@click.native="company_get(item.name)">
								<view class="content">

									<view class="">
										<text>{{item.name}}</text>

									</view>
								</view>
							</uni-grid-item>
						</uni-grid>
						<uni-grid v-if="bool_coach" :column="3" :showBorder="false" :Boolean="false">
							<uni-grid-item v-for="(item,index) in coach_list" :key="index"
								@click.native="coach_get(item.name)">
								<view class="content">

									<view class="">
										<text>{{item.name}}</text>
									</view>
								</view>
							</uni-grid-item>
						</uni-grid>
						<uni-grid v-if="bool_coach" :column="3" :showBorder="false" :Boolean="false">
							<uni-grid-item
								@click.native="navigateTo('/pages/students_manane/student_sum/student_sum?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}报名人数</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/studying_manage/keer_kesan_studying/keer_kesan_studying?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}科二科三在学人数</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/exam_manage/rate_sum/rate_sum?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}月度各教练考试合格率及考试人数</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/car_appointment/car_appointment?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}学员约车表</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/students_manane/pause_exam/pause_exam?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}暂时不考学员</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/students_manane/kesi_students/kesi_students?index='+value_company)">
								<view class="content">
									<view class="">
										<text>{{value_company}}科四学员</text>
									</view>
								</view>
							</uni-grid-item>
						</uni-grid>
						<uni-grid v-if="bool_info" :column="3" :showBorder="false" :Boolean="false">
							<uni-grid-item
								@click.native="navigateTo('/pages/students_manane/sign_up_coach_sum/sign_up_coach_sum?index='+value_coach)">
								<view class="content">

									<view class="">
										<text>月度报名人数</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/exam_manage/keyi_exam_arrange/keyi_exam_arrange?index='+value_coach)">
								<view class="content">

									<view class="">
										<text>月度科一考试安排</text>
									</view>
								</view>
							</uni-grid-item>
							<uni-grid-item
								@click.native="navigateTo('/pages/studying_manage/studied_examined/studied_examined?index='+value_coach)">
								<view class="content">

									<view class="">
										<text>科二科三在学表</text>
									</view>
								</view>
							</uni-grid-item>
						</uni-grid>
					</view>
				</view>
			</unicloud-db>

		</scroll-view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	import {
		version
	} from '../../package.json'
	export default {
		data() {
			return {
				title: '学车在线后台管理系统',
				value_city: '',
				n: '0',
				city: [],
				company: [],
				obj: [],
				value_month: '',
				where: '',
				time: '',
				coach: '',
				month: '',
				value_year: '',
				year: '',
				name: '',
				bool: false,
				coach_list: [],
				value_company: '',
				value_coach: '',
				bool_company: true,
				bool_coach: false,
				bool_info: false,
				bool_icon1: false,
				bool_icon2: false,
			}
		},
		onLoad() {


		},
		activated() {
			/** 执行页面数据刷新的方法 */
			// this.$router.go(0)
			// reload();
		},

		created() {
			var value = uni.getStorageSync('city')
			this.value_city = value
			console.log(this.value_city)
			var myDate = new Date;
			this.value_month = myDate.getMonth() + 1
			this.value_year = myDate.getFullYear()
			this.change_content()
			// location.reload()
			// this.$router.go(0)
		},
		methods: {
			back_icon1() {
				this.title = '学车在线后台管理系统'
				this.bool_icon = false
				this.bool_coach = false
				this.bool_company = true
				this.bool_icon1 = false

			},
			back_icon2() {
				this.title = this.value_company
				this.bool_info = false
				this.bool_coach = true
				this.bool_icon2 = false
				this.bool_icon1 = true
			},
			coach_get(coach) {
				this.bool_coach = false
				this.bool_info = true
				this.title = coach
				this.value_coach = coach
				this.bool_icon1 = false
				this.bool_icon2 = true
			},
			company_get(company) {
				this.value_company = company
				db.collection("coachs")
					.where({
						company: company
					}).get()
					.then(res => {
						this.coach_list = res.result.data
						console.log(this.coach_list)
						this.title = company
						this.bool_company = false
						this.bool_icon1 = true
						this.bool_coach = true
					})
			},
			navigateTo(url) {
				console.log("zzzzz")
				uni.navigateTo({
					url
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
						this.show()

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
			show() {
				this.bool = false
				return new Promise((resolve, reject) => {
					//你的逻辑代码
					db.collection("students").field("company")
						.get()
						.then((res) => {
							for (var i = 0; i < res.result.data.length; i++) {
								this.company[i] = res.result.data[i].company
							}
							this.company = this.deletefunc(this.company)
							for (var i = 0; i < this.company.length; i++) {
								uniCloud.callFunction({
									name: "company_passing_rate",
									data: {
										jiaxiao: this.company[i],
										month: this.value_month,
										year: this.value_year
									}
								}).then(res => {
									if (res.success == true) {
										this.bool = true
									}
								}).catch(err => {
									console.log(err)
								})
							}
						})
					resolve( /* 这里是需要返回的数据 */ )

				});
			},
		}
	}
</script>

<style scoped>
	.index{
		/* padding-top: 85px; */
		width: 100%;
		height: 100%;
		background-image: url(../../static/index.jpg);
		background-repeat: no-repeat;
		/*不平埔*/
		background-position: 50% 50%;
		/*居中*/
		background-size: 100%;
		/*背景图片大小*/
		overflow-y: scroll;
	}
	page{
		width: 100%;
		height: 100%;
	}
	.top_box {
		/* background-color: #3A8EE6; */
		height: 100px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 40px;
		margin-top: 20px;
		font-weight: 400;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}


	/deep/.uni-grid-wrap {
		width: 100%;
		/* background-color: #b9ffc7; */

	}

	/deep/.uni-grid {
		align-items: center;
		justify-content: center;
		margin-bottom: 100px;

	}

	/deep/.uni-grid-item {
		width: 220px !important;
		height: 120px !important;
		padding: 20px;
		/* margin: 50px; */
		/* border-radius: 5%; */
		border: 1px solid #c8c8c8;
		background-color: #FFFFFF;
	}

	.content {
		font-size: 20px;
		font-weight: 400;

		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back {
		position: absolute;
		top: 50px;
		left: 100px;
	}
</style>
