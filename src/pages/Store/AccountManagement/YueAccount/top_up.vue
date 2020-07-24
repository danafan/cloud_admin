<template>
	<div>
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
		<el-form-item label="资金用途：">
			<el-select v-model="req.money_use" placeholder="不限" clearable>
				<el-option v-for="item in money_use_list" :key="item.id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
	</el-form>
	<div class="but">
		<el-button type="primary" size="small" @click="getList">搜索</el-button>
		<el-button type="primary" size="small" @click="reset">重置</el-button>
	</div>
	<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column width="150" prop="finished_time" label="入账时间" align="center">
		</el-table-column>
		<el-table-column width="150" prop="service_subject_name" label="综合服务主体" align="center">
		</el-table-column>
		<el-table-column width="150" prop="bill_id" label="充值流水号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="money" label="充值金额（元）" align="center">
		</el-table-column>
		<el-table-column width="150" prop="reality_money" label="实际到账金额（元）" align="center">
		</el-table-column>
		<el-table-column width="150" label="充值类型" align="center">
			<template slot-scope="scope">
				<span>{{scope.row.business_type2 | orderStatus(money_use_list)}}</span>
			</template>
		</el-table-column>
		<el-table-column width="150" prop="recharge_type" label="资金用途" align="center">
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
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					finished_time_start:"",
					finished_time_end:"",
					money_use:"0",
				},				//请求参数
				date:[],		//入账时间
				money_use_list:[{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"存入银行卡通道余额"
				},{
					id:"2",
					name:"存入支付宝通道余额"
				},{
					id:"3",
					name:"存入微信通道余额"
				}],	//资金用途
				dataObj:{},	
				
			}
		},
		created(){
			//充值记录列表
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
				this.req.finished_time_start = n?n[0]:"";
				this.req.finished_time_end = n?n[1]:"";
			}
		},
		methods:{
			//充值记录列表
			getList(){
				this.req.store_id = this.store_id;
				resource.rechargeRecord(this.req).then(res => {
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
					finished_time_start:"",
					finished_time_end:"",
					money_use:"0",
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
			},
		}
	}
</script>














v x  ]