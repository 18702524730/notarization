<template>
	<!-- 存证主体模块 -->
	<div class="applySubject" v-loading="loading">
		<h3 v-if="notarizationType == 1">选择申请人</h3>
		<div class="mainOwern-wrap">
			<div class="mainOwern clearfix">
				<div class="main_body clearfix">
					<div v-for="(item, index) in listsData" :key="item.apply_id" class="fl clearfix mt20 mr15" :class="{active: applySubjectId==item.apply_id}" @click="selectApplySubject(item)">
						<p class="tit fr" v-if="item.is_checked">已实名认证</p>
						<p class="name mt20">{{item.apply_name}}</p>
						<p class="type mt5">{{item.apply_type|applyTypeFilter}}</p>
						<span class="edit ml5" @click.stop="showPopup(item)">修改</span>
					</div>
					<div v-if="listsData.length<10" class="add_apply fl clearfix mt20 mr15" :class="{disabled: total && total===limit}" @click="showPopup">
						<p><i class="el-icon-plus mr10"></i>增加申请人</p>
					</div>
				</div>
			</div>
		</div>
		<p class="limit-tip" v-if="applytype=='5' && total && total===limit">网页存证仅对大陆个人开放，当前主体信息数量已达到上限。 <a :href="userUrl+'/iprp/#/subjectList'" target="_blank">管理主体信息</a></p>
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
	</div>
</template>

<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import qs from 'qs'
	import popup from 'components/applySubject/Popup.vue'
	import realName from 'components/applySubject/realName.vue'
	import FauxPlaceholder from 'assets/js/ie9Compatible.js'
	const czUrl = CONFIG.czUrl;
	const indexUrl = CONFIG.indexUrl;
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
		props:['applytype', 'needRender', 'authVisible', 'notarizationType'],
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
			return {
				loading: false,
				userUrl: userUrl,
				visible: false,
				nologin: true,
				parApplyType: 2,
				popupData: {},
				applySubjectId: '',
				total:'', //主体总数量
				limit:'', //主体上限数量
				listsData: [],
				dialogLoading: false,
				myauthVisible: false, //控制认证弹窗显示
				tempSelectedApplySubject: {}, //选中的未实名认证的主体数据临时存储

				codeText:'获取验证码',
				timer:'',
				preventCode: false,
				first:{},
				second:{},
				stepsIndex:1,
				rules:{
					phone:[{ type: "string",validator:checkPhone,trigger: 'blur' }],
					number:[{ type: "string",validator:bankNumber,trigger: 'blur' }]
				}
			}
		},
		components: {
			popup,realName
		},
		mounted () {
			var self = this;
			this.myauthVisible = this.authVisible;
			this.initListsData();
		},
		methods: {
			close(){//关闭认证框，数据初始化
				this.first.number = '';
				this.first.phone = '';
			},
			initListsData(){
				this.getListsData(this.applytype);
			},
			// 会员主体类型，1：大陆个体，2：大陆企业，3：境外个体，4：境外企业 typesList: 1,4 逗号隔开
			getListsData(typesList){
				var self = this;
				self.loading = true;
				//qs.stringify({applyType: type})
				self.nologin = false;
				this.$http.get(getSubjectUrl + '?typesList=' + typesList + '&access_token='+ this.$cookie.get('user_token') + '&t=' + new Date().getTime())
				.then(function(response) {
					self.loading = false;
					var data = response.data;
					self.listsData = data.elements;
					self.total = data.total;
					self.limit = data.limit;
					if (data.elements.length && data.elements[0].is_checked && !self.applySubjectId) {
						// self.setSelected(data.elements[0]);
					}
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
			selectApplySubject(item){
				let self = this;
				if (item.is_checked) {
					this.setSelected(item);
					this.$emit("getApplySubjectId");
				}else{
					// this.setSelected(item)
					// this.$nextTick(()=>{

					
						this.$confirm('您是否确定该个人主体信息正确并提交认证？','提示',{type:'warning',center:true}).then(action=>{
							self.$http.post(czUrl + '/EvidenceController/subject/verifyIdCard',qs.stringify({
								apply_subject_id:item.apply_id
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
					// })
					// setTimeout(function(){
					// 	FauxPlaceholder();
					// },300);
					// this.tempSelectedApplySubject = item;
					// this.$emit('update:authVisible', true);
				}
			},
			showPopup(item){
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
			myauthVisible(){
				this.stepsIndex = 1;
				if (this.myauthVisible) {
					setTimeout(() => {
						this.$refs['first'].resetFields();
						this.first = {};
					}, 100);
				}
				this.$emit('update:authVisible', this.myauthVisible);
			}
		},
		filters:{
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
.applySubject{
	min-height: 220px;
	h3{font-size:16px;height: 40px;line-height: 40px;}
	.mainOwern-wrap{
		.tips{padding:10px 20px;line-height: 24px;min-height: 44px;background-color: #fff6e2;}
		.mainOwern{padding:0 0 0;
			.main_body{
				margin-top: -20px;
				div{width:320px;height:90px;border:1px solid #cfecff;border-radius:2px;background:rgba(61,177,250,0.05) url(~assets/img/literature/hover.png) no-repeat;background-position:right bottom;padding-left:20px;cursor:pointer;
					.tit{width:80px;height:24px;line-height:24px;background-color:#3db1fa;color:#fff;font-size: 12px;border-radius:0 0 6px 6px;text-align:center;margin-right:6px;}
					.name{font-size: 16px;color: #333333;line-height:24px;width:220px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
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
		padding-left:0;padding-bottom:10px;color: #666;padding-top: 10px;
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
}
</style>
