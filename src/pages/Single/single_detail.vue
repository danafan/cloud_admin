<template>
	<div>
		<el-card>
			<div class="card_title">风险订单</div>
			<div class="card_content">
				<el-table :data="dataList" size="small" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
					<el-table-column width="150" prop="name" label="收款户名" align="center">
					</el-table-column>
					<el-table-column width="150" prop="created_time" label="创建订单时间" align="center">
					</el-table-column>
					<el-table-column width="150" prop="order_id" label="平台订单号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="pay_money" label="打款金额（元）" align="center">
					</el-table-column>
					<el-table-column width="150" prop="pay_method" label="打款通道" align="center">
					</el-table-column>
					<el-table-column width="150" prop="bank_card_no" label="收款账号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="id_card_no" label="证件号码" align="center">
					</el-table-column>
					<el-table-column width="150" prop="bank_phone" label="银行预留手机号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="remark" label="打款备注" align="center">
					</el-table-column>
					<el-table-column width="150" prop="order_status_desc" label="订单状态" align="center">
					</el-table-column>
				</el-table>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="card_title">调单信息</div>
			<div class="card_content">
				<div>风险点：{{dataObj.risk_name}}</div>
				<div>调单说明：{{dataObj.risk_desc}}</div>
				<div>反馈截止时间：{{dataObj.feedback_end_time}}</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="card_title">反馈信息</div>
			<div class="card_content">
				<div>反馈时间：{{dataObj.feedback_time}}</div>
				<div>反馈说明：{{dataObj.feedback_desc}}</div>
				<div class="file">反馈材料：
					<img :src="dataObj.feedback_material">
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 24px">
			<div class="card_title">调单结论</div>
			<div class="card_content">
				<div>审核时间：{{dataObj.audit_time}}</div>
				<div>审核结论：{{dataObj.audit_status}}</div>
				<div>审核结论说明：{{dataObj.audit_desc}}</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.card_title{
	font-size: 16px;
	color: #333333;
	font-weight:500;
	border-bottom: 1px solid #E8E8E8;
	padding-bottom: 16px;
}
.card_content{
	padding-top: 24px;
	font-size: 14px;
	color: #666666;
	line-height: 30px;
	.file{
		display: flex;
		img{
			border:1px solid red;
			width: 120px;
			height: 120px;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				adjust_id:"",
				dataObj:{},
				dataList:[]
			}
		},
		created(){
			this.adjust_id = this.$route.query.adjust_id;
			//获取详情
			this.getDetail();
		},
		methods:{
			//获取详情
			getDetail(){
				resource.adjustDetail({adjust_id:this.adjust_id}).then(res => {
					if(res.data.code == 1){
						//获取列表
						this.dataObj = res.data.data;
						this.dataList.push(this.dataObj.order_info);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>








