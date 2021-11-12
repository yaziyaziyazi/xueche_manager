<template>
	<view class="monthChange">
		<el-select v-model="month" placeholder="请选择月份"  @change="monthChange" clearable>
			<el-option v-for="item in months" :value="item.value" :label="item.label"  :key="item.value">
			</el-option>
		</el-select>
	</view>
</template>

<script>
	export default {
		name:"monthChange",
		props:{
			begin:{
				type:Number,
				required:false,
				default:12
			},
			finish:{
				type:Number,
				required:false,
				default:1
			},
			mode_after:{
				type:Boolean,
				required:false,
				default:false
			},
			mode_before:{
				type:Boolean,
				required:false,
				default:false
			}
		},
		data() {
			return {
				months:[],
				month:'',
				finish_val:'',
				begin_val:''
			};
		},
		created() {
			this.init()
		},
		methods:{
			mode_current_after(){
				var myDate = new Date;
				var month = myDate.getMonth()+1
				this.finish_val = month;
			},
			mode_current_before(){
				var myDate = new Date;
				var month = myDate.getMonth()+1
				this.begin_val = month;
			},
			init() {
				var myDate = new Date;
				var month = myDate.getMonth()+1
				this.month = month;
				this.begin_val=this.begin
				this.finish_val=this.finish
				if(this.mode_after){
					this.mode_current_after()
				}
				if(this.mode_before){
					this.mode_current_before()
				}
				this.initSelectYear(month)
			},
			initSelectYear(month) {
				this.months = [];
				for (let i = this.finish_val; i < this.begin_val+1; i++) {
					this.months.push({
						value: i,
						label: i + "月"
					});
				}
				this.monthChange(month)
			},
			monthChange(value) {
				this.month = value
				this.$emit('change', this.month);
			},
		}
	}
</script>

<style>

</style>
