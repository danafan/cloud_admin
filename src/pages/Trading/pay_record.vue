<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="批次号：">
					<el-input v-model="req.batch_no" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="批次状态：">
					<el-select v-model="req.batch_status" placeholder="不限" clearable>
						<el-option v-for="item in order_status" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="打款通道：">
					<el-select v-model="req.pay_method" placeholder="不限" clearable>
						<el-option v-for="item in channel_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单创建时间：">
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
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" fixed prop="add_time" label="订单创建时间" align="center">
			</el-table-column>
			<el-table-column width="150" prop="batch_no" label="批次号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="pay_method" label="打款通道" align="center">
			</el-table-column>
			<el-table-column width="150" prop="pay_num" label="打款记录（条）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="pay_money" label="商户打款金额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="creator" label="创建人" align="center">
			</el-table-column>
			<el-table-column width="150" label="批次状态" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status | orderStatus(order_status)}}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="setting(scope.row.batch_id)">详情</el-button>
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
					batch_no:"",
					batch_status:"0",
					pay_method:"0",
					created_time_start:"",
					created_time_end:"",	
				},				//请求参数
				channel_list:[
				{
					id:"0",
					name:"不限"
				},{
					id:"1",
					name:"银行卡"
				},{
					id:"2",
					name:"支付宝"
				}],					//打款通道
				order_status:[{
					id:"0",
					name:"待锁定"
				},{
					id:"1",
					name:"已锁定（待打款）"
				},{
					id:"2",
					name:"处理中"
				},{
					id:"3",
					name:"处理完成"
				},{
					id:"4",
					name:"处理完成（部分失败）"
				},{
					id:"5",
					name:"批次撤销"
				}],					//批次状态
				date:[],	//订单创建时间
				dataObj:{},	
				
			}
		},
		created(){
			//获取列表
			this.getList()
		},
		watch:{
			//订单创建时间
			date:function(n){
				this.req.created_time_start = n && n.length> 0?n[0]:"";
				this.req.created_time_end = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.batchList(this.req).then(res => {
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
					batch_no:"",
					batch_status:"0",
					pay_method:"0",
					created_time_start:"",
					created_time_end:"",
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
			//操作
			setting(id){
				this.$router.push('/money_detail?batch_id=' + id);
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













