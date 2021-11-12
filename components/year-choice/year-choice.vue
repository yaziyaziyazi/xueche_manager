<template>
	<view >
		<el-select  v-model="year" placeholder="请选择年份" @change="yearChange" clearable>
			<el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
	</view>
</template>

<script>
	export default {
		name:"yearChoice",
		props:{
			begin:{
				type:Number,
				required:false,
				default:20
			},
			finish:{
				type:Number,
				required:false,
				default:0
			}
		},
		data() {
			return {
				years: [],
				year:''
			};
		},
		created() {
			this.init()
		},
		methods:{
			init() {
				var myDate = new Date;
				var year = myDate.getFullYear(); //获取当前年
				this.year = year;
				this.initSelectYear(year)
			},
			initSelectYear(year) {
				this.years = [];
				for (let i = this.finish; i < this.begin; i++) {
					this.years.push({
						value: (year - i),
						label: (year - i) + "年"
					});
				}
				this.yearChange(year)
			},
			yearChange(value) {
				this.year = value
				this.$emit('change', this.year);
			},
	
		}
		
	}
</script>

<style>

</style>
