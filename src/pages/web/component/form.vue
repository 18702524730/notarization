<template>
  <div class="form-wrap">
		<el-form :model="postData" :rules="rules" ref="ruleForm" :inline="true" auto-complete="off">
      <div class="form-group">
        <label class="form-label"><sup>*</sup>客户种类：</label>
        <div class="client-type">
          <span @click="toggle(2)" :class="{cur: postData.clientType == 2}">企业用户</span>
          <span @click="toggle(1)" :class="{cur: postData.clientType == 1}">个人用户</span>
        </div>
      </div>

      <!-- 企业 -->
      <div class="company" v-if="postData.clientType == 2">
				<el-form-item label="联系人姓名：" prop="name" class="form-group">
					<el-input v-model.number="postData.name" placeholder="请输入联系人姓名" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="联系人电话：" prop="mobile" class="form-group">
					<el-input v-model.number="postData.mobile" placeholder="请输入联系人电话" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="联系人邮箱：" prop="email" class="form-group">
					<el-input v-model="postData.email" placeholder="请输入联系人邮箱" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="收件地址：" class="form-group no-error" required>
					<el-form-item class="form-ipt-sm" prop="addressProvinceId">
						<el-select v-model="postData.addressProvinceId" placeholder="请选择省" @change="changeProvince">
							<el-option
								v-for="item in provinceData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="addressCityId">
						<el-select v-model="postData.addressCityId" placeholder="请选择市" @change="changeCity">
							<el-option
								v-for="item in cityData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="addressAreaId">
						<el-select v-model="postData.addressAreaId" placeholder="请选择区">
							<el-option
								v-for="item in areaData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="address">
						<el-input v-model="postData.address" placeholder="请输入详细地址" auto-complete="off" class="form-ipt"></el-input>
					</el-form-item>
					<div class="tips">提示：为保证精确性，请填写正确的收货地址。</div>
				</el-form-item>
        <div class="form-group">
          <label class="form-label"><sup>*</sup>营业执照：</label>
          <div class="ipt-wrap">
            <div class="upimg positive" :class="{'err-mark':!businessLicenceElectronic.isValid}">
              <file-upload
                :title="businessLicenceElectronic.title"
                :events="upload.events"
                :name="businessLicenceElectronic.name"
                :post-action="upload.postAction"
                :extensions="upload.extensions"
                :accept="upload.accept"
                :multiple="upload.multiple"
                :size="upload.size || 0"
                :drop="upload.drop"
                :files="businessLicenceElectronic.files"
                @picUploadAdd="picUploadAdd"
                @picComplete="picComplete"
                ref="businessLicenceElectronic">
              </file-upload>
              <img src="~assets/img/loading.gif" class="loadingPic" :class="{hidden: businessLicenceElectronic.imgsrc}">
              <img :src="businessLicenceElectronic.imgsrc" class="imgPic" :class="{hidden: !businessLicenceElectronic.imgsrc}">
              <div class="shim" v-show="!businessLicenceElectronic.loading" @click="addPic">
                <span><i class="fa fa-plus" aria-hidden="true"></i></span>
                添加营业执照
              </div>
              <div class="shim remove-tip opacity" v-show="isexist.businessLicenceElectronic" @click="removePic('businessLicenceElectronic')">
                <span><i class="fa fa-minus" aria-hidden="true"></i></span>
                移除营业执照
              </div>
            </div>
            <div class="tips" @click.prevent="up">提示：涉及业务操作，请上传清晰的营业执照。图片小于20M，支持格式（jpg、png、bmp）颜色为rgb格式。</div>
          </div>
        </div>
      </div>

      <!-- 个人 -->
      <div class="personal" v-if="postData.clientType == 1">
				<el-form-item label="姓名：" prop="name" class="form-group">
					<el-input v-model="postData.name" placeholder="请输入姓名" auto-complete="off"  class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="电话：" prop="mobile" class="form-group">
					<el-input v-model.number="postData.mobile" placeholder="请输入电话" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" prop="email" class="form-group">
					<el-input v-model="postData.email" placeholder="请输入邮箱" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
				<el-form-item label="身份证号码：" prop="identificationCard" class="form-group">
					<el-input v-model="postData.identificationCard" placeholder="请输入身份证号码" auto-complete="off" class="form-ipt"></el-input>
				</el-form-item>
        <el-form-item label="收件地址：" class="form-group no-error" required>
					<el-form-item class="form-ipt-sm" prop="addressProvinceId">
						<el-select v-model="postData.addressProvinceId" placeholder="请选择省" @change="changeProvince">
							<el-option
								v-for="item in provinceData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="addressCityId">
						<el-select v-model="postData.addressCityId" placeholder="请选择市" @change="changeCity">
							<el-option
								v-for="item in cityData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-ipt-sm" prop="addressAreaId">
						<el-select v-model="postData.addressAreaId" placeholder="请选择区">
							<el-option
								v-for="item in areaData"
								:label="item.name"
								:value="item.area_id" :key="item.area_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="address">
						<el-input v-model="postData.address" placeholder="请输入详细地址" auto-complete="off" class="form-ipt"></el-input>
					</el-form-item>
					<div class="tips">提示：为保证精确性，请填写正确的收货地址。</div>
				</el-form-item>
        <div class="form-group">
          <label class="form-label"><sup>*</sup>身份证：</label>
          <div class="ipt-wrap">
            <div class="upimg positive" :class="{'err-mark':!identificationCardCorrect.isValid}">
              <file-upload
                :title="identificationCardCorrect.title"
                :events="upload.events"
                :name="identificationCardCorrect.name"
                :post-action="upload.postAction"
                :extensions="upload.extensions"
                :accept="upload.accept"
                :multiple="upload.multiple"
                :size="upload.size || 0"
                :drop="upload.drop"
                :files="identificationCardCorrect.files"
                @picUploadAdd="picUploadAdd"
                @picComplete="picComplete"
                ref="identificationCardCorrect">
              </file-upload>
              <img src="~assets/img/loading.gif" class="loadingPic" :class="{hidden: identificationCardCorrect.imgsrc}">
              <img :src="identificationCardCorrect.imgsrc" class="imgPic" :class="{hidden: !identificationCardCorrect.imgsrc}">
              <div class="shim" v-show="!identificationCardCorrect.loading" @click="addPic">
                <span><i class="fa fa-plus" aria-hidden="true"></i></span>
                添加身份证正面
              </div>
              <div class="shim remove-tip opacity" v-show="isexist.identificationCardCorrect" @click="removePic('identificationCardCorrect')">
                <span><i class="fa fa-minus" aria-hidden="true"></i></span>
                移除身份证正面
              </div>
            </div>
            <div class="upimg other-side" :class="{'err-mark':!identificationCardOppsite.isValid}">
              <file-upload
                :title="identificationCardOppsite.title"
                :events="upload.events"
                :name="identificationCardOppsite.name"
                :post-action="upload.postAction"
                :extensions="upload.extensions"
                :accept="upload.accept"
                :multiple="upload.multiple"
                :size="upload.size || 0"
                :drop="upload.drop"
                :files="identificationCardOppsite.files"
                @picUploadAdd="picUploadAdd"
                @picComplete="picComplete"
                ref="identificationCardOppsite">
              </file-upload>
              <img src="~assets/img/loading.gif" class="loadingPic" :class="{hidden: identificationCardOppsite.imgsrc}">
              <img :src="identificationCardOppsite.imgsrc" class="imgPic" :class="{hidden: !identificationCardOppsite.imgsrc}">
              <div class="shim" v-show="!identificationCardOppsite.loading" @click="addPic">
                <span><i class="fa fa-plus" aria-hidden="true"></i></span>
                添加身份证反面
              </div>
              <div class="shim remove-tip opacity" v-show="isexist.identificationCardOppsite" @click="removePic('identificationCardOppsite')">
                <span><i class="fa fa-minus" aria-hidden="true"></i></span>
                移除身份证反面
              </div>
            </div>
            <div class="tips">提示：<span v-if="!identificationCardOppsite.isValid">请上传身份证扫描件或照片，</span>涉及业务操作，请上传清晰的本人身份证明。图片小于20M，支持格式（jpg、png、bmp）颜色为rgb格式。</div>
          </div>
        </div>
      </div>

      <!-- 存证网址 -->
      <div class="form-group websites">
        <label class="form-label"><sup>*</sup>需存证网址：</label>
        <div class="ipt-wrap">
          <div class="ipt-inner" v-for="(site, index) in websites">
						<el-input v-model="websites[index]" :name="'site'+index" auto-complete="off" class="form-ipt"></el-input>
						<!-- <i class="fa fa-minus-circle yellow" aria-hidden="true" v-if="index !== (websites.length-1)" @click="removeIpt(index)"></i>
						<i class="fa fa-plus-circle yellow" aria-hidden="true" v-else @click="addIpt"></i> -->
          </div>
          <div class="tips">提示：请确保输入的网址正确。</div>
        </div>
      </div>
      <div class="totalbt">
        <div class="totalinfo" v-if="postData.fileData.length && perPriceData.fee"><span>单个网址：<b>{{perPriceData.fee}}元</b>，共{{postData.fileData.length}}个,</span><span>费用总计：<b>&yen;{{postData.fileData.length*perPriceData.fee}}</b></span></div>
        <button type="submit" :class="{disabled: !postData.fileData.length}" @click.prevent="validateBeforeSubmit('ruleForm')">{{submitText}}</button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jQuery'
  import fileUpload from 'vue-upload-component'
  import Lib from 'assets/Lib.js'
  import qs from 'qs'

  const NotarizationType = 1;//存证类型,1：网页存证 ，2：电子存证
  const Codes = 'czwq_yc_wzcz';// 编码
  const PicExtensions = 'png,jpg,jpeg,bmp';
  const AreaUrl = './EvidenceController/areas.do'; //省市区地址
  export default {
    validator: null,
    props:['canSubmit'],
    data () {
      return {
        source: 1,
        submitDisabled: false,
        submitText:'立即支付',
        provinceData:[],
        cityData:[],
        areaData:[],
        isexist:{
          businessLicenceElectronic: false,
          identificationCardCorrect: false,
          identificationCardOppsite: false
        },
				// 表单验证规则
        rules: {
          name: [
            { type: "string", required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          mobile: [
            {type: 'integer', required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          email: [
            {type: "string", required: true, message: '请输入邮箱', trigger: 'blur' },
            {pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          identificationCard: [
            {required: true, message: '请输入身份证号码', trigger: 'blur' },
            {pattern: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/, message: '请输入正确的身份证号码', trigger: 'blur' }
          ],
          addressProvinceId: [
            {type: 'integer', required: true, message: '请选择省份', trigger: 'change' }
          ],
          addressCityId: [
            {type: 'integer', required: true, message: '请选择城市', trigger: 'change' }
          ],
          addressAreaId: [
            {type: 'integer', required: true, message: '请选择区', trigger: 'change' }
          ],
          address: [
            {type: "string", required: true, message: '请输入地址', trigger: 'blur' }
          ]
        },
        perPriceData:{},//单价数据
        // 提交数据
        postData: {
          source: this.source || 1,
          clientType: 2,
          codes:Codes,
          notarizationType: NotarizationType,
          addressProvinceId:'',
          addressCityId:'',
          addressAreaId:'',
          fileData:[]//电子存证文件地址
        },
        websites:[''],//电子存证文件地址预存储 辅助用
        // 图片上传配置
        upload:{
          accept: 'image/*',
          size: 1024 * 1024 * 10,
          multiple: false,
          extensions: PicExtensions,
          upload: {},
          title: 'Add upload files',
          drop: true,
          auto: true,
          name: 'file',
          postAction: CONFIG.czUrl + '/EvidenceController/uploadData.do',
          events: {
            add(file, component) {
              var nameInfo;
              if (this.mode === 'html4') {
                nameInfo = file.name.split('.');
              }else{
                nameInfo = file.file.name.split('.');
              }
              var extension = nameInfo[nameInfo.length - 1];
              if ($.inArray(extension, PicExtensions.split(',')) === -1) {
                this.$alert('上传图片格式不支持，仅支持png,jpg,jpeg,bmp');
                return;
              }
              this.$emit('picUploadAdd', {uploaderName:component.title});
              component.active = true;
            },
            after(file, component) {
              var data = {};
              if (this.mode === 'html4') {
                data = file.data;
              }else{
                data = JSON.parse(file.response);
              }
              this.$emit('picComplete', {data:data,uploaderName:component.title});
            }
          }
        },
        identificationCardCorrect:{
          name: 'fileData',
          loading: false,
          isexist: false,
          files: [],
          imgsrc: '',
          title: 'identificationCardCorrect',
          isValid: true //单独配置，用于验证
        },
        identificationCardOppsite:{
          name: 'fileData',
          loading: false,
          isexist: false,
          files: [],
          imgsrc: '',
          title: 'identificationCardOppsite',
          isValid: true //单独配置，用于验证
        },
        businessLicenceElectronic:{
          name: 'fileData',
          loading: false,
          isexist: false,
          files: [],
          imgsrc: '',
          title: 'businessLicenceElectronic',
          isValid: true //单独配置，用于验证
        }
      }
    },
    components: {
      fileUpload
    },
    mounted () {
      this.getPerPrice();
      this.initProvince();
      //this.upload11 = this.$refs.businessLicenceElectronic.$data;
      this.source = Lib.Util.getQueryString('source');
      var site = Lib.Util.getQueryString('site');
      if (site) {
        this.websites.splice(0, 1, site);
      }
    },
    methods: {

      // 初始化省份
      initProvince(){
        var self = this;
        this.$http.post(AreaUrl, qs.stringify({pId: 0}), {
          headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(resp){
          resp = resp.data;
          if(resp.elements){
            self.provinceData = resp.elements;
          }else {
            console.error(resp.msg);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      },

      // 省份切换渲染城市 城市切换渲染区
      triggerChange (code, dataName){
				if(!code){
					return;
				}
        var self = this;
        this.$http.post(AreaUrl,  qs.stringify({pId: code}), {
          headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(resp){
          resp = resp.data;
          if(resp.elements){
            self[dataName] = resp.elements;
          }else {
            console.error(resp.msg);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      },
			changeProvince(provinceCode){
				this.postData.addressCityId = '';
				this.postData.addressAreaId = '';
				this.areaData = [];
				this.triggerChange(provinceCode, 'cityData');
			},
			changeCity(cityCode){
				this.postData.addressAreaId = '';
				this.triggerChange(cityCode, 'areaData');
			},
      picUploadAdd(data){
        var uploaderName = data.uploaderName;
				this[uploaderName]['imgsrc'] = '';
        this[uploaderName]['loading'] = true;
      },
      picComplete(data){
        var url = data.data.url;
        var uploaderName = data.uploaderName;
        this.isexist[uploaderName] = true;
        this.postData[uploaderName] = url;
        this[uploaderName]['imgsrc'] = url;
				this[uploaderName].isValid = true;
      },
      // 获取单价信息
      getPerPrice(){
        var self = this;
        this.$http.post('./EvidenceController/findNotarizationSet.do')
        .then((resp) => {
            resp = resp.data;
            console.log(resp);
            if(resp.code === '0'){
              var arr = resp.data;
              $.each(arr, function(i, item){
                if (item.item == self.postData.notarizationType) {
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

      // 切换客户种类
      toggle(type){
        this.postData = {
          source: this.source || 1,
          clientType: type,
          codes:Codes,
          notarizationType: NotarizationType, //存证类型,1：网页存证 ，2：电子存证
          addressProvinceId:'',
          addressCityId:'',
          addressAreaId:'',
          fileData: this.postData.fileData
        }
        this.errors.clear();
      },

      // 上传图片
      addPic(e){
        $(e.target).parents('.upimg').find('input[type="file"]').click();
      },

      // 移除图片
      removePic(uploaderName){
        this.postData[uploaderName] = '';
        this.isexist[uploaderName] = false;
        this[uploaderName]['loading'] = false;
      },

      // 提交
      submit(){
        var self = this;
        if (this.submitDisabled) {
          return;
        }
        this.submitText = '请稍候...';
        this.submitDisabled = true;
        //self.$http.post('./EvidenceController/addAttestations.do', this.postData)
        self.$http.post('./cunnar/addCharge.do', this.postData, {withCredentials: true})
        .then((resp) => {
          console.log(resp.data)
          var resp = resp.data;
          if (resp.code === '0') {
            var d = resp.data;
            if (d && d.orderSn) {
              //window.open('./pay.html?order_sn='+ d.orderSn);
              location.href = './pay.html?notarizationType='+NotarizationType+'&order_sn='+ d.orderSn;
            }else{
              self.$alert('订单号不存在');
              this.submitText = '立即支付';
              this.submitDisabled = false;
            }
          }else if(resp.code === '4010008'){
            self.submitText = '立即支付';
            self.submitDisabled = false;
            self.$emit('nologin');
          }else{
            self.$alert('订单生成失败，请重试');
            this.submitText = '立即支付';
            this.submitDisabled = false;
          }

        })
        .catch((error) => {
          console.log(error);
          self.$alert('订单生成失败，请重试');
          this.submitText = '重新提交';
          this.submitDisabled = false;
        });
      },

      // 提交前验证
      validateBeforeSubmit(formName){
        var self = this;
        var postData = this.postData;
        if (!postData.fileData.length) {
					self.$message.error('请输入存证网址');
          return;
        }
				if (!/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(postData.fileData[0])){
					self.$message.error('网址不合法');
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
						// 再验证是否有上传身份证或营业执照
						if (postData.clientType == 1 && (!self.isexist[self.identificationCardCorrect.title] || !self.isexist[self.identificationCardOppsite.title])) {
							self.identificationCardCorrect.isValid = self.isexist[self.identificationCardCorrect.title];
							self.identificationCardOppsite.isValid = self.isexist[self.identificationCardOppsite.title];
							self.$message.error('请上传身份证扫描件或照片');
							return;
						}
						if (postData.clientType == 2 && !self.isexist[self.businessLicenceElectronic.title]) {
							self.businessLicenceElectronic.isValid = self.isexist[self.businessLicenceElectronic.title];
							self.$message.error('请上传营业执照');
							return;
						}
						self.submit();
					} else {
            self.$message('标红的为必填项，请检查并正确填写。');
            return false;
          }
        });
      },

      // 增加存证网址输入框
      addIpt (){
        this.websites.push('');
      },

      // 去除存证地址中为空的数据
      filterFileData(arr){
        var ret = $.merge([], arr);
        for (var i = ret.length - 1; i >= 0; i--) {
          if (!$.trim(ret[i])) {
            ret.splice(i, 1);
          }
        }
        return ret;
      },

      // 移除存证网址
      removeIpt (idx){
        var self = this;
        this.websites.splice(idx, 1);
        /*this.filterFileData();
        setTimeout(function(){
          self.$validator.validateAll().then(() => {
          }).catch(() => {
          });
        }, 200);*/
      }
    },
    watch: {
      // 监听迷你登录是否成功，成功则可提交表单
      canSubmit(){
        if (this.canSubmit = true) {
          this.submit();
        }
      },
      websites(){
        this.postData.fileData = this.filterFileData(this.websites)
      },

      // 监听source
      source(){
        this.postData.source = this.source;
      }
    }
  }
</script>

<style scoped>
.file-uploads{display:none;}
.el-form--inline .el-form-item{margin-right:0}
</style>
