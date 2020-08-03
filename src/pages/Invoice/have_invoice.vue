<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="开票时间：">
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
			<el-form-item label="发票代码号码：">
				<el-input v-model="req.invoice_code" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="发票申请编号：">
				<el-input v-model="req.apply_id" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="商户名称：">
				<el-input v-model="req.store_name" placeholder="请输入"></el-input>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" size="small" @click="applyList">搜索</el-button>
			<el-button type="primary" size="small" @click="exportFile">导出</el-button>
			<el-button type="primary" size="small" @click="reset">重置</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" prop="enterprise_name" label="商户名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_time" label="开票时间" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_type" label="开票类型" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_code" label="发票代码" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_id" label="发票号码" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_date" label="所属月份" align="center">
			</el-table-column>
			<el-table-column width="150" label="货物或应税劳务、服务名称" align="center">
				<template slot-scope="scope">
					<div v-for="item in scope.row.child_invoice_json">{{item.itemName}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="drawer" label="金额（元）" align="center">
				<template slot-scope="scope">
					<div v-for="item in scope.row.child_invoice_json">{{item.itemAmount}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="invoice_title" label="税率" align="center">
				<template slot-scope="scope">
					<div v-for="item in scope.row.child_invoice_json">{{item.itemTaxRate}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="invoice_title" label="税额（元）" align="center">
				<template slot-scope="scope">
					<div v-for="item in scope.row.child_invoice_json">{{item.itemtaxAmount}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="invoice_title" label="价税合计（元）" align="center">
				<template slot-scope="scope">
					<div v-for="item in scope.row.child_invoice_json">{{item.totalMoney}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" label="购买方" align="center">
				<template slot-scope="scope">
					<div>名称：{{scope.row.recieve_user}}</div>
					<div>纳税人识别号：{{scope.row.taxpayer_id}}</div>
					<div>地址：{{scope.row.recieve_address}}</div>
					<div>电话：{{scope.row.recieve_phone}}</div>
					<div>开户行及账号：{{scope.row.bank_info}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="remark" label="发票备注" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_title" label="操作人信息" align="center">
				<template slot-scope="scope">
					<div>收款人：{{scope.row.payee}}</div>
					<div>复核人：{{scope.row.checker}}</div>
					<div>开票人：{{scope.row.clerk}}</div>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="status_msg" label="作废标志" align="center">
			</el-table-column>
			<el-table-column width="150" prop="recieve_address" label="邮寄地址" align="center">
			</el-table-column>
			<el-table-column width="150" prop="apply_id" label="发票申请编号" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="applyDetail(scope.row.picture_url)">查看</el-button>
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
<!-- 查看 -->
<el-dialog :visible.sync="isDetail">
	<img :src="picture_url">
</el-dialog>

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
					invoice_code:"",
					apply_id:"",
					store_name:"",
				},				//请求参数
				date:[],	//订单创建时间
				dataObj:{},	
				isDetail:false,		//默认详情不显示
				picture_url:''
			}
		},
		created(){
			//获取列表
			this.applyList();
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
			applyList(){
				resource.invoiceList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取详情
			applyDetail(picture_url){
				this.isDetail = true;
				this.picture_url = picture_url;
			},
			//导出
			exportFile(){
				var arr = [];
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportFile.exportUp(`invoice/invoicelistexport?${arr.join('&')}`)
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					start_time:"",
					end_time:"",
					invoice_code:"",
					apply_id:"",
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