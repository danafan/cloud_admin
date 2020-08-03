<template>
	<div>
		<el-card>
			<div class="toast_box">
				<div>温馨提示</div>
				<div>1. 调单为账户综合服务平台对用户的收款行为难以确认其适用情况，而期望贵公司协助证实用户收入及业务场景真实性；</div>
				<div>2. 请根据调单说明提供所需资料，并于反馈截止时间前反馈；</div>
				<div>3. 收到反馈后，依据反馈资料给予审核结论，并通过系统及邮件方式反馈审核结论及结论说明；</div>
				<div>4. 如有疑问请联系所属经理。</div>
			</div>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="创建时间：">
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
			<el-form-item label="平台订单号：">
				<el-input v-model="req.order_id" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="收款户名：">
				<el-input v-model="req.name" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="订单流水号：">
				<el-input v-model="req.adjust_id" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="req.feedback_status" placeholder="不限" clearable>
					<el-option v-for="item in feedback_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="审核结论：">
				<el-select v-model="req.audit_status" placeholder="不限" clearable>
					<el-option v-for="item in audit_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" prop="adjust_id" label="调单流水号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="created_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column width="150" prop="risk_name" label="风险点" align="center">
			</el-table-column>
			<el-table-column width="150" prop="risk_desc" label="调单说明" align="center">
			</el-table-column>
			<el-table-column width="150" prop="order_id" label="平台订单号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="name" label="收款户名" align="center">
			</el-table-column>
			<el-table-column width="150" prop="feedback_time" label="反馈时间" align="center">
			</el-table-column>
			<el-table-column width="150" label="状态" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.feedback_status | feedback}}</span>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="feedback_end_time" label="距离反馈截止日" align="center">
			</el-table-column>
			<el-table-column width="150" label="审核结论" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.audit_status | audit}}</span>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="audit_desc" label="审核结论说明" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.adjust_id)">详情</el-button>
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
.toast_box{
	margin-bottom:24px;
	padding: 8px 30px;
	border:1px solid #008DFF;
	background:rgba(238,248,255,1);
	width: 738px;
	font-size: 14px;
	color: #666666;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					created_time_start:"",
					created_time_end:"",
					order_id:"",
					name:"",
					adjust_id:"",
					feedback_status:"",
					audit_status:""
				},				//请求参数
				feedback_list:[
				{
					id:"-1",
					name:"不限"
				},{
					id:"0",
					name:"待反馈"
				},{
					id:"1",
					name:"待审核"
				},{
					id:"2",
					name:"已完成"
				}
				],					//状态
				audit_list:[{
					id:"-1",
					name:"不限"
				},{
					id:"0",
					name:"未审核"
				},{
					id:"1",
					name:"风险成立"
				},{
					id:"2",
					name:"风险排除"
				},{
					id:"3",
					name:"风险存疑"
				}],					//订单状态
				date:[],	//订单创建时间
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
			}
		},
		methods:{
			//获取列表
			getList(){
				resource.adjustList(this.req).then(res => {
					if(res.data.code == 1){
						//获取列表
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					created_time_start:"",
					created_time_end:"",
					order_id:"",
					name:"",
					adjust_id:"",
					feedback_status:"",
					audit_status:""
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
			getDetail(id){
				this.$router.push("/single_detail?adjust_id = " + id);
			}
		},
		filters:{
			feedback:function(v){
				switch(v){
					case 0:
					return '待反馈'
					case 1:
					return '待审核'
					case 2:
					return '已完成'
				}
			},
			audit:function(v){
				switch(v){
					case 0:
					return '未审核'
					case 1:
					return '风险成立'
					case 2:
					return '风险排除'
					case 3:
					return '风险存疑'
				}
			},
		}
	}
</script>














v x  ]