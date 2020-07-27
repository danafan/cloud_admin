<template>
	<div>
		<div class="tabs">
			<div class="tab_item">
				<img class="tab_icon" :src="qn_url + 'index_top_up.png'">
				<div class="tab_txt">账户充值</div>
			</div>
			<div class="tab_item">
				<img class="tab_icon" :src="qn_url + 'index_send_money.png'">
				<div class="tab_txt">批量打款</div>
			</div>
			<div class="tab_item">
				<img class="tab_icon" :src="qn_url + 'index_apply.png'">
				<div class="tab_txt">发票申请</div>
			</div>
		</div>
		<el-card style="margin-top: 24px">
			<div class="index_card_title">
				<div class="title_text">待处理事务</div>
				<div class="title_right">
					更多详情
					<img class="right_icon" src="../../assets/right_icon.png">
				</div>
			</div>
			<div class="mess_box">
				<div class="mess_item" @click="$router.push('/system')">
					<img class="mess_icon" src="../../assets/announcement.png">
					<div class="mess_text">系统公告（<span>{{indexObj.system_notice}}</span>）</div>
				</div>
				<div class="line"></div>
				<div class="mess_item" @click="$router.push('/correspondence')">
					<img class="mess_icon" src="../../assets/notice.png">
					<div class="mess_text">函件通知（<span>{{indexObj.system_leter}}</span>）</div>
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="index_card_title">
				<div class="title_text">账户概览</div>
			</div>
			<div class="account_box">
				<div class="account_item">
					<div class="item_title">
						<img class="account_icon" src="../../assets/pink_¥.png">
						余额账户
					</div>
					<div class="account_content">
						<div class="content_item">
							<div class="content_item_label">可用余额（元）</div>
							<div class="content_item_val">{{indexObj.balance}}</div>
						</div>
						<div class="content_item">
							<div class="content_item_label">不可用金额（元）</div>
							<div class="content_item_val">{{indexObj.frozen_amount}}</div>
						</div>
					</div>
				</div>
				<div class="line"></div>
				<div class="account_item">
					<div class="item_title">
						<img class="account_icon" src="../../assets/blue_¥.png">
						服务费抵扣账户
					</div>
					<div class="account_content">
						<div class="content_item">
							<div class="content_item_label">可用余额（元）</div>
							<div class="content_item_val">{{indexObj.service_balance}}</div>
						</div>
						<div class="content_item">
							<div class="content_item_label">累计返还（元）</div>
							<div class="content_item_val">{{indexObj.all_return_money}}</div>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.tabs{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.tab_item{
		width: 360px;
		height: 130px;
		position: relative;
		.tab_icon,.tab_txt{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.tab_txt{
			text-align: center;
			line-height: 130px;
			font-size: 28px;
			color: #FFFFFF;
		}
	}
}
.index_card_title{
	padding-bottom: 16px;
	border-bottom: 1px solid #E8E8E8;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title_text{
		font-size: 16px;
		color: #333333;
	}
	.title_right{
		font-size: 14px;
		color: #666666;
		display: flex;
		align-items: center;
		.right_icon{
			margin-left: 6px;
			width: 8px;
			height: 13px;
		}
	}
}
.mess_box{
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-top: 16px;
	.mess_item{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #000000;
		.mess_icon{
			margin-right: 8px;
			width: 22px;
			height: 22px;
		}
		.mess_text span{
			color: red;
		}
	}
	.line{
		border-right: 1px solid #E8E8E8;
		height: 33px;
	}
}
.account_box{
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-top: 16px;
	.line{
		border-right: 1px solid #E8E8E8;
		height: 95px;
	}
	.account_item{
		width: 50%;
		.item_title{
			margin-bottom: 19px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #333333;
			.account_icon{
				margin-right: 4px;
				width: 20px;
				height: 22px;
				
			}
		}
		.account_content{
			display: flex;
			align-items: center;
			justify-content: space-around;
			.content_item_label{
				margin-bottom: 6px;
				font-size: 14px;
				color: #666666;
			}
			.content_item_val{
				font-size: 26px;
				color: #333333;
			}
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				indexObj:{},		//账户概览和待处理事务
			}
		},
		created(){
			//账户概览和待处理事务
			this.index();
		},
		methods:{
			//账户概览和待处理事务
			index(){
				resource.index().then(res => {
					if(res.data.code == 1){
						this.indexObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>
















