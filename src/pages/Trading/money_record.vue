<template>
	<div>
		<el-card>
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
			<el-form-item label="资金流水号：">
				<el-input v-model="req.bill_id" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="平台订单号：">
				<el-input v-model="req.order_id" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="业务类型：">
				<el-select v-model="req.business_type">
					<el-option v-for="item in channel_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="收支类型：">
				<el-select v-model="req.io_type">
					<el-option v-for="item in order_status" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商户名称：">
				<el-input v-model="req.store_name" placeholder="请输入"></el-input>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="orderList">搜索</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="180" fixed prop="happen_time" label="入账时间" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_name" label="商户名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="store_sn" label="商户ID" align="center">
			</el-table-column>
			<el-table-column width="150" prop="service_subject_name" label="综合服务主体" align="center">
			</el-table-column>
			<el-table-column width="150" prop="order_id" label="平台订单号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="sorder_sn" label="商户订单号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="bill_id" label="资金流水号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="business_desc1" label="业务类型" align="center">
			</el-table-column>
			<el-table-column width="200" prop="business_desc2" label="业务子类" align="center">
			</el-table-column>
			<el-table-column width="150" prop="io_type" label="收支类型" align="center">
			</el-table-column>
			<el-table-column width="150" prop="money" label="入账金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="balance" label="账户余额（元）" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" v-if="scope.row.business_type1 == 2 && scope.row.status == 1" @click="cancel(scope.row.bill_id)">取消</el-button>
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

</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					bill_id:"",
					order_id:"",
					business_type:"0",
					io_type:"0",
					store_name:"",
					finished_time_start:"",
					finished_time_end:""
				},				//请求参数
				channel_list:[
				{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"充值"
				},{
					id:"2",
					name:"提现"
				},{
					id:"3",
					name:"打款"
				},{
					id:"4",
					name:"系统返点"
				},{
					id:"5",
					name:"转账"
				},{
					id:"6",
					name:"提现取消"
				},{
					id:"7",
					name:"打款退款"
				}],					//打款通道
				order_status:[{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"收入"
				},{
					id:"2",
					name:"支出"
				}],					//订单状态
				date:[],	//订单创建时间
				dataObj:{},				//列表信息
			}
		},
		created(){
			//获取列表
			this.orderList();
		},
		watch:{
			//入账时间
			date:function(n){
				this.req.finished_time_start = n && n.length> 0?n[0]:"";
				this.req.finished_time_end = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			orderList(){
				resource.accountchange(this.req).then(res => {
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
					bill_id:"",
					order_id:"",
					business_type:"0",
					io_type:"0",
					store_name:"",
					finished_time_start:"",
					finished_time_end:""
				}
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.orderList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.orderList();
			},
			//取消
			cancel(id){
				this.$confirm('确认取消?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.cancelwithdraw({bill_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.orderList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			}
		}
	}
</script>














v x  ]