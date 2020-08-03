<template>
	<div>
		<el-card>
			<div class="yue_info">
				<div class="info_item">
					<div class="info_item_title">服务费抵扣账户</div>
					<div class="info_row">
						<div class="row_item">
							<div class="row_item_label">可用余额（元）</div>
							<div class="row_item_val">{{storeInfo.service_balance}}</div>
						</div>
						<div class="row_item">
							<div class="row_item_label">累计返还（元）</div>
							<div class="row_item_val">{{storeInfo.service_frozen_amount}}</div>
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card style="margin-top: 20px">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="入账时间：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					:default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="交易类型：">
				<el-select v-model="req.business_type" placeholder="不限" clearable>
					<el-option v-for="item in trading_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="收支类型">
				<el-select v-model="req.io_type" placeholder="不限" clearable>
					<el-option v-for="item in payments_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="happen_time" label="入账时间" align="center">
			</el-table-column>
			<el-table-column prop="service_subject_name" label="综合服务主体" align="center">
			</el-table-column>
			<el-table-column prop="bill_id" label="流水号" align="center">
			</el-table-column>
			<el-table-column prop="businessName" label="交易类型" align="center">
			</el-table-column>
			<el-table-column prop="io_type" label="收支类型" align="center">
			</el-table-column>
			<el-table-column prop="money" label="入账金额" align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="req.page"
			:pager-count="11"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
</el-card>
</div>
</template>
<style lang="less" scoped>
.yue_info{
	width: 100%;
	display: flex;
	justify-content: space-between;
	.info_item{
		width: 45%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.info_item_title{
			font-size: 18px;
			color: #333333;
		}
		.info_row{
			margin-top: 20px;
			width: 100%;
			display: flex;
			justify-content: space-around;
			.row_item{
				display: flex;
				flex-direction: column;
				align-items: center;
				.row_item_label{
					font-size: 16px;
					color: #666666;
				}
				.row_item_val{
					font-size: 26px;
					color: #333333;
				}
			}
		}
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					happen_start_time:"",
					happen_end_time:"",
					business_type:"0",
					io_type:"0"
				},				//请求参数
				date:[],		//入账时间
				trading_list:[{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"阶梯返点"
				},{
					id:"2",
					name:"余额抵扣服务费"
				},{
					id:"3",
					name:"服务费账户抵扣服务费"
				}],	//充值类型
				payments_list:[{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"收入"
				},{
					id:"2",
					name:"支出"
				}],	//资金用途
				dataObj:{},	
				storeInfo:{},
				
			}
		},
		created(){
			//获取顶部信息
			this.getStoreInfo();
			//获取列表
			this.getList();
		},
		props:{
			store_id:{
				type:String,
				default:""
			}
		},
		watch:{
			//入账时间
			date:function(n){
				this.req.happen_start_time = n && n.length> 0?n[0]:"";
				this.req.happen_end_time = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取顶部信息
			getStoreInfo(){
				resource.storeInfo({store_id:this.store_id}).then(res => {
					if(res.data.code == 1){
						this.storeInfo = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				this.req.store_id = this.store_id;
				resource.serviceChargeRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					happen_start_time:"",
					happen_end_time:"",
					business_type:"0",
					io_type:"0"
				}
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			}
		}
	}
</script>














v x  ]