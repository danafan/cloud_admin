<template>
	<div>
		<el-card>
			<div class="step_box">
				<div class="step_item">
					<div class="item_num" :class="{'active_item_num':current_step == 1}">1</div>
					<div class="item_txt" :class="{'active_item_txt':current_step == 1}">上传数据</div>
				</div>
				<div class="line"></div>
				<div class="step_item">
					<div class="item_num" :class="{'active_item_num':current_step == 2}">2</div>
					<div class="item_txt" :class="{'active_item_txt':current_step == 2}">锁定批次</div>
				</div>
				<div class="line"></div>
				<div class="step_item">
					<div class="item_num" :class="{'active_item_num':current_step == 3}">3</div>
					<div class="item_txt" :class="{'active_item_txt':current_step == 3}">开始打款</div>
				</div>
			</div>
			<div class="step_01" v-if="current_step == 1">
				<div class="toast_box">
					<div>批量打款业务说明</div>
					<div>1. 请选择出款账户后，下载对应模板完成打款</div>
					<div>2. 单批次最大支持10000条订单，单笔最大打款金额可在【商户中心-合作信息】中 查看</div>
					<div>3. 文件名会作为批次号保存，文件名格式建议为「商户名称+日期+编号」，例如：XX商户-20160909-01</div>
				</div>
				<el-form size="small" label-width="150px">
					<el-form-item label="打款通道：" required>
						<el-select v-model="req.pay_method" style="width: 380px;" placeholder="请选择打款通道">
							<el-option v-for="item in channel_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下载模版：" required>
						<div class="down_box" @click="downTemp">
							<img class="down_icon" src="../../assets/down_icon.png">
							<div class="down_txt">下载打款模版</div>
						</div>
					</el-form-item>
					<el-form-item label="上传文件：" required>
						<div class="showimg" v-if="req.fileObj" @mouseenter="isDel = true" @mouseleave="isDel = false">
							<div class="img">{{fileName}}</div>
							<div class="modal" v-if="isDel == true">
								<img src="../../assets/deleteImg.png" @click="detele">
							</div>
						</div>
						<upload-file @callbackFn="callbackFn" v-else></upload-file>
						<div class="upload_toast">只支持xlsx格式的文件</div>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="upLoad">上传</el-button>
			</div>
			<div class="step_02" v-if="current_step == 2 || current_step == 3">
				<div class="toast_box">温馨提示:锁定批次后，该批次内订单将不可修改，如需修改请撤销该批次重新上传</div>
				<div class="lock_box">
					<div class="lock_title">
						<div class="batch_num">批次号：{{batch_info.batch_no}}</div>
						<div class="set_buts">
							<el-button v-if="current_step == 2" style="margin-right: 15px" type="primary" size="small" @click="lock">锁定</el-button>
							<el-button v-if="current_step == 3" style="margin-right: 15px" type="primary" size="small" @click="showPay = true">打款</el-button>
							<el-button type="primary" size="small" @click="undo">撤销</el-button>
						</div>
					</div>
					<div class="lock_content">
						<div class="lock_item">
							<div class="itme_title">批次概览</div>
							<div class="contents">
								<div class="conttent_item">
									<div>笔数（笔）</div>
									<div>{{batch_info.total_order_num}}</div>
								</div>
								<div class="conttent_item">
									<div>金额（元）</div>
									<div>{{batch_info.total_order_money}}</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="lock_item">
							<div class="itme_title">风险订单</div>
							<div class="contents">
								<div class="conttent_item">
									<div>笔数（笔）</div>
									<div>{{batch_info.risk_order_num}}</div>
								</div>
								<div class="conttent_item">
									<div>金额（元）</div>
									<div>{{batch_info.risk_order_money}}</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="lock_item">
							<div class="itme_title">失败订单</div>
							<div class="contents">
								<div class="conttent_item">
									<div>笔数（笔）</div>
									<div>{{batch_info.fail_order_num}}</div>
								</div>
								<div class="conttent_item">
									<div>金额（元）</div>
									<div>{{batch_info.fail_order_money}}</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="lock_item chang">
							<div class="itme_title">预计付款金额</div>
							<div class="contents">
								<div class="conttent_item">
									<div>付款金额（元）</div>
									<div>{{batch_info.prepay_order_money}}</div>
								</div>
								<div class="conttent_item">
									<div>待打款金额（元）</div>
									<div>{{batch_info.prepay_order_money}}</div>
								</div>
								<div class="conttent_item">
									<div>服务费（元）</div>
									<div>{{batch_info.prepay_order_service}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="姓名：">
						<el-input v-model="orderReq.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="手机号：">
						<el-input v-model="orderReq.phone" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="证件号：">
						<el-input v-model="orderReq.id_card_no" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="订单状态：">
						<el-select v-model="orderReq.order_status" placeholder="不限" clearable>
							<el-option v-for="item in order_status" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div class="but">
					<el-button type="primary" size="small" @click="search">搜索</el-button>
					<el-button type="primary" size="small" @click="exportFile">导出</el-button>
					<el-button type="primary" size="small" @click="reset">重置</el-button>
				</div>
				<el-table :data="dataObj.data" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
					<el-table-column width="150" prop="name" label="收款姓名" align="center">
					</el-table-column>
					<el-table-column width="150" prop="pay_money" label="商户打款金额（元）" align="center">
					</el-table-column>
					<el-table-column width="150" prop="service_charge" label="服务费（元）" align="center">
					</el-table-column>
					<el-table-column width="150" prop="order_id" label="平台订单号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="sorder_sn" label="商户订单号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="created_time" label="订单创建时间" align="center">
					</el-table-column>
					<el-table-column width="150" prop="updated_time" label="最后更改时间" align="center">
					</el-table-column>
					<el-table-column width="150" prop="pay_method" label="打款通道" align="center">
					</el-table-column>
					<el-table-column width="150" prop="bank_name" label="收款银行名称" align="center">
					</el-table-column>
					<el-table-column width="150" prop="bank_card_no" label="收款账号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="id_card_no" label="证件号码" align="center">
					</el-table-column>
					<el-table-column width="150" prop="bank_phone" label="银行预留手机号" align="center">
					</el-table-column>
					<el-table-column width="150" prop="remark" label="打款备注" align="center">
					</el-table-column>
					<el-table-column width="150" label="订单状态" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.order_status1 | orderStatus(order_status)}}</span>
							<div style="color: red" v-if="scope.row.order_status1 == 2">{{scope.row.order_status2 | orderStatus2}}</div>
							<div style="color: red" v-if="scope.row.order_status1 == 3">{{scope.row.order_status2 | orderStatus3}}</div>
							<div style="color: red" v-if="scope.row.order_status1 == 2 || scope.row.order_status1 == 3">{{scope.row.status_desc}}</div>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" align="center">
						<template slot-scope="scope">
							<el-button v-if="judgeQu(scope.row)" type="text" size="small" @click="cancel(scope.row.order_id)">取消打款</el-button>
							<el-button v-if="judgeInfo(scope.row)" type="text" size="small" @click="getUpdateInfo(scope.row.order_id)">修改信息</el-button>
							<el-button v-if="judgeMoney(scope.row)" type="text" size="small" @click="getUpdateMoney(scope.row.order_id)">修改金额</el-button>
							<el-button v-if="judgeDetail(scope.row)" type="text" size="small" @click="getDetail(scope.row.order_id)">详情</el-button>
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
		</div>
	</el-card>
	<!-- 修改信息 -->
	<el-dialog title="修改信息" :visible.sync="updateInfo">
		<el-form size="small" style="width: 60%;margin: 0 auto">
			<el-form-item label="姓名" label-width="180px" required>
				<el-input v-model="updateInfoReq.name"></el-input>
			</el-form-item>
			<el-form-item label="收款账号" label-width="180px" required>
				<el-input v-model="updateInfoReq.id_card_no"></el-input>
			</el-form-item>
			<el-form-item label="证件号码" label-width="180px" required>
				<el-input v-model="updateInfoReq.bank_card_no"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="updateInfo = false">取 消</el-button>
			<el-button type="primary" @click="subUpdateInfo">确 定</el-button>
		</div>
	</el-dialog>
	<!-- 修改金额 -->
	<el-dialog title="修改金额" :visible.sync="updateMoney">
		<el-form size="small" style="width: 60%;margin: 0 auto">
			<el-form-item label="全网单人月累计金额限制(元)：" required>
				<span>10000</span>
			</el-form-item>
			<el-form-item label="本月已打款金额（元）：" required>
				<span>10000</span>
			</el-form-item>
			<el-form-item label="本月可打款金额（元）：" required>
				<span>10000</span>
			</el-form-item>
			<el-form-item label="打款金额" label-width="180px" required>
				<el-input v-model="updateMoneyReq.pay_money"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="updateMoney = false">取 消</el-button>
			<el-button type="primary" @click="subUpdateMoney">确 定</el-button>
		</div>
	</el-dialog>
	<!-- 打款 -->
	<el-dialog title="修改金额" :visible.sync="showPay">
		<el-form size="small" style="width: 60%;margin: 0 auto">
			<el-form-item label="支付密码" label-width="180px" required>
				<el-input v-model="pay_password"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showPay = false">取 消</el-button>
			<el-button type="primary" @click="subPay">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.step_box{
	margin-top: 20px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.step_item{
		display: flex;
		align-items: center;
		.item_num{
			margin-right: 8px;
			border:1px solid #CECECE;
			border-radius: 50%;
			width: 32px;
			text-align: center;
			height: 32px;
			line-height: 32px;
			font-size: 22px;
			color: #CCCCCC;
		}
		.active_item_num{
			border:1px solid #008DFF;
			color: #fff;
			background: #008DFF;
		}
		.item_txt{
			font-size: 16px;
			color: #666666;
		}
		.active_item_txt{
			color: #333333;
			font-size: 16px;
			font-weight: 500;
		}

	}
	.line{
		margin-right: 16px;
		margin-left: 16px;
		width: 140px;
		border-bottom: 1px solid #E0E0E0;
	}
}
.step_01{
	margin-top: 30px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	.down_box{
		border:1px solid #D9D9D9;
		padding-left: 20px;
		padding-right: 20px;
		height: 32px;
		display: flex;
		align-items: center;
		.down_icon{
			margin-right: 12px;
			width: 18px;
			height: 18px;
		}
		.down_txt{
			font-size: 14px;
			color: #666666;
		}
	}
	.showimg{
		position: relative;
		width: 200px;
		height: 200px;
		.img{
			border:1px solid #D9D9D9;
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			padding-right: 20px;
			padding-left: 20px;
		}
		.modal{
			background: rgba(0,0,0,.6);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display:block;
				width: 30px;
				height: 30px;
			}
		}
	}
	.upload_toast{
		color: #999999;
		font-size: 14px;
	}
}
.step_02{
	margin-top: 30px;
	.lock_box{
		border: 1px solid #008DFF;
		margin-bottom: 30px;
		.lock_title{
			width: 100%;
			height: 46px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 20px;
			padding-left: 20px;
			.batch_num{
				font-size: 14px;
				color: #333333;
			}
			.set_buts{
				display: flex;
				align-items: center;
			}
		}
		.lock_content{
			border-top: 1px solid #008DFF;
			padding-top: 30px;
			padding-bottom: 30px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			.lock_item{
				border-right: 1px solid #F0F0F0;
				width: 23%;
				.itme_title{
					margin-bottom: 24px;
					width: 100%;
					text-align: center;
					font-size: 18px;
					color: #333333;
				}
				.contents{
					display: flex;
					justify-content: space-around;
					.conttent_item{
						font-size: 16px;
						color: #666666;
					}
				}
			}
			.line{
				height: 100%;
			}
			.chang{
				border:none;
				width: 31%;
			}
		}
	}
}
.toast_box{
	margin:0 auto 24px;
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
	import uploadFile from '../../components/Upload.vue'
	export default{
		data(){
			return {
				req:{
					pay_method:"1",
					fileObj:null,	
				},						//第一步上传的数据
				fileName:"",			//上传之后的文件名
				batch_id:"1",			//第二步批次信息参数
				batch_info:{},			//批次信息
				orderReq:{
					page:1,
					pagesize:10,
					name:"",
					phone:"",
					id_card_no:"",
					order_status:"0",
				},						//第二步获取列表参数
				current_step:1,			// 当前步骤
				channel_list:[{
					id:"1",
					name:"银行卡"
				},{
					id:"2",
					name:"支付宝"
				}],						//打款通道
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
				isDel:false,		//默认删除图片遮罩不显示
				dataObj:{},	
				updateInfo:false,		//默认修改信息弹框不显示
				updateInfoReq:{
					name:"",
					id_card_no:"",
					bank_card_no:""
				},						//修改信息
				updateMoney:false,		//默认修改金额不显示
				updateMoneyReq:{
					pay_money:""
				},						//修改打款金额
				showPay:false,
				pay_password:"",		//支付密码
				order_id:"",
			}
		},
		created(){
			//获取第二步信息
			this.batchInfo();
			//批次订单列表（下面）
			this.batchOrderList();
		},
		watch:{
			current_step:function(n,o){
				if(n == 2){
					//获取第二步信息
					this.batchInfo();
					//批次订单列表（下面）
					this.batchOrderList();
				}
			}
		},
		methods:{
			//点击下载模版
			downTemp(){
				resource.downLoadTemp({pay_method:this.req.pay_method}).then(res => {
					if(res.data.code == 1){
						let downUrl = res.data.data;
						window.open(downUrl)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//上传文件
			callbackFn(obj){
				this.fileName = obj.name;
				this.req.fileObj = obj;
			},
			//删除文件
			detele(){
				this.fileName = "";
				this.req.fileObj = null;
			},
			//第一步上传
			upLoad(){	
				if(this.fileName == "" || this.req.fileObj == null){
					this.$message.warning("上传文件");
				}else{
					let req = {
						pay_method:this.req.pay_method,
						pay_order:this.req.fileObj
					}
					resource.importFile(req).then(res => {
						if(res.data.code == 1){
							this.batch_id = res.data.data;
							this.current_step = this.current_step + 1;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取第二步信息（上面）
			batchInfo(){
				resource.batchInfo({batch_id:this.batch_id}).then(res => {
					if(res.data.code == 1){
						this.batch_info = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//批次订单列表（下面）
			batchOrderList(){
				resource.batchOrderList(this.orderReq).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//第二步锁定
			lock(){
				this.$confirm('确认锁定该批量打款?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.lockBatch({batch_id:this.batch_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.current_step = this.current_step + 2;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			},
			//第三步打款
			subPay(){
				if(this.pay_password == ''){
					this.$message.warning("请输入支付密码");
				}else{
					let req = {
						batch_id:this.batch_id,
						pay_pwd:this.pay_password
					}
					resource.pay(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$router.push('/money_detail');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//第二步撤销
			undo(){
				this.$confirm('确认撤销该批量打款?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.cancelBatch({batch_id:this.batch_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$router.push('/money_record');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			},
			//搜索
			search(){
				console.log(this.orderReq);
			},
			//导出
			exportFile(){
				console.log(this.orderReq);
			},
			//重置(第二步)
			reset(){
				this.orderReq = {
					page:1,
					pagesize:10,
					name:"",
					phone:"",
					id_card_no:"",
					order_status:"0",
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
			//取消打款
			judgeQu(item){
				if(item.order_status1 == 1){
					return true;
				}else if(item.order_status1 == 2 && item.order_status2 == 5 && item.batch_status == 0){
					return true;
				}else if(item.order_status1 == 3 && item.order_status2 == 2 && item.batch_status == 0){
					return true;
				}else{
					return false;
				}
			},
			//修改信息
			judgeInfo(item){
				if(item.order_status1 == 3 && item.order_status2 == 1 && item.batch_status == 0){
					return true;
				}else{
					return false;
				}
			},
			//修改金额
			judgeMoney(item){
				if(item.order_status1 == 3 && item.order_status2 == 2 && item.batch_status == 0){
					return true;
				}else{
					return false;
				}
			},
			//详情
			judgeDetail(item){
				if(item.order_status1 == 2 || item.order_status1 == 6 && item.order_status1 == 8){
					return true;
				}else{
					return false;
				}
			},
			//取消打款
			cancel(order_id){
				this.order_id = order_id;
				this.$confirm('确认取消该订单打款?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.cancel({order_id:this.order_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
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
			},
			//修改信息
			getUpdateInfo(order_id){
				this.order_id = order_id;
				this.updateInfo = true;
			},
			//提交修改信息
			subUpdateInfo(){
				let req = this.updateInfoReq;
				if(req.name == ''){	
					this.$message.warning("请输入收款户名");
				}else if(req.id_card_no == ''){	
					this.$message.warning("请输入证件号码");
				}else if(req.bank_card_no == ''){	
					this.$message.warning("请输入收款账号");
				}else{
					req.order_id = this.order_id;
					resource.editOrder(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//修改金额
			getUpdateMoney(order_id){
				this.order_id = order_id;
				this.updateMoney = true;
			},
			//提交修改金额
			subUpdateMoney(){
				let req = this.updateMoneyReq;
				if(req.pay_money == ''){	
					this.$message.warning("请输入打款金额");
				}else{
					resource.editPayMoney(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//详情
			getDetail(){
				this.$router.push('/money_detail?batch_id=' + this.batch_id);
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
		},
		components:{
			uploadFile
		}
	}
</script>