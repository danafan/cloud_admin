<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="日期">
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
			<el-form-item label="商户名称：">
				<el-input v-model="req.invoice_code" placeholder="请输入"></el-input>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
			<el-button type="primary" size="small" @click="exportFile">导出</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" prop="store_name" label="商户名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="bill_date" label="日期" align="center">
			</el-table-column>
			<el-table-column width="150" prop="enterprise_name" label="公司名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="total_success_money" label="成功订单总金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_success_bank_money" label="银行卡成功订单金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_success_alipay_money" label="支付宝成功订单金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="user_return_money" label="用户成功收款金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="user_success_bank_money" label="银行卡用户成功收款金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="user_success_alipay_money" label="支付宝用户成功收款金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="user_return_money" label="部分退款订单用户实收金额" align="center">
			</el-table-column>
			<el-table-column width="150" prop="total_success_num" label="成功打款笔数" align="center">
			</el-table-column>
			<el-table-column width="150" prop="bank_success_num" label="银行卡成功打款笔数" align="center">
			</el-table-column>
			<el-table-column width="150" prop="alipay_success_num" label="支付宝成功打款笔数" align="center">
			</el-table-column>
			<el-table-column width="150" prop="fail_num" label="失败订单笔数" align="center">
			</el-table-column>
			<el-table-column width="150" prop="fail_money" label="失败订单金额" align="center">
			</el-table-column>
			<el-table-column width="150" prop="recharge_num" label="充值总笔数" align="center">
			</el-table-column>
			<el-table-column width="150" prop="recharge_money" label="充值总金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="total_service_money" label="实收成功订单商户服务费金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_refund_service_money" label="退款订单商户服务费金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="deduction_service_money" label="服务费返点使用总额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_sn" label="商户ID" align="center">
			</el-table-column>
			<el-table-column width="150" label="C端签约" align="center">
				<template slot-scope="scope">
					<span>微信端</span>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="account_manager_name" label="客户经理" align="center">
			</el-table-column>
			<el-table-column width="150" prop="apply_id" label="技术对接" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.is_technology == '1'?'是':'否'}}</span>
				</template>
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
.el-carousel__item h3 {
	color: #475669;
	font-size: 18px;
	opacity: 0.75;
	line-height: 300px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
	background-color: #d3dce6;
}
.bottom_buts{
	margin-top: 20px;
	width: 100%;
	display: flex;
	justify-content: flex-end;
}
</style>
<script>
	import resource from '../../api/resource.js'
	import exportFile from '../../api/export.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					start_time:"",
					end_time:"",
					store_name:"",
				},				//请求参数
				date:[],	//订单创建时间
				dataObj:{}
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			//订单创建时间
			date:function(n){
				this.req.start_time = n && n.length> 0?n[0]:"";
				this.req.end_time = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.storestatistics(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFile(){
				var arr = [];
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportFile.exportUp(`storestatistics/export?${arr.join('&')}`)
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					start_time:"",
					end_time:"",
					store_name:"",
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
			},
			
		}
	}
</script>














v x  ]