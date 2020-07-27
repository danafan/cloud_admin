<template>
	<div class="box">
		<el-container style="height:100%">
			<el-aside style="width=200px">
				<div class="gxk">账户综合服务总后台</div>
				<el-menu
				:default-active="activeIndex"
				:router="true"
				class="el-menu-vertical-demo"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#fff">
				<el-menu-item index="/index">
					<i class="el-icon-menu"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-submenu index="1">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>交易管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/trade_order">交易订单</el-menu-item>
						<el-menu-item index="/receipt">电子回单</el-menu-item>
						<el-menu-item index="/hang_order">挂起订单</el-menu-item>
						<el-menu-item index="/pay_record">批量打款记录</el-menu-item>
						<el-menu-item index="/money_record">资金流水</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>调单记录</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/single">调单记录</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>发票管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/invoice_category">发票类目</el-menu-item>
						<el-menu-item index="/invoice_record">发票记录</el-menu-item>
						<el-menu-item index="/have_invoice">已开发票</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="6">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>用户管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/sign_user">签约用户</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="7">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>商户管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/store_list">商户列表</el-menu-item>
						<el-menu-item index="/store_data">商户数据</el-menu-item>
						<el-menu-item index="/associated">关联列表</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="8">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>税务管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/deductions_record">个税扣缴明细</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="9">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>消息管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/correspondence">函件通知</el-menu-item>
						<el-menu-item index="/system">系统公告</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="10">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>系统设置</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/basic_set">基本设置</el-menu-item>
						<el-menu-item index="/ervice_subject">综合服务主体</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="11">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span>权限管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/account_pre">账号管理</el-menu-item>
						<el-menu-item index="/management">权限管理</el-menu-item>
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
		background: #00152A;
		width: 256px;
		height: 64px;
		display:flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #fff;
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
		background:#00152A !important;
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
				crumb:"首页"
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
		},	
		watch:{
			$route(n){
				this.crumb = n.name;
				this.handleSelect(n.path);
			}
		},
		methods:{
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




















