<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="申请时间：">
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
			<el-table-column width="150" prop="store_name" label="商户名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="apply_id" label="发票申请编号" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_num" label="已申请发票（张）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="total_price_tax" label="价税合计总额（元）" align="center">
			</el-table-column>
			<el-table-column width="150" prop="add_time" label="发票申请时间" align="center">
			</el-table-column>
			<el-table-column width="150" prop="status" label="状态" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.status == 1?'待开票':scope.row.status == 2?'待寄出':'已寄出'}}</span>
				</template>
			</el-table-column>
			<el-table-column width="150" prop="drawer" label="发票抬头" align="center">
			</el-table-column>
			<el-table-column width="150" prop="invoice_title" label="开票方" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="applyDetail(scope.row.apply_id)">查看</el-button>
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
<el-dialog :visible.sync="isDetail" width="60%">
	<el-tabs>
		<el-tab-pane label="开票申请">
			<div class="apply_item">
				<div class="apply_item_title">开票信息</div>
				<div class="hy">
					<div class="content_item">企业名称：{{apply_info.enterprise_name}}</div>
					<div class="content_item">纳税人类型：{{store_info.taxpayer_type}}</div>
					<div class="content_item">纳税人识别号：{{store_info.taxpayer_id}}</div>
					<div class="content_item">发票类目：{{store_info.cate_ids}}</div>
					<div class="content_item">单位注册地址及电话：{{store_info.address_phone}}</div>
					<div class="content_item">开户行及账号：{{store_info.bank_info}}</div>
					<div class="content_item">默认发票类目：{{store_info.default_cate_id}}</div>
				</div>
			</div>
			<div class="apply_item">
				<div class="apply_item_title">邮寄地址</div>
				<div class="hy">
					<div class="content_item">收件人姓名：{{store_info.recieve_user}}</div>
					<div class="content_item">收件人电话：{{store_info.recieve_phone}}</div>
					<div class="content_item">收件人地址：{{store_info.recieve_address}}</div>
				</div>
			</div>
			<div class="invoice_box" v-for="(invoice_item,index) in invoice_list">
				<div class="top_box">
					<div class="bank_info">{{invoice_item.invoice_type}}</div>
					<div class="bank_info">{{invoice_item.bank_info}}</div>
					<div class="line"></div>
					<div>发票版面：一百万元版</div>
					<el-form :inline="true" size="small" class="demo-form-inline">
						<el-form-item label="发票代码：">
							<el-input v-model="invoice_item.invoice_code" placeholder="请输入"></el-input>
						</el-form-item>
						<el-form-item label="发票号码：">
							<el-input v-model="invoice_item.invoice_no" placeholder="请输入"></el-input>
						</el-form-item>
						<el-button type="primary" size="small" @click="save(index)">保存</el-button>
					</el-form>
				</div>
				<div class="invoice_list">
					<div class="list_title">
						<div class="a all">货物或应税劳务、服务名称</div>
						<div class="b all">规格型号</div>
						<div class="c all">单位</div>
						<div class="d all">数量</div>
						<div class="e all">单价</div>
						<div class="f all">金额</div>
						<div class="g all">税率</div>
						<div class="h all">税额</div>
						<div class="i all">含税金额</div>
					</div>
					<div class="invoice_item" v-for="(invo_item,i) in invoice_item.child_invoice_json">
						<div class="a all">{{invo_item.itemName}}</div>
						<div class="b all"></div>
						<div class="c all">次</div>
						<div class="d all">{{invo_item.itemNum}}</div>
						<div class="e all">{{invo_item.itemPrice}}</div>
						<div class="f all">{{invo_item.itemAmount}}</div>
						<div class="g all">{{invo_item.itemTaxRate}}</div>
						<div class="h all">{{invo_item.itemtaxAmount}}</div>
						<div class="i all">{{invo_item.totalMoney}}</div>
					</div>
				</div>
				<div class="totla_levied">
					<div class="levied_label label">价税合计</div>
					<div class="levied_value">{{invoice_item.tax_amount}}</div>
				</div>
				<div class="remark">
					<div class="remark_label label">备注</div>
					<div class="remark_value">{{invoice_item.remark}}</div>
				</div>
			</div>
			<div class="is_confirmation" v-if="apply_info.is_confirmation_letter == 1">已申请结算确认函</div>
			<div class="apply_item">
				<div class="apply_item_title">开票说明</div>
				<div class="hy">
					<div class="content_item">{{apply_info.remarks}}</div>
				</div>
			</div>
			<div class="total_money">
				申请开票总金额：{{apply_info.total_price_tax}}
			</div>
			<el-table :data="bill_list" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="150" prop="bill_id" label="账单编号" align="center">
				</el-table-column>
				<el-table-column width="150" label="账单类型" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.type == 1?'打款':'发票'}}</span>
					</template>
				</el-table-column>
				<el-table-column width="150" prop="biil_money" label="账单金额（元）" align="center">
				</el-table-column>
				<el-table-column width="150" prop="bill_date" label="账单完成日期" align="center">
				</el-table-column>
				<el-table-column width="150" prop="biil_money" label="账单申请开票金额" align="center">
				</el-table-column>
			</el-table>
		</el-tab-pane>
		<el-tab-pane label="发票预览">
			<el-carousel :interval="5000" arrow="always">
				<el-carousel-item v-for="item in pic_list" :key="item">
					<img :src="item">
				</el-carousel-item>
			</el-carousel>
		</el-tab-pane>
	</el-tabs>
</el-dialog>

</div>
</template>
<style lang="less" scoped>
.invoice_box{
	margin-bottom: 16px;
	border: 1px solid #008DFF;
	font-size: 12px;
	color: #666666;
	.top_box{
		border-bottom:1px solid #008DFF;
		padding-left: 10px;
		width: 100%;
		display: flex;
		align-items: center;
		height: 45px;
		position: relative;
		.bank_info{
			margin-left: 15px;
		}
		.line{
			margin-left: 15px;
			margin-right: 15px;
			border-right:1px solid #979797;
			height: 17px;
		}
		.deleteImg{
			width: 18px;
			height: 18px;
			position: absolute;
			right: 10px;
		}
	}
	.invoice_list{
		.list_title,.invoice_item{
			height: 40px;
			font-weight:500;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
		.all{
			border-right: 1px solid #008DFF;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.a{
			width: 272px;
		}
		.b{
			width: 75px;
		}
		.c{
			width: 48px;
		}
		.d{
			width: 48px;
		}
		.e{
			width: 138px;
		}
		.f{
			width: 110px;
		}
		.g{
			width: 49px;
		}
		.h{
			width: 108px;
		}
		.i{
			border: none;
			padding-left: 20px;
			padding-right: 20px;
			flex:1;
		}
	}
	.totla_levied{
		border-top:1px solid #008DFF;
		border-bottom:1px solid #008DFF;
		width: 100%;
		display: flex;
		.levied_label{
			border-right:1px solid #008DFF;
			height: 30px;
			line-height: 30px;
			width: 272px;
			text-align: center;
		}
		.levied_value{
			padding-right: 10px;
			flex:1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}
	.remark{
		width: 100%;
		display: flex;
		.remark_label{
			border-right:1px solid #008DFF;
			height: 79px;
			line-height: 79px;
			width: 400px;
			text-align: center;
		}
		.remark_value{
			padding: 10px;
			flex:1;
			height: 79px;
			display: flex;
			align-items: center;
			justify-content: center;
			input{
				width: 100%;
			}
		}
	}
}
.apply_item{
	margin-bottom: 16px;
	border:1px solid rgba(240,240,240,1);
	width: 100%;
	.apply_item_title{
		border-bottom:1px solid rgba(240,240,240,1);
		width: 100%;
		height: 46px;
		display: flex;
		align-items: center;
		padding-left: 24px;
		background: #F0F0F0;
		font-size: 14px;
		color: #333333;
		font-weight:500;
		span{
			color: #008DFF;
		}
	}
	.apply_item_content{
		display: flex;
		justify-content: space-around;
	}
	.hy{
		padding-left: 24px;
	}
	.content_item{
		height: 46px;
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #666666;
	}
}
.is_confirmation{
	margin-bottom: 20px;
	font-size: 14px;
	color:#333333;
	font-weight:500;
}
.total_money{
	padding-left: 12px;
	background: #ECF6FF;
	width:100%;
	height:53px;
	line-height: 53px;
	font-size: 12px;
	color:#008DFF;
}
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
					apply_id:"",
					store_name:"",
				},				//请求参数
				date:[],	//订单创建时间
				dataObj:{},	
				isDetail:false,		//默认详情不显示
				apply_info:{},
				store_info:{},
				invoice_list:[],	//发票列表
				bill_list:[],		
				pic_list:[]
			}
		},
		created(){
			//获取列表
			this.applyList();
		},
		watch:{
			//订单创建时间
			date:function(n){
				this.req.start_time = n?n[0]:"";
				this.req.end_time = n?n[1]:"";
			}
		},
		methods:{
			//获取列表
			applyList(){
				resource.applyList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取详情
			applyDetail(id){
				resource.applyDetail({apply_id:id}).then(res => {
					if(res.data.code == 1){
						this.isDetail = true;
						this.apply_info = res.data.data.apply_info;
						this.store_info = res.data.data.store_invoice_info;
						res.data.data.invoice_list.map(item => {
							item.invoice_code = "";
							item.invoice_no = "";
						})
						this.invoice_list = res.data.data.invoice_list;
						this.bill_list = res.data.data.bill_list;
						this.pic_list = res.data.data.pic_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//保存
			save(index){
				if(this.invoice_list[index].invoice_code == ''){
					this.$message.warning("请输入发票代码");
				}else if(this.invoice_list[index].invoice_no == ''){
					this.$message.warning("请输入发票号码");
				}else{
					let obj = {
						invoice_id:this.invoice_list[index].invoice_id,
						invoice_code:this.invoice_list[index].invoice_code,
						invoice_no:this.invoice_list[index].invoice_no,
					}
					resource.invoiceInput(obj).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			exportFile(){
				var arr = [];
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportFile.exportUp(`invoice/applylistexport?${arr.join('&')}`)
			},
			//重置
			reset(){
				this.date = [];
				this.req = {
					page:1,
					pagesize:10,
					start_time:"",
					end_time:"",
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