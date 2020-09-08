<template>
	<div>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">计费模式</div>
				<div class="edit_box" @click="editBilling" v-if="storeInfoObj.is_supper == 1 || (storeInfoObj.is_supper == 0 && storeInfoObj.button_list.edit == 1)">
					<img class="edit_icon" src="../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				商户服务费费率：{{storeInfoObj.default_rate}}
			</div>
			<div class="info_row">
				{{storeInfoObj.money1}}（含）～ {{storeInfoObj.money2}}，商户服务费费率：{{storeInfoObj.rate1}}
			</div>
			<div class="info_row">
				{{storeInfoObj.money2}}（含）～ {{storeInfoObj.money3}}，商户服务费费率：{{storeInfoObj.rate2}}
			</div>
			<div class="info_row">
				超过{{storeInfoObj.money3}}（含），商户服务费费率：{{storeInfoObj.rate3}}
			</div>
		</el-card>
		<el-card style="margin-top: 24px;">
			<div class="info_title">
				<div class="title_txt">限额信息</div>
				<div class="edit_box" @click="edit" v-if="storeInfoObj.is_supper == 1 || (storeInfoObj.is_supper == 0 && storeInfoObj.button_list.edit == 1)">
					<img class="edit_icon" src="../../assets/edit_icon.png">
					<div class="edit_txt">编辑</div>
				</div>
			</div>
			<div class="info_row">
				全网单人月累计金额限制（元）：{{storeInfoObj.person_month_limit}}
			</div>
		</el-card>
		<!-- 编辑计费模式 -->
		<el-dialog title="编辑计费模式" :visible.sync="showBilling">
			<el-form size="small" style="width: 90%">
				<el-form-item label="商户服务费费率：" label-width="220px" required>
					<el-input type="number" v-model="reqstoreInfoObj.default_rate">
						<template slot="append">%</template>
					</el-input>
					<div style="display: flex;margin-bottom: 20px;margin-top: 20px;">
						<el-input type="number" v-model="reqstoreInfoObj.money1">
							<template slot="append">元</template>
						</el-input><div style="width: 200px;">（含）～</div> <el-input type="number" v-model="reqstoreInfoObj.money2">
							<template slot="append">元</template>
						</el-input><div style="width: 100px;">收取</div><el-input type="number" v-model="reqstoreInfoObj.rate1">
							<template slot="append">%</template>
						</el-input>
					</div>
					<div style="display: flex;margin-bottom: 20px;">
						<el-input type="number" v-model="reqstoreInfoObj.money2">
							<template slot="append">元</template>
						</el-input><div style="width: 200px;">（含）～ </div><el-input type="number" v-model="reqstoreInfoObj.money3">
							<template slot="append">元</template>
						</el-input><div style="width: 100px;">收取</div><el-input type="number" v-model="reqstoreInfoObj.rate2">
							<template slot="append">%</template>
						</el-input>
					</div>
					<div style="display: flex;margin-bottom: 20px;">
						<div style="width: 100px;">超过</div>
						<el-input type="number" v-model="reqstoreInfoObj.money3">
							<template slot="append">元</template>
						</el-input>
						<div style="width: 260px;">（含），收取</div>
						<el-input type="number" v-model="reqstoreInfoObj.rate3">
							<template slot="append">元</template>
						</el-input>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showBilling = false">取 消</el-button>
				<el-button type="primary" @click="submitBilling">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑限额信息 -->
		<el-dialog title="编辑限额信息" :visible.sync="showEdit">
			<el-form size="small" style="width: 90%">
				<el-form-item label="全网单人月累计金额限制（元）：" label-width="220px">
					<el-input v-model="reqstoreInfoObj.person_month_limit" size="small"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEdit = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.info_title{
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
	border-bottom: 1px solid #E8E8E8;
	.title_txt{
		font-size: 16px;
		color: #333333;
		font-weight:500;
	}
	.edit_box{
		display: flex;
		align-items: center;
		.edit_icon{
			margin-right: 5px;
			width:14px;
			height:14px;
		}
		.edit_txt{
			font-size: 14px;
			color: #333333;
		}
	}
}
.info_row{
	display: flex;
	margin-top: 18px;
	font-size: 14px;
	color: #666666;
	.row_item{
		width: 50%;
		display: flex;
	}
}
.title{
	margin-bottom: 20px;
	width: 100%;
	text-align: center;
	font-size: 16px;
	color:#333333;
	font-weight:500;
}
.add,.delete{
	margin-left: 10px;
	width: 50px;
	font-size: 14px;
}
.add{
	color:#008DFF;
}
.delete{
	color:#E02020;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				storeInfoObj:{},//全部信息
				reqstoreInfoObj:{},		//提交的信息
				showBilling:false,//编辑服务费计费模式弹框
				showEdit:false,	//编辑限额信息
			}
		},
		created(){
			//获取信息
			this.getStoreInfo();
		},
		methods:{
			//获取顶部信息
			getStoreInfo(){
				resource.getConfig().then(res => {
					if(res.data.code == 1){
						this.storeInfoObj = res.data.data;
						this.reqstoreInfoObj = JSON.parse(JSON.stringify(res.data.data));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑计费模式
			editBilling(){
				this.showBilling = true;
				this.reqstoreInfoObj = JSON.parse(JSON.stringify(this.storeInfoObj)); 
			},
			//点击编辑限额信息
			edit(){
				this.showEdit = true;
				this.reqstoreInfoObj = JSON.parse(JSON.stringify(this.storeInfoObj)); 
			},
			//提交修改
			submitBilling(){
				if(!this.judgmentMoney.test(this.reqstoreInfoObj.default_rate) || !this.judgmentMoney.test(this.reqstoreInfoObj.money1) || !this.judgmentMoney.test(this.reqstoreInfoObj.money2) || !this.judgmentMoney.test(this.reqstoreInfoObj.money3) || !this.judgmentMoney.test(this.reqstoreInfoObj.rate1) || !this.judgmentMoney.test(this.reqstoreInfoObj.rate2) || !this.judgmentMoney.test(this.reqstoreInfoObj.rate3)){

				}else{
					resource.editServicerate(this.reqstoreInfoObj).then(res => {
						if(res.data.code == 1){
							this.showBilling = false;
							this.$message.success(res.data.msg);
							//获取顶部信息
							this.getStoreInfo();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//提交修改限额信息
			submit(){
				if(this.reqstoreInfoObj.person_month_limit == ''){
					this.$message.warning("请输入限额信息");
				}else if(this.reqstoreInfoObj.person_month_limit < 0){
					this.$message.warning("限额信息必须大于0");
				}else{
					resource.editmoneylimit({person_month_limit:this.reqstoreInfoObj.person_month_limit}).then(res => {
						if(res.data.code == 1){
							this.showEdit = false;
							this.$message.success(res.data.msg);
							//获取顶部信息
							this.getStoreInfo();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
		}
	}
</script>

























