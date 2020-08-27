<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="平台订单号：">
					<el-input v-model="req.order_id" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="收款户名：">
					<el-input v-model="req.name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="商户名称：">
					<el-input v-model="req.store_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="订单创建时间：">
					<el-date-picker
					v-model="order_create_date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					:default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="最后更新时间：">
				<el-date-picker
				v-model="update_date"
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
		<el-table-column width="180" prop="created_time" label="订单创建时间" align="center">
		</el-table-column>
		<el-table-column width="180" prop="updated_time" label="最后更改时间" align="center">
		</el-table-column>
		<el-table-column width="150" prop="batch_no" label="批次号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="order_id" label="平台订单号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="pay_money" label="商户打款金额（元）" align="center">
		</el-table-column>
		<el-table-column width="150" prop="service_charge" label="商户实收服务费（元）" align="center">
		</el-table-column>
		<el-table-column width="150" prop="pay_method" label="打款通道" align="center">
		</el-table-column>
		<el-table-column width="150" prop="bank_name" label="收款银行名称" align="center">
		</el-table-column>
		<el-table-column width="150" prop="sorder_sn" label="商户订单号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="store_name" label="商户名称" align="center">
		</el-table-column>
		<el-table-column width="150" prop="name" label="收款姓名" align="center">
		</el-table-column>
		<el-table-column width="200" prop="id_card_no" label="证件号码" align="center">
		</el-table-column>
		<el-table-column width="200" prop="bank_card_no" label="收款账号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="bank_phone" label="银行预留手机号" align="center">
		</el-table-column>
		<el-table-column width="150" prop="service_subject_name" label="综合服务主体" align="center">
		</el-table-column>
		<el-table-column width="150" prop="pay_voucher" label="打款凭证" align="center">
		</el-table-column>
		<el-table-column width="150" prop="remark" label="打款备注" align="center">
		</el-table-column>
		<el-table-column width="260" label="订单状态" align="center">
			<template slot-scope="scope">
				<span>{{scope.row.order_status1 | orderStatus(order_status)}}</span>
				<div style="color: red" v-if="scope.row.order_status1 == 2">{{scope.row.order_status2 | orderStatus2}}</div>
				<div style="color: red" v-if="scope.row.order_status1 == 3">{{scope.row.order_status2 | orderStatus3}}</div>
				<div style="color: red" v-if="scope.row.order_status1 == 2 || scope.row.order_status1 == 3">{{scope.row.status_desc}}</div>
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
					order_id:"",
					name:"",
					store_name:"",
					created_time_start:"",
					created_time_end:"",	
					updated_time_start:"",
					updated_time_end:"",
				},				//请求参数
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
				order_create_date:[],	//订单创建时间
				update_date:[],			//最后更新时间
				dataObj:{},	
				
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			//订单创建时间
			order_create_date:function(n){
				this.req.created_time_start = n && n.length> 0?n[0]:"";
				this.req.created_time_end = n && n.length> 0?n[1]:"";
			},
			//最后更新时间
			update_date:function(n){
				this.req.updated_time_start = n.length> 0?n[0]:"";
				this.req.updated_time_end = n.length> 0?n[1]:"";
			},
		},
		methods:{
			//获取列表
			getList(){
				resource.hangList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//重置
			reset(){
				this.order_create_date = [];	//订单创建时间
				this.update_date = [];		//最后更新时间
				this.req = {
					page:1,
					pagesize:10,
					order_id:"",
					name:"",
					store_name:"",
					created_time_start:"",
					created_time_end:"",	
					updated_time_start:"",
					updated_time_end:"",
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
			orderStatus2:function(v){
				switch(v){
					case 1:
					return '信息不匹配(锁批前可确定)'
					case 2:
					return '全网单人月累计打款金额超限制'
					case 3:
					return '收款人疑似企业（含关联企业）董监高或内部员工'
					case 4:
					return '收款人的姓名、手机号与管理员或登陆人的姓名、手机号相同'
					case 5:
					return '未签约'
					case 6:
					return '已退款'
				}
			},
			orderStatus3:function(v){
				switch(v){
					case 1:
					return '信息不匹配(锁批前可确定)'
					case 2:
					return '全网单人月累计打款金额超限制'
					case 3:
					return '收款人疑似企业（含关联企业）董监高或内部员工'
					case 4:
					return '打款订单的姓名、手机号与管理员或登陆人的姓名、手机号相同'
					case 5:
					return '未签约'
				}
			}
		}
	}
</script>














v x  ]