<template>
	<div class="box">
		<el-container style="height:100%">
			<el-aside>
				<div class="gxk">账户综合服务总后台</div>
				<el-menu
				:default-active="activeIndex"
				class="el-menu-vertical-demo"
				background-color="#ffffff"
				active-text-color="#fff"
				text-color="#333333"
				:unique-opened="true"
				:router="true"
				@select="handleSelect"
				>
				<el-menu-item index="/index">
					<i class="el-icon-menu"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-submenu :index="index.toString()" v-for="(item,index) in menuList">
					<template slot="title">
						<i :class="`el-icon-${item.icon}`"></i>
						<span>{{item.menu_name}}</span>
					</template>
					<el-menu-item-group>     
						<el-menu-item :index="`/${menu.web_url}`" v-for="menu in item.menu2">{{menu.menu_name}}</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header class="header">
				<div class="breadcrumb">{{crumb}}</div>
				<div class="user_set">
					<div class="username">{{admin_name}}</div>
					<div class="line"></div>
					<div class="tui" @click="exit">退出</div>
				</div>
			</el-header>
			<el-main class="main">
				<keep-alive>
					<router-view v-if="$route.meta.keepAlive"></router-view>
				</keep-alive>
				<router-view v-if="!$route.meta.keepAlive"></router-view>
			</el-main>
		</el-container>
	</el-container>
</div>
</template>
<style lang="less" scoped>
.box{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	.gxk{
		background: #fff;
		width: 256px;
		height: 64px;
		display:flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #333;
	}
	.header{
		width: 100%;
		height: 64px;
		background:#fff !important;
		display:flex;
		align-items: center;
		justify-content: space-between;
		.breadcrumb{
			font-size: 18px;
			color: #333333;
			font-weight:600;
		}
		.user_set{
			display: flex;
			align-items: center;
			.username{
				font-size: 14px;
				color: #000000;
			}
			.line{
				margin-right: 8px;
				margin-left: 8px;
				border-right: 1px solid #008DFF;
				height:13px;
			}
			.tui{
				font-size: 14px;
				color: #333333;
			}
		}
	}
	.el-menu-item.is-active {
		background:#008DFF !important;
	}
	.el-aside{
		background:#fff !important;
	}
	.el-menu{
		border: none !important;	
	}
	.main{
		background: #F0F2F5;
		height: 100%;
		overflow-y: scroll;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				activeIndex:"",
				admin_name:"",
				crumb:"首页",
				menuList:[]
			}
		},
		created(){
			this.admin_name = localStorage.getItem("admin_admin_name");
			let tab = sessionStorage.getItem("tab");
			if(!tab){
				this.activeIndex = '/index';
			}
			if(tab == '/trade_order' || tab == '/order_detail'){
				this.activeIndex = '/trade_order';
			}else if(tab == '/money_record' || tab == '/money_detail'){
				this.activeIndex = '/money_record';
			}else if(tab == '/single' || tab == '/single_detail'){
				this.activeIndex = '/single';
			}else if(tab == '/money_record' || tab == '/money_detail'){
				this.activeIndex = '/money_record';
			}else if(tab == '/apply' || tab == '/invoice_apply'){
				this.activeIndex = '/apply';
			}else if(tab == '/store_list' || tab == '/account_management' || tab == '/store_index'){
				this.activeIndex = '/store_list';
			}else{
				this.activeIndex = tab;
			}
			this.crumb = this.$route.name;
			//获取我的菜单列表
			this.getMenuList();
		},	
		watch:{
			$route(n){
				this.crumb = n.name;
				this.handleSelect(n.path);
			}
		},
		methods:{
			//获取我的菜单列表
			getMenuList(){
				resource.getmainmenus().then(res => {
					if(res.data.code == 1){
						this.menuList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				}).then(() => {
					let tab = sessionStorage.getItem("tab");
					if(!tab){
						let page = `/${this.menuList[0].menu2[0].web_url}`;
						this.activeIndex = page;
						this.$router.push(page);
					}else{
						this.activeIndex = tab;
						this.$router.push(tab);
					}
				})
			},
			handleSelect(index){
				if(index == '/trade_order' || index == '/order_detail'){
					this.activeIndex = '/trade_order';
				}else if(index == '/money_record' || index == '/money_detail'){
					this.activeIndex = '/money_record';
				}else if(index == '/single' || index == '/single_detail'){
					this.activeIndex = '/single';
				}else if(index == '/money_record' || index == '/money_detail'){
					this.activeIndex = '/money_record';
				}else if(index == '/apply' || index == '/invoice_apply'){
					this.activeIndex = '/apply';
				}else if(index == '/store_list' || index == '/account_management' || index == '/store_index'){
					this.activeIndex = '/store_list';
				}else{
					this.activeIndex = index;
				}
			},
			//点击退出
			exit(){
				this.$confirm('确认退出当前账户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.quit().then(res => {
						if(res.data.code == 1){
							localStorage.clear();
							this.$message.success(res.data.msg);
							this.$router.push('/login');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			}
		}
	}
</script>




















