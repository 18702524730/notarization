<template>
	<div id="app">
		<sebe-header :userName="userName" :cartNum="cartNum"></sebe-header>
		<mini-login @callbackDo="callbackDo" :showMini.sync="showMini" @closeMini="showMini=false"></mini-login>
		<div class="container clearfix web-container-new">
			<!-- 位置导航 -->
			<div class="position-wrap" >
				<div class="position commWidth" >
					<div class="pos-nav fl">您的位置：<a :href="indexUrl">首页</a>><a :href="position[source-1]['parentUrl']">{{position[source-1]['parentName']}}</a>><span>{{position[source-1]['name']}}</span></div>
				</div>
			</div>

			<div class="content-wrap">
				<div class="top-banner"></div>
				<!-- 存证包数量 -->
				<div class="top mt15">
					<!-- <p v-if="!txtType">每一次创新，都值得守护</p>
					<p v-if="txtType==1">区块链存证+公证存证，双重保障</p>
					<p v-if="txtType==2">区块链存证+司法鉴定存证，双重保障</p> -->
					<div>
						<p>剩余存证包数量：
							<span>{{czbNum}}</span>
							<a class="ml20" :href="indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">我要购买存证包&nbsp;></a>
						</p>
					</div>
				</div>
				<div class="content commWidth web-wrap clearfix">
					<div class="steps">
						<ul>
							<li><i>1</i><span>提交信息</span></li>
							<li><i>2</i><span>截取网页</span></li>
							<li><i>3</i><span>支付费用</span></li>
							<li><i>4</i><span>存证</span></li>
						</ul>
					</div>

					<!-- 主体信息 -->
					<apply-subject style="min-height: 150px;" :applytype="'5'" :notarizationType="1" @selectApplySubjectId="getApplySubjectId" @nologin="showMini=true" :needRender="needRender" @getIsLogin='getIsLogin'  :authVisible.sync="authVisible"></apply-subject>
          <h3>提交存证信息</h3>
          <div class="webinfo-wrap">
            <div class="webinfo">
              <ul>
                <li>
                  <p><i>1</i><span>请选择存证种类</span></p>
                  <el-radio-group v-model="notarizationPurpose">
                    <el-radio label="1">电商维权</el-radio>
                    <el-radio label="2">自媒体内容维权</el-radio>
                    <el-radio label="3">设计作品未经授权发布</el-radio>
                    <el-radio label="8">其他</el-radio>
                  </el-radio-group>
                </li>
				<li>
                  <p><i>2</i><span>取证名称</span></p>
				  <div class="site-wrap mb10">
                  	<div class="ipt_container">
                    	<el-input type="text" v-model.trim="qzName" style="width:436px;" placeholder="请输入取证名称"></el-input>
                    </div>
				  </div>
                </li>
                <li>
                  <p><i>3</i><span>请输入所需存证的网址</span></p>
                  <div class="site-wrap">
                  	<div class="ipt_container">
                    	<el-input type="text" v-model.trim="site" style="width:436px;" placeholder="请输入所需存证的网址"></el-input>
                    	<button @click="getScreenshots" element-loading-text="网页截取中..." v-loading.fullscreen="fullLoading">截取</button>
                    </div>
                    <table class="mt15">
                    	<thead>
	                    	<tr>
	                    		<th width="400">证据信息</th>
	                    		<th>操作</th>
	                    	</tr>
                    	</thead>
                    	<tbody v-if="successList.length">
	                    	<tr v-for="(item, index) in successList" :key="index">
	                    		<td><span class="url">{{item.url}}</span></td>
	                    		<td class="action">
	                    			<a :href="czUrl + '/EvidenceController/downloadWebEvid.do?evidId=' + item.evidId" target="_blank">查看</a>
	                    			<a href="" @click.prevent="del(index)">删除</a>
	                    		</td>
	                    	</tr>
                    	</tbody>
                    	<tbody v-if="!successList.length">
	                    	<tr>
	                    		<td colspan="2">
	                    			<div class="empty">
	                    				<span>请在上方输入想要的存证网页网址，并截取网页内容</span>
	                    			</div>
	                    		</td>
	                    	</tr>
                    	</tbody>
                    </table>
                    <p class="tips mt20">
                      1、不支持对要求登录的网页进行存证；<br>
                      2、请直接复制浏览器地址栏网址，所存网址需含http、https等相关元素。<br>
                      3、上传的存证版权归用户自己所有，未经用户授权，平台绝对不会私自使用用户上传的作品。
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="amount">
            扣除存证包：<b>{{successList.length}}个</b>（保存时间3年）
          </div>
          <button class="btn submit-btn" @click.prevent="submitAction()">{{submitText}}</button>
					<!-- 使用存证包支付 -->
					<el-dialog title="提示" :visible.sync="payTipVisible" custom-class="dialog-payTip">
						<div class="pop_window">
							<div class="payTipCon" v-show="!payok">
								<div class="payTipText">
									<div class="czinfo">
										存证数量：1件<br>
										支付金额：{{perPriceData.fee && perPriceData.fee.toFixed(2)}}元
									</div>
									<p>
										剩余存证可抵扣次数：{{czbNum}}次<br>
										请选择支付方式：
									</p>
								</div>
								<div class="actionBtn" v-loading.fullscreen.lock="fullscreenLoading">
									<a class="otherpay" @click="czOtherPay">在线支付</a>
									<a @click="czPay">存证包抵扣</a>
								</div>
							</div>
							<div class="payTipCon" v-show="payok">
								<div class="payTipText">
									<div class="czinfo" style="text-align: center;padding-bottom:10px;">
										<img src="~assets/img/reg_login/success.png">
										<p>抵扣成功！</p>
									</div>
								</div>
								<div class="actionBtn">
									<a class="otherpay" :href="userUrl+'/iprp/#/orders'">查看订单</a>
									<a @click="continueCz">继续存证</a>
								</div>
							</div>
						</div>
					</el-dialog>

					<!-- 存证成功 -->
					<el-dialog title="提示" :visible.sync="sfvisible" size="tiny" class="validation" :lock-scroll="false" :close-on-click-modal="false" @close="resetAll">
						<div class="validation_data">
							<!-- 成功 -->
							<div class="validation_end">
								<p><span>存证成功</span><i class="el-icon-check"></i></p>
								<div class="end_btn">
									<p class="mt10">剩余存证包数量：{{czbNum}}<a class="ml15" :href="indexUrl + '/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">购买存证包</a></p>
									<div class="btn_end mt20">
										<a class="end_left mr20" :href="userUrl+'/iprp/#/myczlist?cztype=1'">查看我的存证</a>
										<a class="end_right" @click.prevent="resetAll">继续存证</a>
									</div>
								</div>
							</div>
						</div>
					</el-dialog>
          <!-- 存证包不够 -->
				  <el-dialog class="czb" title="操作提醒" width="500px" :visible.sync="czbHref" size="tiny" :lock-scroll="false" :close-on-click-modal="false" @close="getCzNum">
				    <div class="czb_info">
				      <p>抱歉，由于您的存证包数量不足，请前往购买存证包</p>
				      <a class="mt20" :href="indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">我要购买存证包</a>
				    </div>
				  </el-dialog>

				</div>
			</div>
			<customer-service :cartNum="cartNum"></customer-service>
		</div>
		<sebe-footer class="mt-15"></sebe-footer>
	</div>
</template>

<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import sebeHeader from 'components/Header.vue'
	import sebeFooter from 'components/Footer.vue'
	import applySubject from 'components/applySubject/ApplySubject.vue'
	//import fileUpload from 'vue-upload-component'
	import miniLogin from 'components/miniLogin.vue'
	import customerService from 'components/CustomerService.vue'
	import Lib from 'assets/Lib.js'
	import { EventBus } from 'assets/event-bus.js';
import { setTimeout, clearTimeout } from 'timers';
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const czUrl = CONFIG.czUrl;
	const userUrl = CONFIG.userUrl;
	const queryCzUrl = './cunnar/querycznum.do';

	const ishtml4 = !window.FormData;

  export default {
    data () {
      return {
      	fullLoading: false,
      	sfvisible: false,
      	czbHref: false,
      	successList:[],
      	count: 0,
      	timer: '',
        authVisible: false,
        userUrl: userUrl,
        cartUrl: cartUrl,
        payok: false,
        fullscreenLoading: false,
        czbNum:0, //存证包数量
        payTipVisible: false,
        cartNum:"",
        CONFIG: CONFIG,
        czUrl: czUrl,
        needRender: false, //判断是否要重新渲染申请主体列表
        indexUrl: indexUrl,
        orderApplySubjectId:'', //申请主体ID
		notarizationPurpose:'', //存证用途
		qzName:'',//取证名称
        urlList:[ //电子存证文件
          /*{
            url: '',
            fileName:'',
            fileSize:''
          }*/
        ],
        site:'',
        showMini: false,
        userName: '',
        source: 1,
        notarizationType: 1, //存证类型 2 电子存证 1网页存证
        perPriceData:{}, // 价格信息
        submitText: '立即下单',
        submitDisabled: false,
        position:[
          {
            source:1,
            name:'网页存证',
            parentName: '存证',
            parentUrl: indexUrl + '/cms/service/rightoriginal.htm'
          },
          {
            source:2,
            name:'网页存证',
            parentName: '维权存证',
            parentUrl: indexUrl + '/cms/service/righttort.htm'
          }
        ]
      }
    },
    components: {
      sebeHeader,
      applySubject,
      miniLogin,
      customerService,
      sebeFooter
    },
    mounted () {
      var self = this;
      EventBus.$on('needLogin', () => {
        this.needLogin();
      });
      this.source = (Lib.Util.getQueryString('source')-0) || 1;
      this.notarizationPurpose = '8';
      this.site = Lib.Util.getQueryString('site') || '';
      var userName = this.$cookie.get('truename');
      var phone = this.$cookie.get('phone');
      if (phone) {
        phone = phone.slice(0, 3) + '****' + phone.slice(-4);
      }
      this.userName = userName ? userName : phone;
      this.cartNum = this.$cookie.get('cart_num') || '0';
			this.getPerPrice();
			this.getCzNum();
		},
		methods: {
			resetAll(){
				this.getCzNum();
				this.sfvisible = false;
				this.successList = [];
				this.urlList = [];
				this.site = '';
			},
			del(idx){
				this.successList.splice(idx, 1);
				this.$message.success('删除成功！');
			},
			getScreenshots(){
				if (!this.orderApplySubjectId) {
					this.$message.warning('请选择申请主体。');
					return;
				}
				if (!this.qzName) {
					this.$message.warning('请输入取证名称');
					return;
				}
				if (!this.site) {
					this.$message.warning('请输入所需存证的网址');
					return;
				}
				
				if (this.site.length>500) {
					this.$message.error('输入网址过长，最长不超过500个字符');
					return;
				}
				if (!this.checkUrl(this.site)) {
					this.$message.error('输入的网址不合法，请重新输入。');
					return;
				}
				if (this.successList.length >= 5) {
					this.$message.warning('一次最多提交5个证据。');
					return;
				}

				var self = this;
				this.fullLoading = true;
				this.$http.post('./EvidenceController/addBqWebThread.do', {
					orderApplySubjectId: this.orderApplySubjectId,
					urls: this.urlList,
					qzName: this.qzName
				})
				.then((resp) => {
					resp = resp.data;
					//console.log(resp);
					if(resp.code === '0'){
						var eid = resp.data;
						this.stopQuery();
						this.intervalQuery(eid);
					}else{
						this.fullLoading = false;
						this.stopQuery();
						this.$alert(resp.desc);
					}
				}).catch((error) => {
					this.fullLoading = false;
					console.log(error);
				});
			},
			intervalQuery(id){
				// this.timer = setInterval(() => {
				// 	if (this.count > 600) {
				// 		this.fullLoading = false;
				// 		this.stopQuery();
				// 		this.$alert('截取超时，请重试', '提示');
				// 		return;
				// 	}
				// 	this.count ++ ;
				// 	this.getStatus(id);
				// }, 1000);
				this.timer = setTimeout(() => {
					if (this.count > 600) {
						this.fullLoading = false;
						this.stopQuery();
						this.$alert('截取超时，请重试', '提示');
						return;
					}
					this.count ++ ;
					this.getStatus(id);
					this.intervalQuery(id)
				}, 1000);
			},
			stopQuery(){
				this.count = 0;
				// this.timer && clearInterval(this.timer);
				clearTimeout(this.timer);
			},
			async getStatus(id){
				
				try {
					const responses = await this.$http.get('./EvidenceController/isSuccess4WebThread.do?evidId='+ id +'&t=' + Math.random())
					let resp = responses.data
					console.log(resp)
					if(resp.code === '200' && resp.status === '1'){
						this.fullLoading = false;
						this.stopQuery();
						if(this.checkUrl(this.site)){
							this.successList.push({
								evidId:id,
								url: this.site
							});
						}
						this.urlList = [];
						this.site = '';
					} else if(resp.code === '200' && resp.status === '0') {
						this.fullLoading = false;
						this.stopQuery();
						this.$alert('截取网址失败，请重试', '截取失败');
					}
				} catch (error) {
					this.fullLoading = false;
					this.stopQuery()
					console.log(error)
				}
				// this.$http.get('./EvidenceController/isSuccess4WebThread.do?evidId='+ id +'&t=' + Math.random())
				// .then((resp) => {
				// 	resp = resp.data;
				// 	console.log(resp);
				// 	if(resp.code === '200' && resp.status === '1'){
				// 		this.fullLoading = false;
				// 		this.stopQuery();
				// 		if(this.site){
				// 			this.successList.push({
				// 				evidId:id,
				// 				url: this.site
				// 			});
				// 		}
				// 		this.urlList = [];
				// 		this.site = '';
				// 	} else if(resp.code === '200' && resp.status === '0') {
				// 		this.fullLoading = false;
				// 		this.stopQuery();
				// 		this.$alert('截取网址失败，请重试', '截取失败');
				// 	}
				// }).catch((error) => {
				// 	this.fullLoading = false;
				// 	this.stopQuery()
				// 	console.log(error);
				// });
			},
			needLogin() {
				this.$message.warning('未登录或登录已失效，请登录');
				this.showMini = true;
			},
			checkUrl(url){
				return /^(https?|ftp|file):\/\/[-A-Za-z0-9\+&@#\/%\?=~_|!:,\\\.;]+[-A-Za-z0-9+&@#\/%=~_|]$/.test(url);
			},
			// 获取存证包数量
			getCzNum(){
				var self = this;
				this.$http.get(queryCzUrl + '?t=' + Math.random())
				.then((resp) => {
						resp = resp.data;
						//console.log(resp);
						if(resp.code === '0'){
							self.czbNum = resp.data;
						} else {
							//console.error(resp.msg);
						}
				}).catch((error) => {
					//console.log(error);
				});
			},
			// 获取单价信息
			getPerPrice(){
				var self = this;
				this.$http.post('./EvidenceController/findNotarizationSet.do')
				.then((resp) => {
						resp = resp.data;
						//console.log(resp);
						if(resp.code === '0'){
							var arr = resp.data;
							$.each(arr, function(i, item){
								if (item.item == self.notarizationType) {
									self.perPriceData = item;
									return false;
								}
							});
						} else {
							console.error(resp.msg);
						}
				}).catch((error) => {
					console.log(error);
				});
			},
			checkValid(){
				if (!this.orderApplySubjectId) {
					this.$message.warning('请选择申请主体。');
					return false;
				}
				if (!this.notarizationPurpose) {
					this.$message.warning('请选择存证类型。');
					return false;
				}
				if (!this.successList.length) {
					this.$message.warning('请截取网页，获取证据。');
					return false;
				}
				return true;
			},
			submit(type){
				var self = this;
				if (this.submitDisabled) {
					return;
				}
				self.submitDisabled = true;
				self.submitText = '请稍候...';
				var postData = {
					orderApplySubjectId: this.orderApplySubjectId,
					notarizationPurpose: this.notarizationPurpose,
					source: this.source,
					notarizationType: this.notarizationType,
					fileData: this.successList.map((item) => item.evidId),
					payType: type || 1,
					czChannel: 6,
				};
				self.$http.post('./EvidenceController/addWebAttestations.do', postData)
				.then((resp) => {
					console.log(resp.data)
					self.submitText = '立即下单';
					self.submitDisabled = false;
					//针对ie9的全屏loading bug
					if(ishtml4){
						$('.is-fullscreen').hide();
					}
					var resp = resp.data;
					if (resp.code === '0') {
						var d = resp.data;
						self.getCzNum();
						self.sfvisible = true;
						/*if (d && d.notarizationFee) {
							//type == 2存证包抵扣
							if (type == 2) {
								self.payok = true;
								self.getCzNum();
							}else{
								location.href = self.cartUrl + '/shop/pages/pay.html?order_sn='+ d.notarizationFee.orderFictitiousSn;
							}
						}else{
							self.$alert('订单号不存在');
						}*/
					}else if(resp.code === '4010008'){
						self.payTipVisible = false;
						self.showMini = true;
					}else if(resp.code === '1010014'){
						self.payTipVisible = false;
						self.authVisible = true;
						self.$alert('实名认证失败，请填写真实的主体信息', '提示');
					}else{
						self.payTipVisible = false;
						self.$alert('订单生成失败，请重试', '提示');
					}
				})
				.catch((error) => {
					console.log(error);
					self.$alert('订单生成失败，请重试', '提示');
					self.submitText = '立即下单';
					self.submitDisabled = false;
					//针对ie9的全屏loading bug
					if(ishtml4){
						$('.is-fullscreen').hide();
					}
				});
			},
			// 立即下单
			submitAction(){
				var self = this;
				if (this.submitDisabled || !this.checkValid()) {
					return;
				}
				if (this.czbNum < this.successList.length) {
					this.czbHref = true;
					return;
				}
				self.submitDisabled = true;
				self.$confirm('请您仔细核对网址，提交后不可修改', '提示', {
					type: 'warning',
					confirmButtonText: '确认提交',
					closeOnClickModal: false
				}).then(() => {
					self.submitDisabled = false;
					if (self.czbNum < self.successList.length) {
						self.czbHref = true;
						self.payok = false;
					}else{
						self.submit(2);
					}
				}).catch(() => {
					self.submitDisabled = false;
				});
			},
			//存证包抵扣
			czPay(){
				this.fullscreenLoading = true;
				//针对ie9的全屏loading bug
				if(ishtml4){
					$('.is-fullscreen').show();
				}
				this.submit(2);
			},
			//使用在线支付
			czOtherPay(){
				this.fullscreenLoading = true;
				//针对ie9的全屏loading bug
				if(ishtml4){
					$('.is-fullscreen').show();
				}
				this.submit(1);
			},
			getApplySubjectId(data){
				//console.log(data)
				this.orderApplySubjectId = data.orderApplySubjectId;
			},
			// 登陆后跳转判断
			callbackDo (){
				this.showMini = false;
				//this.submit();
				this.needRender = true;
				var userName = this.$cookie.get('truename');
				var phone = this.$cookie.get('phone');
				if (phone) {
					phone = phone.slice(0, 3) + '****' + phone.slice(-4);
				}
				this.userName = userName ? userName : phone;
				this.cartNum = this.$cookie.get('cart_num') || '0';
				this.getCzNum();
			},
			continueCz(){
				this.payTipVisible = false;
				this.site = '';
				this.urlList = [];
			},
			getIsLogin() {
				this.showMini = true;
			}
		},
		beforeDestroy() {
			this.timer && clearTimeout(this.timer)
		},
		watch: {
			site(){
				if (this.checkUrl(this.site)) {
					this.urlList = [];
					this.urlList.push(this.site);
				}
			}
		}
	}
</script>

<style lang="scss">
.web-container-new{
	width:100%;
	overflow: hidden;
	background-color: #f2f2f2;
	.top-banner{
		height: 180px;background: #FFF url(~assets/img/web/web_bg.jpg) center 0 no-repeat
	}
	.top{width:1170px;margin:20px auto 0;position: relative;
		>p{position: absolute;left:0;top:8px;background:url(~assets/img/literature/Group.png) no-repeat;width:255px;height:38px;font-size: 13px;color: #FFFFFF;line-height:33px;padding-left:14px;}
		div{background-color:#fff;width:1170px;height:50px;padding-top:15px;padding-right: 60px;
			p{font-size: 14px;color: #666666;line-height:20px;text-align:right;
				span{color:#3db1fa;}
				a{text-decoration:none;color:#3db1fa;}
			}
		}
	}
	.web-wrap{
		color: #4e4b49;
		font-size:14px;
		padding: 0 60px;
		.steps{
			padding:70px 0 35px;
			text-align: center;
			ul{
				display: inline-block;
				li{
					float: left;margin-right: 30px;
					i{display: inline-block;width: 40px;height: 40px;border-radius: 20px;background-color: #3db1fa;line-height: 40px;text-align: center;color: #fff;font-style: normal;font-size: 14px;}
					span{font-size: 18px;color: #3db1fa;padding-left: 9px;}
				}
				li:last-child{margin-right: 0;}
			}
		}
		h3{font-size:16px;height: 40px;line-height: 40px;}
		/*.mainOwern-wrap{
			.tips{padding:10px 20px;line-height: 24px;min-height: 44px;background-color: #fff6e2;}
			.mainOwern{
				padding:15px 0;
				li{
					position: relative;cursor: pointer;float: left;width:125px;height: 88px;border: 1px solid #e6e6e6;margin-right: 14px;
					p{padding-left:32px;}
					p.name{
						line-height: 24px;margin-top: 23px;color: #333;font-size:16px;
					}
					p.type{
						line-height: 24px;color: #999;
					}
					i.edit{display: none;position: absolute;top: 6px;right: 12px;font-style: normal;color: #3db1fa;cursor: pointer;}
					.main-add{
						position: relative;height: 22px;top: 30px;color: #3db1fa;text-align: center;vertical-align: middle;
						i{display: inline-block;width: 22px;height: 22px;border-radius: 11px;border:1px solid #3db1fa;line-height: 20px;text-align: center;font-style: normal;vertical-align: middle;}
						span{display: inline-block;height: 22px;line-height: 22px;padding-left: 5px;vertical-align: middle;}
					}
				}
				li:hover{
					border-color: #3db1fa;
					i.edit{display: block;}
				}
			}
		} */
		.webinfo-wrap{
			.webinfo{
				li>p{
					i{display: inline-block;width: 22px;height: 22px;border-radius: 11px;border:1px solid #c1c1c1;line-height: 22px;text-align: center;font-style: normal;}
					span{padding-left: 5px;}
				}
				li>.el-radio-group{
					padding-left:27px;
					line-height: 32px;
					padding-bottom: 10px;
					.el-radio+.el-radio{
						margin-left: 29px;
					}
					.el-radio{color:#4e4b49; }

				}
				li>.site-wrap{
					padding-top: 12px;
					padding-left:27px;
					font-size: 13px;
					.ipt_container{
						button{
							margin-left: 10px;width: 90px;height: 32px;background-color: #3db1fa;color: #FFF;text-align: center;border-radius: 3px;
						}
					}
					table{
						width: 540px;text-align: center;
						thead{
							tr{
								border: 1px solid #F9F9F9;
								th{
									height: 40px;line-height: 40px;background-color: #F9F9F9;font-weight: normal;
									&:first-child{border-right:  1px solid #E9E9E9;}
								}
							}
						}
						tbody{
							tr{
								border: 1px solid #E9E9E9;
								td{
									border-top:  1px solid #E9E9E9;line-height: 18px;padding: 10px;color: #999999;
									a{
										margin: 0 10px;text-decoration: underline;color: #999;
										&:first-child{color: #3db1fa;}
										&:hover{color: #3db1fa;}
									}
									.url{word-break: break-all;}
									&:first-child{border-right:  1px solid #E9E9E9;}
									.empty{
										padding: 30px 0;color: #333;
										span{height: 26px;line-height: 26px;display:inline-block;padding-left: 34px;background: #fff url(~assets/img/web/mark.png) 0 0 no-repeat;background-size: 26px 26px;}
									}
								}
							}
						}
					}
					.tips{padding-top:5px;line-height: 21px;padding-bottom: 10px;color: #999;}
				}
			}
		}
		.amount{
			border-top: 1px solid #e6e6e6;
			padding: 20px 0 25px;
			height: 77px;
			line-height: 32px;
			b{
				color: #fe2200;
				font-weight: normal;
				font-size: 20px;
				i{font-size:18px;font-style:normal;}
			}
		}
		.submit-btn{width:150px;height: 48px;line-height: 48px;font-size:16px;color: #fff;border-radius:4px;background-color: #fe2200;margin-bottom: 48px;}
	}

	.dialog-payTip{
		width:440px;
		.el-dialog__body{padding-top: 20px;}
		.payTipCon{
			.payTipText{line-height: 27px;padding:0 40px 20px;}
			.actionBtn{
				text-align: center;
				a{height: 42px;line-height: 42px;background-color: #3db1fa;color: #fff;display:inline-block;border-radius:3px;width:142px;text-align: center;cursor: pointer;margin:0 15px;}
				a:hover{text-decoration: none;background-color: #369FE0;}
				.otherpay{background-color: transparent;border:1px solid #3db1fa;color: #3db1fa;}
				.otherpay:hover{background-color: #fafafa;}
			}
		}
	}
	.validation{
		.el-dialog{height: 248px;width: 440px;}
		.validation_data{
			>p{background: #FFF7E4;height:38px;line-height:38px;font-size: 13px;color: #D8A045;padding-left: 17px;}
			.validation_end{text-align:center;
				>p{margin:10px auto 0;width:268px;height:40px;border-radius:20px;border:1px solid #09BB07;line-height:40px;padding-left: 20px;color:#09BB07;
					span{width:207px;display:inline-block;}
				}
				.end_btn{width:300px;margin:0px auto 0;font-size:0;
					p{font-size:14px;text-align:center;
						span{color:#3db1fa;}
						a{color:#3db1fa;}
					}
					.btn_end a{width:140px;height:42px;border:1px solid #3db1fa;border-radius:3px;font-size:14px;display:inline-block;line-height:42px;text-decoration:none;cursor:pointer;}
					.end_left{color:#3db1fa;background-color:#fff;}
					.end_right{color:#fff;background-color:#3db1fa;}
				}
			}
		}
	}
	.czb{
		.el-dialog--tiny{width:400px;}
		.czb_info{text-align:center;
			p{font-size:14px;}
			a{width:160px;height:42px;display:inline-block;background-color:#3db1fa;color:#fff;border-radius: 3px;font-size: 14px;text-align:center;line-height:42px;text-decoration:none;cursor:pointer;}
		}
		.el-dialog__title{font-size:14px;}
	}
	.sebe-dialog__wrapper .sebe-dialog .sebe-dialog__header{height: 32px;}
}
</style>
<style>
.el-loading-mask {background-color: rgba(255,255,255,.9);}
.el-message-box{vertical-align: top;top: 20%;position: absolute;left: 50%;-ms-transform: translateX(-50%);transform: translateX(-50%);}
.el-dialog{top:20%!important;}
.el-message{z-index: 3001!important;}
</style>
