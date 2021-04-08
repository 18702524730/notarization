<template>
  <div id="app" class="app">
    <sebe-header :userName="userName" :cartNum="cartNum"></sebe-header>
    <mini-login @callbackDo="callbackDo" :showMini.sync="showMini" @closeMini="showMini=false"></mini-login>
    <div class="container clearfix web-container">
      <!-- 位置导航 -->
      <div class="position-wrap" >
        <div class="position commWidth" >
          <div class="pos-nav fl">您的位置：<a :href="indexUrl">首页</a>><a :href="indexUrl + '/cms/service/rightoriginal.htm'">存证</a>><span>版权存证</span></div>
        </div>
      </div>
      <div class="content-wrap">
        <div class="top-banner"></div>
      </div>
    </div>
    <!-- 存证包数量 -->
    <div class="top mt15">
      <p v-if="!txtType">每一次创新，都值得守护</p>
      <p v-if="txtType==1">区块链存证+公证存证，双重保障</p>
      <p v-if="txtType==2">区块链存证+司法鉴定存证，双重保障</p>
      <div>
        <p>
          <a class="experience mr20" href="#" @click.prevent="eVisible=true">存证操作引导教程</a>
          剩余存证包数量：
          <span>{{czbNum}}</span>
          <a class="ml20" :href="indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33'" target="_blank">购买存证包&nbsp;</a>
        </p>
      </div>
    </div>

    <!-- 存证流程 -->
    <div class="process_list" v-loading="loadingSf">
      <!-- 申请人 -->
      <div class="steps stepone">
        <div class="title">
          <span class="num">1</span><span class="t">选择申请企业/个人</span>
        </div>
        <div class="applicant">
          <p class="mt20 mb20">请选择已实名认证的申请企业/个人，点击未实名认证的申请人可完成实名认证（注：企业实名认证需要1~2个工作日）</p>
          <!-- 主体信息 -->
          <apply-subject-qy v-if="txtType==1" :notarizationType="2" @selectApplySubjectId="getApplySubjectId" @nologin="showMini=true" :needRender="needRender" :authVisible.sync="authVisible" :authVisibleQy.sync="authVisibleQy"></apply-subject-qy>
          <apply-subject v-if="txtType==2" applytype="5" :notarizationType="2" @selectApplySubjectId="getApplySubjectId" @nologin="showMini=true" :needRender="needRender" :authVisible.sync="authVisible"></apply-subject>
        </div>
      </div>
      <!-- 作品信息 -->
      <div class="steps steptwo">
        <div class="title zp_title" :class="{'disabled': czProcess!=2}">
          <span class="num">2</span><span class="t">填写作品信息</span>
        </div>
        <div class="works_data" v-if="czProcess==2">
          <el-form :model="works" :rules="rules" ref="works" label-width="160px" class="demo-ruleForm">
            <el-form-item label="作品名称" prop="productionName">
              <el-input :maxlength="40" v-model="works.productionName" placeholder="请确保输入的作品名称和文件名称一致，名称将会直接在证书上显示"></el-input>
            </el-form-item>
            <!-- 作品类型 -->
            <el-form-item label="作品类型" class="wid990" prop="typeWork">
              <span v-if="applyType==2">法人作品</span>
              <span v-if="applyType==5">个人作品</span>
            </el-form-item>
            <!-- 权利取得 -->
            <el-form-item label="权利取得">
              <span>原始取得</span>
            </el-form-item>
            <!-- 作品文件 -->
            <el-form-item label="作品文件" prop="standby3">
              <div class="file_up clearfix">
                <uploader class="fl" @complete="setUploadedData" @resetUploader="resetUploader" :valueName="'standby3'" :url="standby3" :fileName="standby3_name" :size="10" :extensions="'png,jpg,jpeg,gif'"></uploader>
                <div class="right_txt fl ml10 mt30">
                  <p>• 请确保您上传的作品文件名称与您输入的作品名称一致。</p>
                  <p>• 上传文件大小不得超过10M</p>
                  <p>• 文件格式必须符合条件，支持上传格式：png／jpg／jpeg／gif格式</p>
                  <p>• 上传的存证版权归用户自己所有，未经用户授权，平台绝对不会私自使用用户上传的作品</p>
                </div>
                <el-input v-model="works.standby3" style="display:none"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 创作信息：公证 -->
        <div class="creation_data" v-if="czProcess==2">
          <el-form :model="creation" :rules="relus02" ref="creation" label-width="160px" class="demo-ruleForm">
            <el-form-item label="创作时间" prop="productionTime">
              <el-date-picker type="date" placeholder="请选择作品完成的时间" v-model="creation.productionTime"></el-date-picker>
            </el-form-item>
            <!--修改次数  -->
            <!-- <el-form-item label="修改次数" prop="updateCishu">
              <el-input :maxlength="4" v-model="creation.updateCishu" placeholder="请输入作品修改次数（数字）"></el-input>
            </el-form-item> -->
            <!--发表状态  -->
            <el-form-item label="发表状态" prop="published">
              <el-select v-model="creation.published" prop="published" placeholder="请选择发表状态">
                <el-option label="创作完成，未上线" value="0"></el-option>
                <!-- <el-option label="网络发表" value="1"></el-option>
                <el-option label="已出版" value="2"></el-option> -->
                <el-option label="已上线" value="3"></el-option>
              </el-select>
            </el-form-item>
            <!-- 网络发表 -->
            <div v-if="creation.published==1">
              <el-form-item label="首次发表网站" prop="web">
                <el-input :maxlength="200" v-model="creation.web" placeholder="请输入作品发表所在网址"></el-input>
              </el-form-item>
              <el-form-item label="发表网站账号" prop="account">
                <el-input :maxlength="60" v-model="creation.account" placeholder="请输入发表网站账号"></el-input>
              </el-form-item>
            </div>
            <!-- 已出版 -->
            <div v-if="creation.published==2">
              <el-form-item label="出版社名称" prop="Press">
                <el-input :maxlength="40" v-model="creation.Press" placeholder="请输入出版社名称"></el-input>
              </el-form-item>
              <!-- 期刊号 -->
              <el-form-item label="期刊号/书号ISBN" prop="isbn">
                <el-input :maxlength="20" v-model="creation.isbn" placeholder="请输入期刊号/书号ISBN"></el-input>
              </el-form-item>
            </div>
            <!-- 其他 -->
            <div v-if="creation.published==3">
              <el-form-item label="首次发表地址" prop="creationAddress">
                <el-input :maxlength="500" v-model="creation.creationAddress" placeholder="请输入首次发表地址"></el-input>
              </el-form-item>
            </div>
            <!-- 首次发表时间 -->
            <el-form-item label="首次发表时间" prop="creationTime" v-if="creation.published&&creation.published!=0">
              <el-date-picker type="date" placeholder="请选择首次发表时间" v-model="creation.creationTime"></el-date-picker>
            </el-form-item>
          </el-form>
          <!-- 声明 -->
          <div class="statement">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>声明：本人上传的资料为真实信息，作品著作权为本人所有，作品不存在权利纠纷，并承担由此产生的一切法律责任<a @click.prevent="veiwAgree">《权利具结声明》</a>且同意<a href="/notarization/pages/czAgreement.html" target="_blank">《拾贝网用户存证服务协议》</a></span>
          </div>
          <div class="statement_btn" >
            <button class="fr next mr30" @click="czbNumber(2)">立即下单</button>
            <p class="fr">扣除存证包<span style="padding-left:12px;">1个</span><br><i>（保存时间3年）</i></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 权利具结声明 -->
    <el-dialog title="著作权权利具结声明书" :visible.sync="agreeVisible" custom-class="dialog-payTip dialog-agree" :close-on-click-modal="false">
      <div class="pop_window">
        <div class="payTipCon">
          <h3>致福建省厦门市鹭江公证处：</h3>
          <p class="c_txt">本人提交公证处保管的作品属于个人作品，本人对该作品拥有完整著作权，作品不存在侵害他人合法权利的情形，并且以下作品主要事项由本人填写并保证该事项的真实性。</p>
          <p class="c_txt">作品名称：{{works.productionName}}</p>
          <p class="c_txt">作品种类：{{works.notarizationPurpose | Purpose}}</p>
          <p class="c_txt" v-if="works.productionSign">作者：{{works.productionSign +(works.productionSign02 ? '，'+works.productionSign02:'')}}</p>
          <p class="c_txt">创作完成时间：{{creation.productionTime|dateFilter}}</p>
          <p class="c_txt">发表状态：{{creation.published|publishe}}</p>
          <p class="c_txt" v-if="creation.published == 3 && creation.creationTime">首次发表日期：{{creation.creationTime|dateFilter}}</p>
          <p class="c_txt">保管文件名称：{{decodeURIComponent(standby3_name)}}</p>
          <p class="c_txt">本人保证：提交保管时填写的内容及上述声明内容均真实，若有虚假，由此所产生的一切法律责任均由声明人本人承担，与平台及贵公证处无关。</p>
          <p class="c_txt">特此声明！</p>
          <div class="sign" v-if="applyType==2">
            声明主体：{{apply_name}}<br>统一社会信用代码：{{apply_number}}<br>{{fwqTime | dateFilter}}
          </div>
          <div class="sign" v-if="applyType==5">
            声明人：{{apply_name}}<br>证件号码：{{apply_number}}<br>{{fwqTime | dateFilter}}
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 司法存证成功 -->
    <el-dialog :title="czChannel == 3 ? '本人操作验证' : '提示'" :visible.sync="sfvisible" size="tiny" class="validation" :lock-scroll="false" :before-close="close" :close-on-click-modal="false">
      <div class="validation_data">
        <!-- 成功 -->
        <div class="validation_end">
          <p><span>存证成功</span><i class="el-icon-check"></i></p>
          <div class="end_btn">
            <p class="mt10">剩余存证包数量：{{czbNum-1}}<a class="ml5" :href="indexUrl + '/products/87.htm'" target="_blank">购买存证包</a></p>
            <div class="btn_end mt20">
              <a class="end_left mr20" :href="userUrl+'/iprp/#/orders'">查看我的存证</a>
              <a class="end_right" @click.prevent="resetAll">继续存证</a>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 存证包不够 -->
    <el-dialog class="czb" title="操作提醒" :visible.sync="czbHref" size="tiny" :lock-scroll="false" :before-close="czbClick" :close-on-click-modal="false">
      <div class="czb_info">
        <p>抱歉，由于您的存证包数量不足，请前往购买存证包</p>
        <!-- <a class="mt20" :href="indexUrl+'/products/87.htm'" target="_blank" @click="payCzb">我要购买存证包</a> -->
        <a class="mt20" @click="payCzb">我要购买存证包</a>
      </div>
    </el-dialog>
    <sebe-footer class="mt-15"></sebe-footer>
    <!-- 本人操作验证 -->
    <self-validation :czbNum="czbNum" :bankPhone="bankPhone" @initialize="initialize" :allData="allData" :selfValidateVisible="selfValidateVisible" @selfClick="selfClick" @selfVisible="selfVisible"></self-validation>
    <!-- 原创版权存证体验区 -->
    <Experience :eVisible.sync="eVisible"></Experience>
	</div>
</template>
<script>
	import Vue from 'vue'
	import $ from 'jquery'
	import qs from 'qs'
	import sebeHeader from 'components/Header.vue'
	import sebeFooter from 'components/Footer.vue'
	import uploader from 'components/uploader/uploader.vue'
	import miniLogin from 'components/miniLogin.vue'
	import applySubject from 'components/applySubject/ApplySubject.vue'
	import applySubjectQy from 'components/applySubject/ApplySubjectQy.vue'
	import selfValidation from './component/selfValidation.vue'
	import Experience from './component/experience.vue'
	import FauxPlaceholder from 'assets/js/ie9Compatible.js'
	import { EventBus } from 'assets/event-bus.js';
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const czUrl = CONFIG.czUrl;
	const userUrl = CONFIG.userUrl;
	const queryCzUrl = './cunnar/querycznum.do';
// 检查标签是否支持该属性
	function ElementSupportAttribute(elm, attr) {
		var test = document.createElement(elm);
		return attr in test;
	}
	export default {
		data () {
			//首次发表地址
			let checkCreationAddress = (rule, value, callback) =>{
				if (!value) {
					return callback(new Error('请输入首次发表地址'));
				}
				setTimeout(() => {
					if (value.replace(/[\u4e00-\u9fa5]/g,'***').length > 500) {
						callback(new Error('地址长度不能超过500个字符'));
					} else {
						callback();
					}
				}, 50);
			};
			return {
				czChannel: 3,
				eVisible: false,
				applyType: 5, //默认是个人
				clickDouble:true,//防止重复提交
				czbHref:false,
				fwqTime:'',//服务器时间
				txtType: 1,
				userUrl:userUrl,
				sfvisible:false,
				loadingSf:false,
				unitProduct:false,//作品署名
				bankPhone:'',//主体电话
				unit:false,//职务作品
				cooperation:false,//合作作品
				entrust:false,//委托作品
				depositary:false,//受托人
				czUrl:czUrl,
				authVisible:false,
				authVisibleQy:false,
				agreeVisible:false,
				needRender: false, //判断是否要重新渲染申请主体列表
				selfValidateVisible:false,//本人操作
				real:false,//实名认证弹框
				czType:false,// 存证类型,true:工证，false：司法
				czProcess:1,//存证进度
				// 创作协议
				standby1:'',
				standby1_name:'',
				// 归属协议
				standby2:'',
				standby2_name:'',
				// 作品
				standby3:'',
				standby3_name:'',
				czbNum:0, //存证包数量
				indexUrl: indexUrl,
				showMini: false,
				userName: '',
				cartNum:'',
				works:{
					notarizationPurpose:'8',
					typeWork:'',
					// 创作协议
					standby1:'',
					standby1_name:'',
					// 归属协议
					standby2:'',
					standby2_name:'',
					// 作品
					standby3:'',
					standby3_name:'',
					unitName:'',
					cooperationPhone:'',
					entrustName:'',
					entrustPhone:'',
					depositaryInfo:'',
					depositaryInfoPhone:''
				},// 作品信息
				creation:{
					productionTime:'',
					published:'',
					creationTime:''
				},// 创作信息
				checked:false,//声明

				apply_name:'',
				apply_number:'',
				orderApplySubjectId:'',
				rules:{
					productionName:[
						{ required: true, message: '请输入作品名称，并确保输入的作品名称和文件名称一致，名称将会直接在证书上显示', trigger: 'blur' },
						{ min: 1, max: 40, message: '作品名称长度 1到 40个字符', trigger: 'blur' }
					],
					notarizationPurpose: [
						{ required: true, message: '请选择作品种类', trigger: 'change' }
					],
					productionSign: [
						{ required: true, message: '请输入作品署名', trigger: 'blur' },
						{ min: 2, max: 40, message: '作品署名长度 2到 40个字符', trigger: 'blur' }
					],
					unitName:[
						{ required: true, message: '请输入单位名称', trigger: 'blur' },
						{ min:2,max:40, message: '单位名称长度 2到 40个字符', trigger: 'blur' }
					],
					unitPhone:[
						{ required: true, message: '请输入单位电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '单位电话有误', trigger: 'blur' }
					],
					entrustPhone:[
						{ required: true, message: '请输入委托人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '委托人电话有误', trigger: 'blur' }
					],
					entrustName:[
						{ required: true, message: '请输入委托人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '委托人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					depositaryInfo:[
						{ required: true, message: '请输入受托人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '受托人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					depositaryInfoPhone:[
						{ required: true, message: '请输入受托人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '受托人电话有误', trigger: 'blur' }
					],
					cooperationName:[
						{ required: true, message: '请输入合作人姓名', trigger: 'blur' },
						{ min:2,max:40, message: '合作人姓名长度 2到 40个字符', trigger: 'blur' }
					],
					cooperationPhone:[
						{ required: true, message: '请输入合作人电话', trigger: 'blur' },
						{ required: true, pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})/, message: '合作人电话有误', trigger: 'blur' }
					],
					standby3:[
						{ required: true, message: '请上传存证作品文件', trigger: 'change' }
					],
					standby2:[
						{ required: true, message: '请上传著作权归属协议', trigger: 'change' }
					],
					standby1:[
						{ required: true, message: '请上传创作协议', trigger: 'change' }
					]
				},
				relus02:{
					published:[
						{  required: true, required: true, message: '请选择发表状态', trigger: 'change' }
					],
					productionTime: [
						{ type: 'date', required: true, message: '请选择作品完成的时间', trigger: 'change' }
					],
					updateCishu: [
						{ required: true, pattern: /^[1-9][0-9]{0,}$/, message: '请输入作品修改次数(数字)', trigger: 'blur' }
					],
					web:[
						{ required: true, message: '请输入作品发表所在的网站', trigger: 'blur' },
						{ max:200, message: '网站长度在200个字符以内', trigger: 'blur' }
					],
					account:[
						{ required: true, message: '请输入首次发表网站账号', trigger: 'blur' },
						{ min:2,max:60, message: '网站账号长度 2到 60个字符', trigger: 'blur' }
					],
					Press:[
						{ required: true, message: '请输入出版社名称', trigger: 'blur' },
						{ min:2,max:40, message: '出版社名称长度 2到 40个字符', trigger: 'blur' }
					],
					isbn:[
						{ required: true, message: '请输入期刊号/书号ISBN', trigger: 'blur' },
						{ min:1,max:20, message: '期刊号/书号ISBN长度 1到 20个字符', trigger: 'blur' }
					],
					creationAddress:[
						{ required: true, validator:checkCreationAddress, trigger: 'blur' }
					],
					creationTime:[
						{ type: 'date', required: true, message: '请选择首次发表时间', trigger: 'change' }
					]
				},
				worksInfo:{},//作品信息
				allData:{},
				fileSize:''
			}
		},
		components: {
			sebeHeader,
			uploader,
			miniLogin,
			sebeFooter,
			selfValidation,
			applySubject,
			applySubjectQy,
			Experience
		},
		mounted () {
			var self = this;
			EventBus.$on('needLogin', () => {
				this.needLogin();
			});
			if(this.$route.query.state){
				this.czType=this.$route.query.state;
			}
			//self.pageClick();
			var userName = this.$cookie.get('truename');
			var phone = this.$cookie.get('phone');
			if (phone) {
				phone = phone.slice(0, 3) + '****' + phone.slice(-4);
			}
			this.userName = userName ? userName : phone;
			this.cartNum = this.$cookie.get('cart_num') || '0';
			this.getCzNum();
			setTimeout(function(){
				FauxPlaceholder();
			},300);
			this.getTime();

			// 延迟3秒全局拦截未登录
			setTimeout(() => {
				console.log(this.axios.interceptors.response)
				this.initResponse();
			}, 3000)
		},
		watch:{
		},
		methods: {
			initResponse(){
				this.axios.interceptors.response.use(function (response) {
					// Do something with response data
					var data = response && response.data;
					if(data && data.code == '4010008') {
						EventBus.$emit('needLogin');
					};
					return response;
				}, function (error) {
					var data = error && error.response && error.response.data;
					if(data && (data.status == 401 || data.code == '4010008')) {
						EventBus.$emit('needLogin');
					};
					// Do something with response error
					return Promise.reject(error);
				});
			},
			resetUploader(valueName){
				this[valueName] = '';
				this[valueName+'_name'] = '';
			},
			payCzb(){
				this.czbHref=false;
				this.clickDouble=true;
				window.open(indexUrl+'/store/1180036088.htm?pageIndex=1&classId=33');
			},
			// changeInfo(){//针对下拉框选中后增加的输入框做ie9兼容
			//   if(!ElementSupportAttribute('input','placeholder')){
			//     setTimeout(function(){
			//       FauxPlaceholder();
			//     },300);
			//   }
			// },
			getTime(){
				var self = this;
				var xhr = new XMLHttpRequest();
				if( !xhr ){
					 xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xhr.open("HEAD",this.czUrl+'/cunnar/querycznum.do?t='+Math.random(),true);
				xhr.onreadystatechange=function(){
					if( xhr.readyState == 4 && xhr.status == 200 ){
						self.fwqTime=xhr.getResponseHeader("Date");
					}
				}
				xhr.send(null);
			},
			close(){
				this.getCzNum();
				this.sfvisible=false;
			},
			initialize(){//认证成功，信息初始化
				this.clickDouble=true;
				this.selfValidateVisible=false;
				this.czProcess=1;//首先返回主体页面
				// 信息初始化
				this.works.productionSign='';
				this.works.productionSign02='';
				this.works.unitName='';
				this.works.unitPhone='';
				this.works.unitName02='';
				this.works.unitPhone02='';

				this.works.cooperationName='';
				this.works.cooperationPhone='';
				this.works.cooperationName02='';
				this.works.cooperationPhone02='';

				this.works.entrustName='';
				this.works.entrustPhone='';
				this.works.entrustName02='';
				this.works.entrustPhone02='';

				this.works.depositaryInfo='';
				this.works.depositaryPhone='';
				this.works.depositaryInfo02='';
				this.works.depositaryPhone02='';
				// form表单重置
				this.$refs['works'].resetFields();
				this.$refs['creation'].resetFields();
				// 文件重置
				this.standby1 = '';
				this.standby2 = '';
				this.standby3 = '';
				this.goHome();
				this.getCzNum();
			},
			shopClick(){
				self.$http.post('./EvidenceController/addAttestations.do',self.allData)
				.then((resp) => {
					console.log(resp);
				})
				.catch((error) => {
				});
			},
			setUploadedData(data){
				if(data.data.code=='3010019'){
					this.$message.error('文件名称长度不能超过30个字符');
					this.resetUploader();
					return;
				}
				if (data.data.code=='4010008') {
					EventBus.$emit('needLogin');
					this.resetUploader();
					return;
				}
				this[data.valueName]= data.data.url
				this[data.valueName+'_name']= data.data.fileName;
				if(this.standby3){
					this.fileSize=data.data.fileSize;
				}
			},
			veiwAgree(){//权利具结声明
				var self = this;
				this.$refs['creation'].validate((valid) => {
					if (valid) {
						self.agreeVisible=true;
					}
				})
			},
			goShop(){//立即下单
				var self = this;
				this.$refs['works'].validate((valid) => {
					if (valid) {
						this.$refs['creation'].validate((valid) => {
							if (valid) {
								if(!this.checked){
									self.clickDouble=true;
									this.$message.warning('请仔细阅读声明，并确认');
									return;
								}
								if(self.works.unitName&&self.works.typeWork==1){
									var unitData=[];//单位
									unitData[0]={
										name:self.works.unitName,
										contact:self.works.unitPhone
									}
									if(self.works.unitName02){
										unitData[1]={
											name:self.works.unitName02,
											contact:self.works.unitPhone02
										}
									}
								}
								if(self.works.cooperationName&&self.works.typeWork==2){
									var cooperationData=[];//合作
									cooperationData[0]={
										name:self.works.cooperationName,
										contact:self.works.cooperationPhone
									}
									if(self.works.cooperationName02){
										cooperationData[1]={
											name:self.works.cooperationName02,
											contact:self.works.cooperationPhone02
										}
									}
								}
								if(self.works.entrustName&&self.works.typeWork==3){
									var entrustData=[];//委托
									entrustData[0]={
										name:self.works.entrustName,
										contact:self.works.entrustPhone
									}
									if(self.works.entrustName02){
										entrustData[1]={
											name:self.works.entrustName02,
											contact:self.works.entrustPhone02
										}
									}
								}
								if(self.works.depositaryInfo&&self.works.typeWork==3){
									var depositaryData=[];//受托
									depositaryData[0]={
										name:self.works.depositaryInfo,
										contact:self.works.depositaryInfoPhone
									}
									if(self.works.edepositaryInfo02){
										depositaryData[1]={
											name:self.works.edepositaryInfo02,
											contact:self.works.edepositaryInfoPhone02
										}
									}
								}
								if(self.works.standby1){
									var createAgreement = [
										{
											fileName:self.works.standby1_name,//创作协议
											file:self.works.standby1
										}
									]
								}
								if(self.works.standby1){
									var createAgreement = [
										{
											fileName:self.works.standby1_name,//创作协议
											file:self.works.standby1
										}
									]
								}
								if(self.works.standby2){
									var ownershipAgreement = [
										{
											fileName:self.works.standby2_name,//创作协议
											file:self.works.standby2
										}
									]
								}
								var data = {
									orderApplySubjectId:self.orderApplySubjectId,
									payType:2,
									czChannel:"4",
									notarizationPurpose:self.works.notarizationPurpose,
									source:'3',//需要从路由获取
									notarizationType:2,
									notarizationRefList:[{
										url:self.works.standby3,//文件路径
										fileName:self.works.standby3_name,//文件名称
										createAgreementList:createAgreement?createAgreement:null,//文件名称
										ownershipAgreementList:ownershipAgreement?ownershipAgreement:null,//归属协议,
										productionName:self.works.productionName,//作品名称
										notarizationPurpose:'8',//作品类型

										productionLeixin: self.applyType == 2 ? 4 : 0,//作品类型

										productionSign:this.works.productionSign02?this.works.productionSign+','+this.works.productionSign02:this.works.productionSign,//作品署名
										obtain:1,
										depositaryInfoList:depositaryData?depositaryData:null,
										unitInfoList:unitData?unitData:null,//单位信息
										copartnerInfoList:cooperationData?cooperationData:null,//合作
										depositaryInfoList:entrustData?entrustData:null,//委托
										publishTime:new Date(self.creation.creationTime).getTime(),//发表时间
										productionTime:new Date(self.creation.productionTime).getTime(),//创作时间
										updateCishu:self.creation.updateCishu,//修改次数
										publishState:self.creation.published,//发表状态
										publicWebSite:self.creation.web,//发表网站
										publicAccount:self.creation.account,//网站账号
										pressName:self.creation.Press,//出版社名称
										pressNo:self.creation.isbn,//期刊号
										publicSite:self.creation.creationAddress,//发表地址
										fileSize:self.fileSize
									}]
								}
								self.worksInfo = data;
								self.allData = self.worksInfo;
								this.bankPhone = this.$cookie.get('phone');
								self.selfValidateVisible=true;
							} else {
								self.clickDouble=true;
								this.$message.warning('请先填写作品信息');
								return false;
							}
						});
					}
				});
			},
			goHome(){//返回选择存证类型
				// 填写内容初始化
				this.txtType = 1;
				this.works.notarizationPurpose='';
				this.creation.productionTime='';
				this.works.typeWork='';
				//this.$router.push({path: '/', query:{'page':1,'state':this.czType}});
			},
			/*pageClick(){//当前页面
				if(this.$route.query.page&&this.$route.query.page != 1){
					this.pageIndex = false;
					if(this.$route.query.state){
						this.txtType=1;
					}else{
						this.txtType=2;
					}
				}else{
					this.pageIndex = true;
					this.txtType='';
				}
				this.czProcess=1;
				this.czType = this.$route.query.state;
			},*/
			needLogin() {
				this.$message.warning('未登录或登录已失效，请登录');
				this.showMini = true;
			},
			getApplySubjectId(data){
				this.apply_name = data.apply_name,
				this.apply_number = data.apply_number
				this.orderApplySubjectId = data.orderApplySubjectId;
				this.applyType = data.apply_type;
				this.czProcess = 2;
				if(!ElementSupportAttribute('input','placeholder')){
					FauxPlaceholder();
				}
			},
			selfClick(){//存证成功后页面初始化
				this.selfValidateVisible=false;
				this.clickDouble=true;
				this.getCzNum();
			},
			czbClick(){//存证包数量不足初始化
				this.clickDouble=true;
				this.czbHref=false;
			},
			selfVisible(){
				this.clickDouble=true;
				this.getCzNum();
				this.selfValidateVisible=false;
			},
			czbNumber(num){
				var self = this;
				if(self.clickDouble){
					self.clickDouble=false;
				}else{
					return;
				}
				this.$http.get(queryCzUrl + '?t=' + Math.random())
				.then((resp) => {
					self.clickDouble=true;
					resp = resp.data;
					if(resp.code === '0'){
						self.czbNum = resp.data;
						if(resp.data){
							if(num==1){
								self.nextClick();
							}else{
								self.goShop();
							}
						}else{
							self.czbHref=true;
						}
					}
				}).catch((error) => {
					self.clickDouble=true;
				});
			},
			nextClick(){
				// 公正存证
				var self = this;
				if(this.czType){//区块链
					self.$refs['works'].validate((valid) => {
						if (valid) {
							self.czProcess = 3;
						} else {//司法
							self.clickDouble=true;
							this.$message.warning('请先填写作品信息');
							return false;
						}
					})
				}else{//司法
					self.$refs['works'].validate((valid) => {
						if (valid) {
							self.loadingSf=true;
							self.allData={
								orderApplySubjectId:self.orderApplySubjectId,
								payType:2,
								czChannel:"5",
								notarizationPurpose:self.works.notarizationPurpose,
								source:1,//需要从路由获取
								notarizationType:2,
								notarizationRefList:[{
									url:self.works.standby3,//文件路径
									fileName:self.works.standby3_name,//文件名称
									obtain:1,
									fileSize:self.fileSize
								}]
							}
							self.$http.post('./EvidenceController/addAttestations.do', self.allData)
							.then((resp) => {
								self.loadingSf=false;
								if(resp.data.code === '0'){
									self.sfvisible=true;
								}else if(resp.data.code === '4010023'){
									self.selfClick();
									self.czProcess=1;//首先返回主体页面
									self.$message.error('剩余存证次数不足');
								}else if(resp.data.code === '4010020'){
									self.selfClick();
									self.czProcess=1;
									self.$message.error(resp.data.desc);
								}else{
									self.selfClick();
									self.czProcess=1;
									self.$alert('订单生成失败，请重试');
								}
								})
								.catch((error) => {
									self.$alert('订单生成失败，请重试');
									self.loadingSf=false;
									this.selfClick();
									self.czProcess=1;
								})
						} else {//司法
							self.clickDouble=true;
							self.loadingSf=false;
							this.$message.warning('请先填写作品信息');
							return false;
						}
					})
				}
			},
			resetAll(){
				this.clickDouble=true;
				this.sfvisible=false;
				this.works = {
					notarizationPurpose:'8',
					typeWork:'',
					// 创作协议
					standby1:'',
					standby1_name:'',
					// 归属协议
					standby2:'',
					standby2_name:'',
					// 作品
					standby3:'',
					standby3_name:'',
					unitName:'',
					cooperationPhone:'',
					entrustName:'',
					entrustPhone:'',
					depositaryInfo:'',
					depositaryInfoPhone:''
				};// 作品信息
				this.creation = {
					productionTime:'',
					published:'',
					creationTime:''
				};// 创作信息
				this.getCzNum();
				this.czProcess=2;
			},
			czstate(type){
				if(type==1){
					this.$router.push({path: '/', query:{'page':2,'state':true}});
				}else if(type==2){
					this.$router.push({path: '/', query:{'page':2,'state':''}});
				}
			},
			// 获取存证包数量
			getCzNum(){
				var self = this;
				this.$http.get(queryCzUrl + '?t=' + Math.random())
				.then((resp) => {
					resp = resp.data;
					console.log(resp)
					if(resp.code === '0'){
						self.czbNum = resp.data;
					}
				}).catch((error) => {
				});
			},
			// 登陆后跳转判断
			callbackDo (){
				this.showMini = false;
				var userName = this.$cookie.get('truename');
				var phone = this.$cookie.get('phone');
				this.needRender=true;
				this.bankPhone = phone;
				if (phone) {
					phone = phone.slice(0, 3) + '****' + phone.slice(-4);
				}
				this.userName = userName ? userName : phone;
				this.cartNum = this.$cookie.get('cart_num') || '0';
				this.getCzNum();
			}
		},
		filters: {
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
			Purpose(input){
				var ret = ''
				switch (input+''){
					case '4':
						ret = "文字作品";
						break;
					case '6':
						ret = "音乐作品";
						break;
					case '5':
						ret = "美术作品";
						break;
					case '8':
						ret = "其他";
						break;
				}
				return ret;
			},
			publishe(input){
				var ret = ''
				switch (input+''){
					case '0':
						ret = "创作完成，未上线";
						break;
					case '3':
						ret = "已上线";
						break;
				}
				return ret;
			}
		},
		watch: {
			//'$route':'pageClick',
			standby1(){
				var self = this;
				self.works.standby1 = self.standby1;
				self.works.standby1_name = self.standby1_name;
			},
			standby2(){
				var self = this;
				self.works.standby2 = self.standby2;
				self.works.standby2_name = self.standby2_name;
			},
			standby3(){
				var self = this;
				self.works.standby3 = self.standby3;
				self.works.standby3_name = self.standby3_name;
			}
		}
	}
</script>


<style lang="scss">
.app{background-color:#f2f2f2;
	.Introduction{margin-left: 130px;font-size:14px;color:#999;line-height:100%;margin-top: -15px;}
	.mt70{margin-top: 70px;}
	button.next{width:140px;height:42px;background-color:#3db1fa;color:#FFF;font-size:14px;text-align:center;border-radius:3px;}
.web-container{width:100%;overflow: hidden;background-color: #f2f2f2;
	.top-banner{
		height: 180px;background: #FFF url(~assets/img/literature/literature_bg.jpg) center 0 no-repeat
	}
}

.top{width:1170px;margin:20px auto 0;position: relative;
	>p{position: absolute;left:0;top:8px;background:url(~assets/img/literature/Group.png) no-repeat;width:255px;height:38px;font-size: 13px;color: #FFFFFF;line-height:33px;padding-left:14px;}
	div{background-color:#fff;width:1164px;height:50px;padding-top:15px;padding-right: 60px;margin-left: 6px;
		p{font-size: 14px;color: #666666;line-height:20px;text-align:right;
			span{color:#3db1fa;}
			a{text-decoration:none;color:#3db1fa;}
			.experience{padding-left:30px;background:url(~assets/img/literature/blackboard.png) no-repeat;}
		}
	}
}

.homepage{width:1170px;margin:0 auto;
	.category_list{background-color:#fff;padding:40px 60px 50px;
		.prompt{background: #FFF7E4;width:1050px;height:40px;font-size: 13px;color: #D8A045;text-align:center;line-height:40px; }
		.category:hover{border-color:#3db1fa}
		.category{width:515px;height:368px;border:1px solid #eee;text-align:center;padding-top:30px;cursor:pointer;
			.tit{font-size:20px;color:#000;font-weight: bolder;line-height:26px;}
			.name{font-size: 14px;color: #666666;line-height:20px;}
			.txt{width:350px;text-align:left;margin:10px auto 0;font-size: 13px;color:#999;height:90px;line-height:18px;}
		}
	}
}

.process_list{width:1170px;margin:20px auto 0;background-color:#fff;position: relative;
	>i{position: absolute;height:2px;border-bottom:2px solid #3db1fa}
	.bdc01{width:330px;transition:all 0.5s ease;}
	.bdc02{width:660px;transition:all 0.5s ease;}
	.bdc03{width:990px;transition:all 0.5s ease;}
	.bdc1{width:495px;transition:all 0.5s ease;}
	.bdc2{width:990px;transition:all 0.5s ease;}
	.steps{
		.title{
			margin-left: 30px;
			.num{width: 28px;height: 28px;line-height: 28px;text-align: center;background: #3DB1FA;font-size: 14px;color: #FFFFFF;display: inline-block;border-radius: 50%;}
			.t{font-size: 14px;color: #3DB1FA;height: 28px;line-height: 28px;display: inline-block;padding-left: 8px;}
		}
		.disabled{
			padding-bottom: 30px;
			.num{background: #ddd;}
			.t{color: #999;}
		}
		.zp_title{margin-top: 30px;}
	}
	.stepone{
		padding:30px 0 30px;border-bottom: 1px solid #eee;
		.applicant{width:1005px;margin: 0 auto;
			>p{width:990px;height:40px;line-height:40px;background-color:#fff7e4;font-size: 13px;color: #D8A045;text-align:center;}
		}
	}
}
.el-input__inner{line-height:34px;height: 34px;padding-top: 0\0;}
.works_data,.creation_data{margin-top: 20px;
	.el-date-editor.el-input{width:360px;}
	.el-form-item__label{color:#666;}
	.el-form-item__content{line-height:40px;
		.el-textarea{width:360px;}
		.addInput .el-input__inner{border-top-right-radius: 0;border-bottom-right-radius: 0;line-height: 34px;}
		.productInput .el-input__inner{border-top-right-radius: 0;border-bottom-right-radius: 0;height:35px;line-height: 34px;}
		.el-input-group__append{cursor:pointer;}
		.el-input{width:455px;
			.input{line-height: 34px;height:34px;width:455px;border-radius:3px;}
		}
	}
	.el-select .el-input__inner{line-height:34px;}
	.works_btn{font-size:0;padding-left: 130px;
		p{font-size: 14px;color: #666666;line-height:100%;margin-left: -90px;border-top:1px solid #eee;padding-top:20px;
			.txt{width:90px;display:inline-block;text-align:right;padding-right: 12px;}
			.num{font-size: 18px;color: #F64744;}
		}
		.last{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;}
	}
	.statement{padding-left: 160px;border-bottom:1px solid #eee;padding-bottom:40px;
		>span{font-size: 12px;color: #666666;width:616px;display:inline-block;vertical-align: top;line-height:14px;padding-top: 4px;padding-left: 5px;}
		a{text-decoration:none;color: #666666;cursor: pointer;}
		a:hover{color:#3db1fa;}
	}
	.statement_btn{
		height: 106px;padding:30px 0;
		p{font-size: 14px;color: #666666;line-height:1.3;margin-right:20px;
			span{font-size: 18px;color: #F64744;}
			i{font-size: 12px;color: #999;font-style: normal;}
		}
		.last{background-color:#fff;color:#3db1fa;border:1px solid #3db1fa;margin-right:30px; }
	}
	.file_up{
		p{width:110px;font-size: 14px;color: #666666;padding-right: 12px;}
		.right_txt{padding-top:4px;vertical-align: bottom;
			p{width:730px;text-align:left;font-size: 12px;color: #999999;line-height: 22px;}
		}
	}
}
.judicial_list{width:1170px;margin:20px auto 0;background-color:#fff;padding:60px 90px 105px;}
.wid990{width:990px;}
}
</style>
<style lang="scss">
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
.dialog-agree{
	width:700px;
	.el-dialog__header{text-align: center;}
	.el-dialog__body{border-top: 1px solid #eee;padding-top: 0;margin-top:20px;}
	.payTipCon{
		line-height: 21px;padding:20px;
		h3{font-weight:normal;font-size:14px;}
		p.c_txt{text-indent: 28px;padding:7px 0;}
		.sign{text-align: right;}
	}
}
.el-input{position: relative;
	.placeholder{position: absolute;top:0px;left:10px;color:#999;line-height:36px;}
}
.el-input-group__append{position: relative;
	span{display:block;width:35px;height:35px;position:absolute;top:0;left:0;}
}

@media screen\0 {
	.el-select-dropdown{min-width:455px !important;}/* ie 9*/
}

.czb{
	.el-dialog--tiny{width:400px;}
	.czb_info{text-align:center;
		p{font-size:14px;}
		a{width:160px;height:42px;display:inline-block;background-color:#3db1fa;color:#fff;border-radius: 3px;font-size: 14px;text-align:center;line-height:42px;text-decoration:none;cursor:pointer;}
	}
	.el-dialog__title{font-size:14px;}
}
.shumin{
	.el-form-item__content{
		height: auto;display:block;
		.el-input-group{vertical-align: top;}
	}
}
//.ie9 .el-dialog{-ms-transform: translateX(0%) !important;transform: translateX(0%);margin-left: -280px;}
.el-message{z-index: 3001!important;}
</style>

