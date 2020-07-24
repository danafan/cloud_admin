<template>
	<div>
		<el-card>
			<div class="title">订单详情</div>
			<div class="content">
				<div class="column">
					<div class="column_item">商户订单号：{{orderDetail.sorder_sn}}</div>
					<div class="column_item">批次号：{{orderDetail.batch_no}}</div>
					<div class="column_item">打款通道：{{orderDetail.pay_method}}</div>
					<div class="column_item">综合服务主体：{{orderDetail.service_subject_name}}</div>
				</div>
				<div class="column">
					<div class="column_item">订单状态：{{orderDetail.order_status1 | orderStatus(orderStatus)}}</div>
					<div class="column_item">订单创建时间：{{orderDetail.created_time}}</div>
					<div class="column_item">打款凭证：{{orderDetail.pay_voucher}}</div>
				</div>
				<div class="column">
					<div class="column_item">平台订单号：{{orderDetail.order_id}}</div>
					<div class="column_item">订单更新时间：{{orderDetail.updated_time}}</div>
					<div class="column_item">打款备注：{{orderDetail.remark}}</div>
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="title">订单金额信息</div>
			<div class="content">
				<div class="column">
					<div class="column_item">商户打款金额（元）：{{orderDetail.pay_money}}</div>
				</div>
				<div class="column">
					<div class="column_item">用户实收金额（元）：{{orderDetail.receive_money}}</div>
				</div>
				<div class="column">
					<div class="column_item">商户服务费（元）：{{orderDetail.service_charge}}</div>
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="title">收款账户信息</div>
			<div class="content">
				<div class="column">
					<div class="column_item">收款账户名：{{orderDetail.name}}</div>
					<div class="column_item">证件号码：{{orderDetail.id_card_no}}</div>
				</div>
				<div class="column">
					<div class="column_item">收款银行名称：{{orderDetail.bank_name}}</div>
					<div class="column_item">银行预留手机号：{{orderDetail.bank_phone}}</div>
				</div>
				<div class="column">
					<div class="column_item">收款账号：{{orderDetail.bank_card_no}}</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.title{
	padding-bottom: 15px;
	width: 100%;
	border-bottom: 2px solid #F0F0F0;
	font-size: 16px;
	color: #333333;
	font-weight:500;
}
.content{
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	color: #333333;
	.column{
		width: 30%;
		.column_item{
			margin-top: 15px;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				order_id:"",
				orderDetail:{},
				order_status:[{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"已受理"
				},{
					id:"2",
					name:"打款失败"
				},{
					id:"3",
					name:"订单挂起"
				},{
					id:"4",
					name:"待打款"
				},{
					id:"5",
					name:"打款中"
				},{
					id:"6",
					name:"已打款"
				},{
					id:"7",
					name:"批次取消"
				},{
					id:"8",
					name:"订单取消"
				}],					//订单状态
			}
		},
		created(){
			this.order_id = this.$route.query.order_id;
			//获取详情
			this.getDetail();
		},
		methods:{
			//获取详情
			getDetail(){
				resource.orderDetail({order_id:this.order_id}).then(res => {
					if(res.data.code == 1){
						this.orderDetail = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		filters:{
			orderStatus:function(v,s){
				var str = "";
				s.map(item => {
					if(v == item.id){
						str = item.name
						return
					}
				})
				return str
			}
		}
	}
</script>
















