<template>
	<!-- 存证主体模块 -->
	<div class="applySubjectQy" v-loading="loading">
		<div class="mainOwern-wrap" v-if="!loading">
			<div class="mainOwern clearfix">
				<div class="main_body clearfix">
					<h4>[企业]</h4>
					<div v-for="(item, index) in listsDataQy" :key="item.apply_id" class="fl clearfix mb15 mr15" :class="{active: applySubjectId==item.apply_id}" @click="selectApplySubjectQy(item)">
						<p class="tit haschecked" v-if="item.is_checked==1">已实名认证</p>
						<p class="tit checking" v-if="item.is_checked==2 || item.is_checked==3">实名认证中</p>
						<p class="tit fail" v-if="item.is_checked==4">认证失败</p>
						<p class="tit nocheck" v-if="!item.is_checked">未认证</p>
						<p class="name mt20">{{item.apply_name}}</p>
						<p class="type mt5">{{item.apply_type|applyTypeFilter}}</p>
						<span class="edit ml5" @click.stop="showPopup(item)">修改</span>
					</div>
					<div v-if="listsData.length<10" class="add_apply fl clearfix mb15 mr15" :class="{disabled: total && total===limit}" @click="showPopup($event, '2')">
						<p><i class="el-icon-plus mr10"></i>增加申请人</p>
					</div>
				</div>
				<div class="main_body clearfix">
					<h4>[个人]</h4>
					<div v-for="(item, index) in listsData" :key="item.apply_id" class="fl clearfix mb15 mr15" :class="{active: applySubjectId==item.apply_id}" @click="selectApplySubject(item)">
						<p class="tit haschecked" v-if="item.is_checked">已实名认证</p>
						<p class="tit nocheck" v-if="!item.is_checked">未认证</p>
						<p class="name mt20">{{item.apply_name}}</p>
						<p class="type mt5">{{item.apply_type|applyTypeFilter}}</p>
						<span class="edit ml5" @click.stop="showPopup(item)">修改</span>
					</div>
					<div v-if="listsData.length<10" class="add_apply fl clearfix mb15 mr15" :class="{disabled: total && total===limit}" @click="showPopup($event, '5')">
						<p><i class="el-icon-plus mr10"></i>增加申请人</p>
					</div>
				</div>
			</div>
		</div>
		<p class="limit-tip" v-if="!loading && total && total===limit">当前主体信息数量已达到上限。 <a :href="userUrl+'/iprp/#/subjectList'" target="_blank">管理主体信息</a></p>
		<popup v-if="visible" @close="visible=false" :visible="visible" :formData="popupData"  @getIsLogin="getIsLogin" @addSuccess="addSuccess" :typeList="applytype" :parApplyType="parApplyType"></popup>

		<el-dialog
		title="实名认证"
		:visible.sync="myauthVisible"
		size="tiny" :close-on-press-escape="false" :lock-scroll="false" :close-on-click-modal="false"
		class="ie9"
		:class="{'real':stepsIndex!=3,'end':stepsIndex==3}" @close="close">
			<div class="prompt" v-if="stepsIndex!=3">
				<p>为了您的信息安全及存证的合法性，请填写您的个人信息，进行银联四要素实名验证。实名认证后，信息不可修改。</p>
			</div>
			<div v-loading="dialogLoading" v-if="dialogLoading" element-loading-text="验证中" style="min-height: 280px;"></div>
			<!-- 步骤条 -->
			<div class="steps_list mt20 mb20" v-if="!dialogLoading && stepsIndex!=3">
				<i class="bdp"></i>
				<div class="list_steaps clearfix">
					<p class="fl">
						<span :class="{'bgc_list':stepsIndex==1}" class="list_num">1</span>
						<span class="txt mt10">填写实名资料</span>
					</p>
					<p class="fl" style="margin:0 65px;">
						<span :class="{'bgc_list':stepsIndex==2}" class="list_num">2</span>
						<span class="txt mt10">手机验证</span>
					</p>
					<p class="fl">
						<span :class="{'bgc_list':stepsIndex==3}" class="list_num">3</span>
						<span class="txt mt10">完成</span>
					</p>
				</div>
			</div>
			<!-- 第一步 -->
			<div class="list_one" v-if="!dialogLoading && stepsIndex==1">
				<el-form ref="first" :rules="rules" :model="first" label-width="70px">
					<el-form-item label="姓名" style="margin-bottom:0">
						<span>{{tempSelectedApplySubject.apply_name}}</span>
					</el-form-item>
					<el-form-item label="身份证号" style="margin-bottom:10px;">
						<span>{{tempSelectedApplySubject.apply_number}}</span>
					</el-form-item>
					<el-form-item label="银行卡号" prop="number">
						<el-input v-model="first.number" placeholder="请输入银行卡号" :maxlength="19"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="first.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!-- 第二步 -->
			<div class="list_second" v-if="!dialogLoading && stepsIndex==2">
				<el-form ref="second" :rules="rules2" :model="second" label-width="70px">
					<el-form-item label="手机号" style="margin-bottom:0">
						<span>{{first.phone}}</span>
					</el-form-item>
					<el-form-item label="验证码" prop="codenum">
						<el-input v-model="second.codenum" placeholder="请输入验证码"></el-input>
					</el-form-item>
				</el-form>
				<button class="btn getcode" :class="{disabled: preventCode}" @click.prevent="getCode">{{codeText}}</button>
			</div>
			<!-- 第三步 -->
			<div class="list_end" v-if="!dialogLoading && stepsIndex==3">
				<img src="~assets/img/success.png" alt="">
				<p class="mt10 mb20">实名认证成功</p>
				<button @click.prevent="authSuccess">确定</button>
			</div>
			<div class="btn_list" v-if="!dialogLoading && stepsIndex!=3">
				<button class="back mr20" v-if="stepsIndex==2" @click.prevent="stepsIndex=1">上一步</button>
				<button @click.prevent="nextClick">下一步</button>
			</div>
		</el-dialog>

		<el-dialog
		title="实名认证"
		:visible.sync="myauthVisibleQy"
		size="small"  :close-on-press-escape="false" :lock-scroll="true" :modal-append-to-body="true" :close-on-click-modal="false"
		class="ie9 qy_realname" :class="{'start':stepsNum>=1,'Qyend':stepsNum==4}" @close="QyNull">
			<div v-if="stepsNum<3" class="qy_tit">
				请仔细核对您填写的企业对公账户，我们会通过小额打款的方式进行实名认证
			</div>
			<div v-if="stepsNum==3" class="qy_txt">
				尊贵的会员您好，我们已于{{tempSelectedApplySubjectQy.paymentTime | dateFilter}}汇款到您的对公帐号，请将银行支付业务收款回单上的“汇款金额及验证码”准确的填写在指定位置。
			</div>
			<!-- 步骤条 -->
			<div v-if="stepsNum<4" class="steps_list mt20 mb20">
				<i class="bdp ml20"></i>
				<div class="list_steaps clearfix">
					<p class="fl">
						<span :class="{'bgc_list':stepsNum>=1}" class="list_num">1</span>
						<span class="txt mt10">填写实名资料</span>
					</p>
					<p class="fl" style="margin-left:31px;margin-right:29px">
						<span :class="{'bgc_list':stepsNum>=2}" class="list_num">2</span>
						<span class="txt mt10">信息审核</span>
					</p>
					<p class="fl" style="margin-right:30px">
						<span :class="{'bgc_list':stepsNum>=3}" class="list_num">3</span>
						<span class="txt mt10">确认打款</span>
					</p>
					<p class="fl">
						<span :class="{'bgc_list':stepsNum>=4}" class="list_num">4</span>
						<span class="txt mt10">完成</span>
					</p>
				</div>
			</div>
			<div v-loading="dialogLoading" v-if="dialogLoading" element-loading-text="验证中" style="min-height: 280px;"></div>
			<!-- 第一步 -->
			<div class="list_one" v-if="!dialogLoading && stepsNum==1">
				<el-form ref="firstQy" :rules="rulesQy" :model="firstQy" label-width="140px">
					<el-form-item label="企业名称" style="margin-bottom:0">
						<span>{{tempSelectedApplySubjectQy.apply_name}}</span>
					</el-form-item>
					<el-form-item label="统一社会信用代码" style="margin-bottom:10px;">
						<span>{{tempSelectedApplySubjectQy.apply_number}}</span>
					</el-form-item>
					<el-form-item label="企业对公账户" prop="in_acct_no">
						<el-input v-model="firstQy.in_acct_no" placeholder="请填写企业对公账户" :maxlength="32"></el-input>
					</el-form-item>
					<el-form-item label="对公账户开户行" prop="bank_name">
						<el-select popper-class="select" v-model="firstQy.bank_name" filterable placeholder="请选择对公账户开户行">
							<el-option-group :label="'如您未找到当地支行，请选择当地总行'">
								<el-option
									v-for="item in optionsBank"
									:key="item.bankCode"
									:label="item.bankName"
									:value="item.bankCode+'@'+item.bankName">
								</el-option>
							</el-option-group>
						</el-select>
					</el-form-item>
					<el-form-item label="企业营业执照副本复印件（加盖公章）">
						<!-- <div class="file_up clearfix">
							<uploader class="fl" @complete="setUploadedData" :valueName="'standby1'" :url="standby1" :fileName="standby1_name" :size="2" :extensions="'doc,docx,jpeg,pdf,zip'" :postAction="czUrl+'/EvidenceController/uploadData.do'"></uploader>
							<div class="right_txt fl mt20">
								<p>• 请上传企业营业执照副本复印件并加盖企业公章</p>
								<p>• 格式说明：格式为PDF，大小限2M以内</p>
							</div>
							<el-input v-model="standby1" style="display:none"></el-input>
						</div> -->
						<a class="qy_preview" :href="tempSelectedApplySubjectQy.standby1" target="_blank">
							<img :src="QyImgSrc" alt="">
						</a>
					</el-form-item>
					<p class="failure" v-if="tempSelectedApplySubjectQy.is_checked==4"><span class="failure_l">失败原因：</span><span class="failure_r">{{tempSelectedApplySubjectQy.authFailReason}}</span></p>
				</el-form>
				<button @click="Qynext">下一步</button>
			</div>
			<!-- 第二步 -->
			<div class="list_two mt30" v-if="!dialogLoading && stepsNum==2">
				<img src="~assets/img/literature/qyreal.png" alt="">
				<p class="real_tit mt10">实名认证申请已提交</p>
				<p class="real_time mt10">审核时间预计为1~2个工作日，不含法定节假日</p>
				<button class="mt20" @click="Qyaudit">确定</button>
			</div>
			<!-- 第三步 -->
			<div class="list_threen" v-if="!dialogLoading && stepsNum==3">
				<el-form ref="formInfo" :rules="formRules" :model="formInfo" label-width="140px">
					<el-form-item label="企业名称" style="margin-bottom:0">
						<span>{{tempSelectedApplySubjectQy.apply_name}}</span>
					</el-form-item>
					<el-form-item label="企业对公账户" style="margin-bottom:0px;">
						<span>{{tempSelectedApplySubjectQy.inAcctNo}}</span>
					</el-form-item>
					<el-form-item label="对公账户开户行" style="margin-bottom:10px;">
						<span>{{tempSelectedApplySubjectQy.bankName}}</span>
					</el-form-item>
					<el-form-item label="汇款金额" prop="orderAmount">
						<el-input v-model="formInfo.orderAmount" placeholder="请输入银行支付业务收款回单上的汇款金额" :maxlength="5"></el-input>
					</el-form-item>
					<el-form-item label="验证码" prop="validCode">
						<el-input v-model="formInfo.validCode" placeholder="请输入银行支付业务收款回单附言栏上的验证码" :maxlength="6"></el-input>
					</el-form-item>
				</el-form>
				<div class="btm_btn mt30">
					<button class="btn_l" @click="Qyaudit">取消</button>
					<button class="btn_r ml10" @click="certification">提交认证</button>
				</div>
			</div>
			<!-- 第四步 -->
			<div class="list_end" v-if="stepsNum==4">
				<img src="~assets/img/literature/qyrealSuccess.png" alt="">
				<p class="mt10">实名认证成功</p>
				<button class="mt20" @click="Qyaudit">继续存证</button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import qs from 'qs'
	import uploader from 'components/uploader/uploader.vue'
	import popup from 'components/applySubject/Popup.vue'
	import realName from 'components/applySubject/realName.vue'
	import FauxPlaceholder from 'assets/js/ie9Compatible.js'
	const indexUrl = CONFIG.indexUrl;
	const czUrl = CONFIG.czUrl;
	const spUrl = CONFIG.spUrl;
	const userUrl = CONFIG.userUrl;
	const getSubjectUrl = userUrl + '/api/subject';
	// 检查标签是否支持该属性
	function ElementSupportAttribute(elm, attr) {
		var test = document.createElement(elm);
		return attr in test;
	}
	// 粗略判断，因为只要兼容ie9+
	const isIE9 = !ElementSupportAttribute('input','placeholder');

	export default {
		props:['needRender', 'authVisible', 'notarizationType','authVisibleQy'],
		data() {
			let checkPhone = (rule, value, callback) => {
				let reg = /^1\d{10}$/;
				if (!value) {
					return callback(new Error('请填写联系人手机号'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('手机号格式错误'));
					} else {
						callback();
					}
				}, 200);
			};
			let bankNumber = (rule, value, callback) => {
				let reg = /^[1-9]{1}\d{8,19}$/;
				if (!value) {
					return callback(new Error('请填写银行卡号'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('银行卡号格式错误'));
					} else {
						callback();
					}
				}, 200);
			};
			let checkacct = (rule, value, callback) => {
				let reg = /^[0-9]\d{0,}$/;
				if (!value) {
					return callback(new Error('请填写企业对公账户'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('企业对公账户格式错误'));
					} else {
						callback();
					}
				}, 200);
			};
			let checCode = (rule, value, callback) => {
				let reg = /^[0-9]\d{0,}$/;
				if (!value) {
					return callback(new Error('请输入银行支付业务收款回单附言栏上的验证码'));
				}
				setTimeout(() => {
					if (!reg.test(value)) {
						callback(new Error('验证码格式错误'));
					} else {
						callback();
					}
				}, 200);
			};
			return {
				formInfo:{
					orderAmount:'',
					validCode:''
				},
				QyImgSrc:'',//企业实名认证图片预览
				stepsNum:1,
				standby1:'',
				optionsBank:[],
				myauthVisibleQy:false,
				loading: false,
				applytype: '2',
				userUrl: userUrl,
				visible: false,
				nologin: true,
				parApplyType: 2,
				popupData: {},
				applySubjectId: '',
				total:'', //主体总数量
				limit:'', //主体上限数量
				listsData: [],
				listsDataQy: [],
				dialogLoading: false,
				myauthVisible: false, //控制认证弹窗显示
				tempSelectedApplySubject: {}, //选中的未实名认证的主体数据临时存储
				tempSelectedApplySubjectQy:{},//选中的企业未实名认证的主体数据临时存储
				codeText:'获取验证码',
				timer:'',
				preventCode: false,
				first:{},
				formRules:{
					orderAmount:[
						{ required: true, message: '请输入银行支付业务收款回单上的汇款金额', trigger: 'blur'}
					],
					validCode:[
						{ required: true, type: "string",validator:checCode,trigger: 'blur' }
					]
				},
				firstQy:{
					in_acct_no:'',
					bank_name:''
				},
				rulesQy:{
					in_acct_no:[{required: true, type: "string",validator:checkacct,trigger: 'blur' }],
					bank_name:[
						{ required: true, message: '请选择对公账户开户行', trigger: 'change'}
					]
				},
				second:{},
				stepsIndex:1,
				rules:{
					phone:[{ type: "string",validator:checkPhone,trigger: 'blur' }],
					number:[{ type: "string",validator:bankNumber,trigger: 'blur' }]
				}
			}
		},
		components: {
			popup,realName,uploader
		},
		mounted () {
			var self = this;
			self.myauthVisibleQy = false;
			this.myauthVisible = this.authVisible;
			this.myauthVisibleQy = this.authVisibleQy;
			this.bankList();
			this.initListsData();
		},
		methods: {
			certification(){//提交认证
				var self = this;
				this.$refs['formInfo'].validate((valid) => {
					if (valid) {
						self.dialogLoading = true;
						console.log(this.formInfo)
						self.$http.post(czUrl + '/EvidenceController/subject/verifyCompanyAuth.do',qs.stringify({
							apply_subject_id:self.tempSelectedApplySubjectQy.apply_id,
							validCode:self.formInfo.validCode,
							orderAmount:self.formInfo.orderAmount
						}))
						.then(function(response) {
							self.dialogLoading = false;
							console.log(response)
							if(response.data.code == 200){
								self.stepsNum = 4;
								self.$refs['formInfo'].resetFields();
							}else{
								self.$message({
									message: response.data.desc,
									type: 'warning'
								});
							}
						})
						.catch(function(error) {
							self.dialogLoading = false;
							self.$message({
								message: error.data.desc,
								type: 'warning'
							});
						})
					}
				})
			},
			setUploadedData(data){//上传文件
				this[data.valueName]= data.data.url
				this[data.valueName+'_name']= data.data.fileName;
				if(this.standby3){
					this.fileSize=data.data.fileSize;
				}
				if(data.data.code=='3010019'){
					this.$message.error('文件名称长度不能超过30个字符');
				}
			},
			Qynext(){//下一步
				console.log(this.firstQy)
				var self = this;
				var bank = this.firstQy.bank_name.split('@');
				console.log(bank)
				this.$refs['firstQy'].validate((valid) => {
					if (valid) {
						self.dialogLoading = true;
						// this.stepsNum = 2;
						self.$http.post(czUrl + '/EvidenceController/subject/authentication.do',qs.stringify({
							apply_subject_id:self.tempSelectedApplySubjectQy.apply_id,
							bank_card:self.tempSelectedApplySubjectQy.bankCard,
							bank_phone:self.tempSelectedApplySubjectQy.bankPhone,
							auth_type: 2,
							in_acct_no:self.firstQy.in_acct_no,
							bank_name:bank[1],
							bank_code:bank[0]
						}))
						.then(function(response) {
							console.log(response)
							self.dialogLoading = false;
							if(response.data.code == 200){
								self.stepsNum = 2;
								self.$refs['firstQy'].resetFields();
							}else{
								self.$message({
									message: response.data.desc,
									type: 'warning'
								});
							}
						})
						.catch(function(error) {
							this.dialogLoading = false;
							self.$message({
								message: error.data.desc,
								type: 'warning'
							});
						})
					}else{
						// this.stepsNum = 2;
					}
				})
			},
			Qyaudit(){
				this.initListsData();
				// 如果审核通过
				this.$emit('update:authVisibleQy', false);
				if(this.stepsNum == 1 || this.stepsNum == 2){
					this.$refs['firstQy'].resetFields();
				}else if(this.stepsNum == 3 || this.stepsNum == 4){
					this.$refs['formInfo'].resetFields();
				}
			},
			QyNull(){
				this.dialogLoading = false;
				if(this.stepsNum == 1){
					this.$refs['firstQy'].resetFields();
				}else if(this.stepsNum == 3){
					this.$refs['formInfo'].resetFields();
				}
			},
			close(){//关闭认证框，数据初始化
				this.first.number = '';
				this.first.phone = '';
			},
			bankList(){
				var self = this;
				this.$http.post(czUrl + '/EvidenceController/findNotarizationBank.do',{
					bankName:''
				})
				.then(function(response) {
					self.optionsBank = response.data.data;
				})
				.catch(function(error) {

				})
			},
			initListsData(){
				this.getListsData('5', 'listsData');
				this.getListsData('2', 'listsDataQy');
			},
			// 会员主体类型，1：大陆个体，2：大陆企业，3：境外个体，4：境外企业 typesList: 1,4 逗号隔开
			getListsData(applyType, dataName, showLoading){
				var self = this;
				self.loading = true;
				self.nologin = false;
				this.$http.get(getSubjectUrl + '?typesList=' + applyType + '&access_token='+ this.$cookie.get('user_token') + '&t=' + new Date().getTime())
				.then(function(response) {
					self.loading = false;
					var data = response.data;
					self[dataName] = data.elements;
					self.total = data.total;
					self.limit = data.limit;
				})
				.catch(function(error) {
					self.loading = false;
					if (!error.response) {
						if (location.href.indexOf('literatureNew')!==-1) {
							location.href = CONFIG.userUrl + '/iprp/#/access/login?return_url='+ encodeURIComponent(location.href);
						}else{
							self.$emit('nologin');
							self.nologin = true;
						}
						return;
					}
					var data = error.response.data;
					if(data.status == '401'){//未登录
						if (location.href.indexOf('literatureNew')!==-1) {
							location.href = CONFIG.userUrl + '/iprp/#/access/login?return_url='+ encodeURIComponent(location.href);
						}else{
							self.$emit('nologin');
							self.nologin = true;
						}
					}
				});
			},
			addSuccess(){
				this.visible = false;
				this.initListsData();
			},
			setSelected(item){
				this.tempSelectedApplySubject = item;
				this.applySubjectId = item.apply_id;
				this.$emit('selectApplySubjectId', {
					orderApplySubjectId: item.apply_id,
					apply_name: item.apply_name,
					apply_type: item.apply_type,
					apply_number: item.apply_number
				});
			},
			// 个人实名认证
			selectApplySubject(item){
				let self = this;
				this.tempSelectedApplySubject = item;
				if (item.is_checked) {
					this.setSelected(item);
					this.$emit("getApplySubjectId");
				}else{
					this.$confirm('您是否确定该个人主体信息正确并提交认证？','提示',{type:'warning',center:true}).then(action=>{
						self.$http.post(czUrl + '/EvidenceController/subject/verifyIdCard',qs.stringify({
							apply_subject_id:self.tempSelectedApplySubject.apply_id
						})).then(res=>{
							this.initListsData();
							// this.$message.error(res&&res.response.data&&res.response.data.msg)
							if(res.data.code){
								this.$message.error(res.data.desc)
							}else{
								if(res.data.status==200){
									this.$message.success(res.data.msg)
								}else{
									this.$message.error(res.data.msg)
								}
								
							}
							
						}).catch(err=>{
							this.$message.error(err&&err.response.data&&err.response.data.msg ||'认证失败')
						})
					}).catch(cancel=>{
					})
					// setTimeout(function(){
					// 	FauxPlaceholder();
					// },300);
					// this.tempSelectedApplySubject = item;
					// this.$emit('update:authVisible', true);
				}
			},
			// 企业实名认证
			// else if (item.is_checked == 4) {
			// 		this.stepsNum = 1;
			// 		this.tempSelectedApplySubjectQy = item;
			// 		this.$emit('update:authVisibleQy', true);
			// 		this.$http.get(spUrl + '/iprp_servicer/api/preview?pdf_url='+item.standby1)
			// 		.then(function(response) {
			// 			var data = response.data;
			// 			self.QyImgSrc = data.urls[0];
			// 		})
			// 		.catch(function(error) {
			// 		})
			// 	}
			selectApplySubjectQy(item){
				var self = this;
				this.tempSelectedApplySubjectQy = item;
				if (item.is_checked == 1) {
					this.setSelected(item);
					this.$emit("getApplySubjectId");
				}else if(item.is_checked == 2 || item.is_checked == 3){
					this.$message.warning('认证中')
					// setTimeout(function(){
					// 	FauxPlaceholder();
					// },300);
					// this.stepsNum = item.is_checked;
					// this.tempSelectedApplySubjectQy = item;
					// this.$emit('update:authVisibleQy', true);
					// this.$http.get(spUrl + '/iprp_servicer/api/preview?pdf_url='+item.standby1)
					// .then(function(response) {
					// 	var data = response.data;
					// 	self.QyImgSrc = data.urls[0];
					// })
					// .catch(function(error) {
					// })
				}else{
					this.$confirm('<p>您是否确定该企业主体信息正确并提交认证？</p><p>企业审核需要1-2个工作日，审核期间不可需改信息。</p>','提示',{type:'warning',center:true,dangerouslyUseHTMLString: true}).then(action=>{
						self.$http.post(czUrl + '/EvidenceController/subject/verifyIdCard',qs.stringify({
							apply_subject_id:self.tempSelectedApplySubjectQy.apply_id
						})).then(res=>{
							this.initListsData();
							this.$message.success('提交成功')
						}).catch(err=>{
							this.initListsData();
							this.$message.error(err&&err.response.data&&err.response.data.msg ||'提交失败')
						})
					}).catch(err=>{
					})
					// this.stepsNum = 1;
					// this.tempSelectedApplySubjectQy = item;
					// this.$emit('update:authVisibleQy', true);
					// this.$http.get(spUrl + '/iprp_servicer/api/preview?pdf_url='+item.standby1)
					// .then(function(response) {
					// 	var data = response.data;
					// 	self.QyImgSrc = data.urls[0];
					// })
					// .catch(function(error) {
					// })
				}
			},
			showPopup(item, apply_type){
				var self = this;
				if (item.apply_type) {
					this.popupData = item;
					this.parApplyType = item.apply_type;
				}else{
					if (self.nologin) {
						self.$emit('nologin');
						return;
					}
					this.popupData = {}
					if (self.total && self.total===self.limit) {
						return;
					}
				}
				this.applytype = item.apply_type ? item.apply_type : apply_type;
				this.visible = true;
			},

			//未登录的事件  向 app.vue传
			getIsLogin(){
				this.nologin = true;
				this.$emit('getIsLogin');
			},
			//实名认证成功，点击确定
			authSuccess(){
				this.$emit('update:authVisible', false);
				this.setSelected(this.tempSelectedApplySubject);
				this.initListsData();
			},
			authentication(noloading){
				var self = this;
				var item = self.tempSelectedApplySubject;
				if (!noloading) {
					this.dialogLoading = true;
				}
				self.preventCode = true;
				self.$http.post('./EvidenceController/subject/authentication.do', qs.stringify({
					apply_subject_id: item.apply_id,
					bank_card: this.first.number,
					bank_phone:this.first.phone
				}))
				.then((response) => {
					this.dialogLoading = false;
					var data = response.data;
					if (data.code == 200) {
						self.$message.success('验证码已发送');
						self.stepsIndex = 2;
						self.timeout();
						self.second.mobile_code = '';
					}else{
						self.$message({
							message: data.desc,
							type: 'error'
						});
					}
				})
				.catch((error) => {
					this.dialogLoading = false;
					if (error.response && error.response.data) {
						this.$message({
							message: error.response.data.desc,
							type: 'error'
						});
					}
				});
			},
			verifyMobCode(){
				var self = this;
				var item = self.tempSelectedApplySubject;
				this.dialogLoading = true;
				self.$http.post('./EvidenceController/subject/verifyMobCode.do', qs.stringify({
					apply_subject_id: item.apply_id,
					mobile_code: this.second.codenum
				}))
				.then((response) => {
					this.dialogLoading = false;
					var data = response.data;
					if (data.code == 200) {
						self.stepsIndex = 3;
					}else{
						self.$message({
							message: data.desc,
							type: 'error'
						});
					}
				})
				.catch((error) => {
					this.dialogLoading = false;
					if (error.response && error.response.data) {
						this.$message({
							message: error.response.data.desc,
							type: 'error'
						});
					}
				});
			},
			//实名认证下一步
			nextClick(){
				var self = this;
				var item = self.tempSelectedApplySubject;
				if(self.stepsIndex == 1){
					self.$refs['first'].validate((valid) => {
						if (valid) {
							self.authentication();
						}
					});
				}else if(self.stepsIndex == 2){
					self.$refs['second'].validate((valid) => {
						if (valid) {
							self.verifyMobCode();
						}
					});
				}
			},
			//获取手机验证码
			getCode(){
				var self = this;
				if (self.preventCode) {
					return;
				}
				self.authentication(true);
			},
			timeout(){
				var self = this;
				var second = 60;
				self.preventCode = true;
				if (self.timer) {
					return;
				}
				self.timer = setInterval(function(){
					if(second<=0){
						clearInterval(self.timer);
						second = 60;
						self.codeText = "重发验证码";
						self.preventCode = false;
					}else{
						self.codeText = second + "s后可重发";
						self.preventCode = true;
						second--;
					}
				}, 1000);
			}
		},
		watch:{
			needRender(){
				if (this.needRender) {
					this.nologin = false;
					this.initListsData();
				}
			},
			visible(){
				var v = $('.v-modal');
				var body = document.getElementsByTagName("body")[0];
				if (this.visible) {
					body.style.overflow = 'hidden';
					body.style.height = window.innerHeight + 'px';
					if (v.length) {
						v.show()
					}else{
						$('body').append('<div class="v-modal" style="z-index: 999;"></div>');
					}
				}else{
					body.style.overflow = 'auto';
					body.style.height = 'auto';
					v.hide();
				}
				/*this.initData();
				if (this.visible) {
					this.initProvince();
					this.initCountry();
				}*/
			},
			authVisible(){
				this.myauthVisible = this.authVisible;
			},
			authVisibleQy(){
				this.myauthVisibleQy = this.authVisibleQy;
			},
			myauthVisible(){
				this.stepsIndex = 1;
				if (this.myauthVisible) {
					setTimeout(() => {
						this.$refs['first'].resetFields();
						this.first = {};
					}, 100);
				}
				this.$emit('update:authVisible', this.myauthVisible);
			},
			myauthVisibleQy(){
				// this.stepsIndex = 1;
				// if (this.myauthVisible) {
				//   setTimeout(() => {
				//     this.$refs['first'].resetFields();
				//     this.first = {};
				//   }, 100);
				// }
				this.$emit('update:authVisibleQy', this.myauthVisibleQy);
			}
		},
		filters:{
			dateFilter(v){
				var t = v;
				if (typeof v === 'string') {
					t = new Date(v).getTime();
				}
				//日期格式转换
				var dateFormat = function (input,type) {
					if(input == null || input=='' || typeof(input) == "undefined"){
							return "--";
					}
					var _date = new Date(input);
					var year = _date.getFullYear();
					var month = _date.getMonth() + 1 > 9 ? _date.getMonth() + 1 : "0" + (_date.getMonth() + 1);
					var day = _date.getDate() > 9 ? _date.getDate() : "0" + _date.getDate();
					var hour = _date.getHours() > 9 ? _date.getHours() : "0" + _date.getHours();
					var minutes = _date.getMinutes() > 9 ? _date.getMinutes() : "0" + _date.getMinutes();
					var seconds = _date.getSeconds() > 9 ? _date.getSeconds() : "0" + _date.getSeconds();
					if(type == "date"){
							return year + "年" + month + "月" + day+ "日";
					} else if(type == "time") {
							return hour + ":" + minutes + ":" + seconds;
					} else {
							return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
					}
					return "--";
				}
				return dateFormat(t, "date");
			},
			applyTypeFilter(input){
				var ret = ''
				switch (input+''){
					case '1':
						ret = "大陆个体";
						break;
					case '2':
						ret = "大陆企业";
						break;
					case '3':
						ret = "境外个体";
						break;
					case '4':
						ret = "境外企业";
						break;
					case '5':
						ret = "大陆个人";
						break;
				}
				return ret;
			}
		}
	}
</script>


<style lang="scss">
.applySubjectQy{
	min-height: 280px;
	h3{font-size:16px;height: 40px;line-height: 40px;}
	.mainOwern-wrap{
		.tips{padding:10px 20px;line-height: 24px;min-height: 44px;background-color: #fff6e2;}
		.mainOwern{padding:0 0 0;
			.main_body{
				margin-top: -5px;
				h4{padding:10px 0;font-weight: normal;}
				div{position: relative;width:320px;height:90px;border:1px solid #cfecff;border-radius:2px;background:rgba(61,177,250,0.05) url(~assets/img/literature/hover.png) no-repeat;background-position:right bottom;padding-left:20px;cursor:pointer;
					.tit{position: absolute;top: -1px;right:0;width:auto; padding:0 6px;height:24px;line-height:24px;color:#fff;font-size: 12px;border-radius:0 0 6px 6px;text-align:center;margin-right: 6px;}
					.haschecked{background-color:#3db1fa;}
					.checking{background-color: #FFBE00;}
					.fail{background-color: #F64744;}
					.nocheck{background-color: #333;}
					.name{font-size: 16px;color: #333333;line-height:24px;width:290px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
					.type{font-size: 14px;color: #666666;line-height:19px;width:60px;display:inline-block;}
					.edit{font-size: 13px;display:none;}
				}
				div:hover{
					.edit{display:inline-block;}
				}
				div.active{border-color: #3db1fa;}
				div.disabled{
					cursor: default;
				}
				.edit:hover{color:#3db1fa;}
				.add_apply{width:320px;height:90px;border:1px solid #ddd;border-radius:2px;background:rgba(221,221,221,0.05) url(~assets/img/literature/hovernull.png) no-repeat;background-position:right bottom;padding-left:0px;
					p{font-size: 14px;color: #666666;line-height:90px;text-align:center;
					}
				}
				div:hover{border-color:#3db1fa;}
				.add_apply.disabled:hover{
					border-color:#ddd;
					p{color:#666;}
				}
				.add_apply:hover{border-color:#3db1fa;
					p{color:#3db1fa;}
				}
			}
		}
	}
	.limit-tip{
		padding-left:0;padding-bottom:10px;color: #666;
		a{color: #3db1fa;}
	}


	.real{
		.prompt{background: #FFF7E4;padding:10px;
			p{font-size:13px;color: #D8A045;line-height:18px;}
		}
		.steps_list{text-align:center;height:64px;position: relative;
			.bdp{border: 1px dashed #DDDDDD;width:320px;height:1px;display:inline-block;vertical-align: top;margin-top: 17px;}
			.list_steaps{width:382px;position: absolute;top:0;left:64px;
				p{width:84px;text-align:center;
					span{display:block;font-size:14px;}
					.list_num{width:34px;height:34px;text-align:center;line-height:34px;border-radius:50%;border:1px solid #3db1fa;margin:0 auto;color:#3db1fa;background-color:#fff;}
					span.bgc_list{background-color:#3db1fa;color:#fff;}
					.txt{color: #666666;line-height:20px;}
				}
			}
		}

		.list_one{width:430px;margin:0 auto;
			.el-form-item{
				.el-form-item__label{height:34px;}
				.el-form-item__content{width:360px;height:34px;
					.el-input{height:34px;
						.el-input__inner{height:34px;line-height:30px;}
					}
				}
			}
		}
		.list_second{width:430px;margin:0 auto;position: relative;
			/* button{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;line-height:34px;position: absolute;bottom:0;right:0;} */
			.el-form-item{
				.el-form-item__label{height:34px;}
				.el-form-item__content{width:250px;height:34px;
					.el-input{height:34px;
						.el-input__inner{height:34px;line-height:34px;}
					}
				}
			}
			.getcode{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;line-height:34px;position: absolute;bottom:0;right:0;}
			.getcode:hover{background-color: #3db1fa;color: #fff;border-color: #3db1fa;}
			.getcode.disabled{background-color: #ccc;border-color:#ccc;color: #eee;cursor:not-allowed;}
		}
		.btn_list{height:34px;text-align:center;font-size:0px;padding-bottom:20px;
			button{width:100px;height:34px;background: #3db1fa;border-radius: 3px;font-size: 14px;color: #fff;text-align:center;line-height:34px;}
			button.back{background: #fff;color:#3db1fa;border:1px solid #3db1fa;}
		}
		// 弹框尺寸
		.el-dialog{width:560px;
			.el-dialog__header{
				span{font-size:14px;color: #333333;line-height:16px;}
			}
			.el-dialog__body{padding:20px 20px 40px;}
		}
	}
	.end{
		.el-dialog{width:440px;transition:all 0.2s ease;}
		.list_end{width:245px;margin:0 auto;text-align:center;
			p{text-align:center;font-size: 16px;color: #3DB1FA;line-height:100%;}
			button{width:100px;height:34px;background: #3db1fa;border-radius: 3px;font-size: 14px;color: #fff;text-align:center;line-height:34px;}
		}
	}
	.start{
		>div{width:560px;}
	}
	.Qyend{
		>div{width:440px;}
	}
	.qy_realname{
		.qy_tit{background: #FFF7E4;width:520px;height:38px;line-height:38px;font-size: 13px;color: #D8A045;padding-left:10px;}
		.qy_txt{line-height:18px;font-size: 13px;color: #09BB07;height:56px;background: #F4FCF6;border: 1px solid #ECF4EE;padding:10px;}
		.el-form-item{
			.el-form-item__content{width:300px;text-align: left;
				span{color:#333;}
				.el-select{width:100%;}
				.el-input{height:34px;
					::-webkit-input-placeholder { /* WebKit browsers */
						font-size: 13px;color:#999;
					}
					:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
						font-size: 13px;color:#999;
					}
					::-moz-placeholder { /* Mozilla Firefox 19+ */
						font-size: 13px;color:#999;
					}
					:-ms-input-placeholder { /* Internet Explorer 10+ */
						font-size: 13px;color:#999;
					}
					.el-input__inner{height:34px;line-height:30px;border-radius:3px;}
					.el-input__icon{line-height: 20px;}
				}
			}
		}
		.el-form-item__label{height:34px;color:#666;}
		.steps_list{text-align:center;height:64px;position: relative;
			.bdp{border: 1px dashed #DDDDDD;width:315px;height:1px;display:inline-block;vertical-align: top;margin-top: 17px;}
			.list_steaps{width:430px;position: absolute;top:0;left:45px;
				p{width:84px;text-align:center;
					span{display:block;font-size:14px;}
					.list_num{width:34px;height:34px;text-align:center;line-height:34px;border-radius:50%;border:1px solid #3db1fa;margin:0 auto;color:#3db1fa;background-color:#fff;}
					span.bgc_list{background-color:#3db1fa;color:#fff;}
					.txt{color: #666666;line-height:20px;}
				}
			}
		}
		.list_one{width:490px;margin:0 auto;text-align:center;
			.file_up{
				p{width:110px;font-size: 14px;color: #666666;}
				.right_txt{padding-top:35px;vertical-align: bottom;margin-left:5px;
					p{width:175px;text-align:left;font-size: 12px;color: #999999;line-height: 16px;}
				}
			}
			.qy_preview{display:block;width:122px;height:122px;border:1px solid #eee;
				img{width:120px;height:120px;}
			}
			button{width:140px;height:42px;color:#fff;background: #3DB1FA;border-radius: 3px;font-size: 14px;margin-top:8px;}
			.failure{font-size:14px;color: #ff4949;width:490px;text-align:left;margin-top:-10px;
				span{word-break:break-all;}
				.failure_l{vertical-align: top;width:140px;display:inline-block;text-align:right;padding-right: 15px;}
				.failure_r{width:350px;display:inline-block;padding-left:10px;}
			}
		}

		.list_two{text-align:center;
			.real_tit{font-size: 16px;color: #333333;}
			.real_time{font-size: 12px;color: #666666;}
			button{width:140px;height:42px;color:#fff;background: #3DB1FA;border-radius: 3px;font-size: 14px;}
		}

		.list_threen{
			.btm_btn{text-align: center;
				button{width:140px;height:42px;font-size:14px;}
				.btn_l{border: 1px solid #3DB1FA;border-radius: 3px;color:#3db1fa;background-color:#fff}
				.btn_r{border: 1px solid #3DB1FA;border-radius: 3px;color:#fff;background-color:#3DB1FA}
			}
		}
		.list_end{text-align: center;
			p{font-size: 16px;color: #3DB1FA;line-height:100%;}
			button{width:140px;height:42px;font-size:14px;border-radius: 3px;}
		}
	}
}
.el-select-group__title{padding-left:20px;}
</style>
