<template>
	<scroll-view class="sidebar" scroll-y="true" style="background-color:  rgb(47, 64, 85);">
		<view class="top_title">
			<text style="color: #FFFFFF;font-size: 20px;">后台管理</text>
		</view>
		<uni-data-menu ref="menu" style="color: white;" collection="opendb-admin-menus" :page-size="500" :field="field"
			orderby="sort asc" active-text-color="#409eff !important" @select="select">
			<!-- <uni-menu-sidebar :data="staticMenu"></uni-menu-sidebar> -->
		</uni-data-menu>

		<!-- <uni-nav-menu :uniqueOpened="true" :active="splitFullPath(active)" activeKey="url" textColor="#666" activeTextColor="#409eff" @select="select">
			<uni-menu-sidebar :data="navMenu"></uni-menu-sidebar>
			<uni-menu-sidebar :data="staticMenu"></uni-menu-sidebar>
		</uni-nav-menu> -->
	</scroll-view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	export default {
		data() {
			return {
				...config.sideBar,
				defaultValue: '',
				current: '',
				field: 'url as value, name as text, menu_id, parent_id, sort, icon, permission'
			}
		},
		computed: {
			...mapState('app', ['inited', 'navMenu', 'active']),
			...mapState('user', ['userInfo'])
		},
		// #ifdef H5
		watch: {
			$route: {
				immediate: true,
				handler(newRoute, oldRoute) {
					if (newRoute.fullPath !== (oldRoute && oldRoute.fullPath)) {
						this.changeMenuActive(newRoute.fullPath)
					}
				}
			},
			// navMenu(val) {
			// 	if (val.length) return
			// 	let content
			// 	if (this.userInfo.role.indexOf('admin') !== -1) {
			// 		content = '菜单表中没有数据，请对 db_init.json 文件右键，初始化数据库'
			// 	} else {
			// 		content = '该用户未被授权访问任何菜单表中的菜单,请使用管理员账户为该用户赋权,可在权限管理、角色管理、菜单管理中操作,详见uniCloud admin文档'
			// 	}
			// 	setTimeout(() => {
			// 		uni.showModal({
			// 			title: '提示',
			// 			showCancel: false,
			// 			content: content
			// 		})
			// 	}, 16)
			// }
			userInfo: {
				immediate: true,
				handler(newVal, oldVal) {
					if (newVal) {
						this.$nextTick(function() {
							this.$refs.menu.load()
						})
					}
				}
			}
		},
		// #endif
		methods: {
			...mapActions({
				changeMenuActive: 'app/changeMenuActive'
			}),
			select(e) {
				let url = e.value

				if (!url) {
					url = this.active
				}
				this.clickMenuItem(url)
			},
			clickMenuItem(url) {
				// #ifdef H5
				if (url.indexOf('http') === 0) {
					return window.open(url)
				}
				// #endif

				// url 开头可用有 / ，也可没有
				if (url[0] !== '/' && url.indexOf('http') !== 0) {
					url = '/' + url
				}
				// TODO 后续要调整
				uni.redirectTo({
					url: url,
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '页面 ' + url + ' 跳转失败',
							showCancel: false
						})
					}
				})
			},
			splitFullPath(path) {
				if (!path) path = '/'
				return path.split('?')[0]
			},
		}
	}
</script>

<style scoped lang="scss">
	.top_title{
		height: 56px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/deep/.pointer {
		
	}
	/deep/.uni-menu-item {
		// background-color: #007AFF;
		  
	}
	/deep/.uni-menu-item:hover{
		background-color: #2b394a ;
		
	}
	::-webkit-scrollbar {
		/*隐藏滚轮*/
		display: none;
	}

	/*webkit内核*/
	.scroll_content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	div::-webkit-scrollbar {
		width: 0;
	}

	/*o内核*/
	.scroll_content .-o-scrollbar {
		-moz-appearance: none !important;
		background: rgba(0, 255, 0, 0) !important;
	}

	/*IE10,IE11,IE12*/
	.scroll_content {
		-ms-scroll-chaining: chained;
		-ms-overflow-style: none;
		-ms-content-zooming: zoom;
		-ms-scroll-rails: none;
		-ms-content-zoom-limit-min: 100%;
		-ms-content-zoom-limit-max: 500%;
		-ms-scroll-snap-type: proximity;
		-ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
		-ms-overflow-style: none;
		overflow: auto;
	}

	/deep/ .uni-scroll-view {
		&::-webkit-scrollbar {
			background-color: transparent;
		}

		-webkit-scrollbar {
			display: none
		}

		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	/deep/.uni-scroll-view-content {
		&::-webkit-scrollbar {
			background-color: transparent;
		}

		-webkit-scrollbar {
			display: none
		}

		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	/deep/.uni-sub-menu {
		display: none !important;
	}

	/deep/ .uni-menu-item {
		color: rgb(255, 255, 255) !important;
	}

	/deep/ .pointer {

		// background-color: rgba(34, 90, 103, 0.7);
		background: rgb(47, 64, 85);
	}

	.sidebar {
		position: fixed;
		// top: var(--top-window-height);
		top: 0;
		width: 240px;
		// height: calc(100vh - (var(--top-window-height)));
		z-index: 999;
		height: 100vh;
		box-sizing: border-box;
		border-right: 1px solid darken($left-window-bg-color, 8%);
		background-color: $left-window-bg-color;
		padding-bottom: 10px;
	}

	.title {
		margin-left: 5px;
	}
</style>
