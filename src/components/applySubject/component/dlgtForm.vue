<template>
  <div class="dlgtForm">
    <el-form ref="ruleForm" :rules="rules" :model="conForm" label-width="172px">
      <!--大陆个体-->
      <div>
        <el-form-item label="申请人姓名" prop="apply_name">
          <el-input v-model ="conForm.apply_name" :maxlength="20" placeholder="请填写申请人姓名" :disabled="isEdit && conForm.is_checked == 1"></el-input>
        </el-form-item>
        <el-form-item label="申请人身份证号" prop="apply_number">
          <el-input v-model="conForm.apply_number" :maxlength="18" placeholder="请填写身份证号码" :disabled="isEdit && conForm.is_checked == 1"></el-input>
        </el-form-item>
        <el-form-item label="申请人联系电话" prop="apply_phone">
          <el-input v-model="conForm.apply_phone" :maxlength="13" placeholder="请填写申请人联系电话"></el-input>
        </el-form-item>
        <el-form-item label="申请人邮箱" prop="apply_email">
          <el-input v-model="conForm.apply_email" :maxlength="30" placeholder="请填写申请人邮箱"></el-input>
        </el-form-item>
        <el-form-item label="申请人地址" class="form-ipt-sm-wrap" required>
          <el-form-item class="form-ipt-sm" prop="province_id" style="display:inline-block;width:136px;">
            <el-select v-model="conForm.province_id" placeholder="请选择省" @change="changeProvince(conForm.province_id)" class="">
              <el-option v-for="item in provinceData" :label="item.name" :value="item.area_id" :key="item.area_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-ipt-sm" prop="city_id" style="display:inline-block;width:136px;">
            <el-select v-model="conForm.city_id" placeholder="请选择市" @change="changeCity(conForm.city_id)" class="">
              <el-option v-for="item in cityData" :label="item.name" :value="item.area_id" :key="item.area_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-ipt-sm" prop="area_id" style="display:inline-block;width:136px;">
            <el-select v-model="conForm.area_id" placeholder="请选择区" class="">
              <el-option v-for="item in areaData" :label="item.name" :value="item.area_id" :key="item.area_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address" style="margin-top:22px;">
            <el-input v-model="conForm.address" auto-complete="off" class="form-ipt" placeholder="请填写详细地址" :maxlength="80"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="申请人邮编" prop="zip_code">
          <el-input v-model="conForm.zip_code" :maxlength="6" placeholder="请填写邮政编码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="isDefault">设为默认</el-checkbox>
        </el-form-item>

      </div>
      <el-form-item>
        <el-button type="primary" @click="add('ruleForm')" :disabled="submitDisabled">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import qs from 'qs'
const indexUrl = CONFIG.indexUrl;
const userUrl = CONFIG.userUrl;
const addressUrl = userUrl + '/api/areas';
const countryUrl = userUrl + '/api/country';
import VueCookie from 'vue-cookie'
const addSebjectUrl = userUrl + '/api/subject';
const editSebjectUrl = userUrl + '/api/subjectModify';

export default {
  //formData:表单数据  applyType:当前选中的类型  dataIsNeedInit:判断是否需要置空表单数据
  props:['formData',  'applyType', 'dataIsNeedInit'],
  data () {
    //大陆个体身份证验证
    let dlgt_checkId = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!value) {
          return callback(new Error('请填写身份证号码'));
      }
      setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error('身份证格式错误'));
          } else {
            callback();
          }
      }, 50);
    };
    //大陆个体手机号码\固定电话验证
    let dlgt_checkPhone = (rule, value, callback) => {
      let reg = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)/;
      if (!value) {
          return callback(new Error('请填写申请人联系电话'));
      }
      setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error('请填写正确的手机号码，固话前请加区号和-'));
          } else {
            callback();
          }
      }, 50);
    };
    //大陆个体邮箱验证
    let dlgt_checkEmail = (rule, value, callback) =>{
      let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!value) {
          return callback(new Error('请填写申请人邮箱'));
      }
      if (value.length > 30) {
          return callback(new Error('邮箱不能超过30个字符'));
      }
      setTimeout(() => {
          if (!emailReg.test(value)) {
            callback(new Error('邮箱格式错误'));
          } else {
            callback();
          }
      }, 50);
    };

    //统一邮编验证
    let checkZipCode = (rule, value, callback) =>{
      let zipCodeReg = /^\d{6}$/;
      if (!value) {
          return callback(new Error('请填写邮政编码'));
      }
      setTimeout(() => {
          if (!zipCodeReg.test(value)) {
            callback(new Error('邮政编码仅限6位数字'));
          } else {
            callback();
          }
      }, 50);
    };

    return {
      submitDisabled: false,
      //是否为修改
      isEdit: false,
      //省市区数据集
      provinceData:[],
      cityData:[],
      areaData:[],

      ///境外个体
      jwgt_areaData:[],

      ///境外企业
      jwqy_areaData:[],

      isDefault: false,
      conForm:{
        apply_id:'',
        apply_type:2,//主体类型
        is_default:'', //是否默认主体
        apply_name:'',//姓名
        name_en:'',//英文名
        apply_number:'',//身份证号或证件号
        apply_phone:'',//手机号或电话
        apply_email:'',//邮箱
        province_id:'',//省id
        city_id:'',//市id
        area_id:'',//区id
        area_info:'', //省市县名称拼接以空格隔开，境外则国家名称以空格隔开
        address:'',//详细地址
        zip_code:'',//邮编
        apply_fax:'',
        is_checked: '' //1表示已实名认证过
      },
      rules:{
        //大陆个体
        apply_name:[
          { required: true, message: '请填写申请人姓名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]{2,20}$/, message: '请填写2-20个汉字', trigger: 'blur' }
        ],
        apply_number: [
          { required: true, validator:dlgt_checkId, trigger: 'blur' }
        ],
        apply_phone: [
          { required: true, validator:dlgt_checkPhone, trigger: 'blur' }
        ],
        apply_email:[
          { required: true, validator:dlgt_checkEmail, trigger: 'blur' }
        ],
        province_id:[
          { type:'number', required: true, message: '请选择省份', trigger: 'change' }
        ],
        city_id:[
          { type:'number', required: true, message: '请选择城市', trigger: 'change' }
        ],
        area_id:[
          { type:'number', required: true, message: '请选择区', trigger: 'change' }
        ],
        address:[
          { required: true, message: '请填写详细地址', trigger: 'blur' },
          //{ min: 2, max: 30, message: '详细地址长度 2到 30个字符', trigger: 'blur' }
        ],
        zip_code:[
          { required: true, validator:checkZipCode, trigger: 'blur' }
          /*{ required: true, message: '请填写申请人邮编', trigger: 'blur' },
          { max: 12, message: '邮编最长12个字符', trigger: 'blur' }*/
        ],
      }
    }
  },
  mounted () {
    this.initProvince();
  },
  methods: {
    // 初始化省份
    initProvince(){
      var self = this;
      this.$http.get(addressUrl+'?pId=0')
      .then(function(resp){
        resp = resp.data;
        if(resp.elements){
          self.provinceData = resp.elements;
          self.initData();
        }else {
          console.error(resp.msg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    },
    // 省份切换渲染城市 城市切换渲染区
    _triggerChange (code, dataName, callback){
      if(!code){
        return;
      }
      var self = this;
      this.$http.get(addressUrl+'?pId='+ code)
      .then(function(resp){
        resp = resp.data;
        if(resp.elements){
          self[dataName] = resp.elements;
          callback && callback();
        }else {
          console.error(resp.msg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    },
    changeProvince(provinceCode){
      this.conForm.area_id = '';
      this.conForm.city_id = '';
      this.areaData = [];
      this._triggerChange(provinceCode, 'cityData');
    },
    changeCity(cityCode){
      this.conForm.area_id = '';
      this._triggerChange(cityCode, 'areaData');
    },
    getSelectName (code, dataName){
      var self = this;
      var data = self[dataName];
      var ret = '';
      $.each(data, function(i, item){
        if (item.area_id == code) {
          ret = item.name;
          return false;
        }
      });
      return ret;
    },
    //地址拼接
    getAreaInfo(){
      var data = this.conForm;
      var province_id = data.province_id;
      var city_id = data.city_id;
      var area_id = data.area_id;
      return [this.getSelectName(province_id, 'provinceData'), this.getSelectName(city_id, 'cityData'), this.getSelectName(area_id, 'areaData')].join(' ');
    },
    //添加主体请求
    add(formName){
      var self = this;
      if (self.submitDisabled) {

        return;
      }
      self.submitDisabled = true;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          var tip = self.isEdit ? '修改': '增加';
          self.$confirm('确认'+tip+'该主体吗?', '提示', {
            type: 'warning',
            closeOnClickModal: false
          }).then((resp) => {
            self.conForm.area_info = self.getAreaInfo();
            self.conForm.is_default = self.isDefault ? 1 : 0;
            self.conForm.apply_type = self.applyType || 1;
            //var method = self.isEdit ? 'put' : 'post';
            var url = self.isEdit ? editSebjectUrl : addSebjectUrl;
            // put 修改接口 post 新增
            // put ie9下跨域不支持，改用post
            self.$http.post(url+'?access_token='+ VueCookie.get('user_token'), self.conForm)
            .then(function(resp){
              self.submitDisabled = false;
              //console.log(resp.data);
              var data = resp.data;
              if(data.code=="fail"){
                self.$notify({
                  title: '失败',
                  message: data.msg,
                  type: 'error'
                });
              }else{
                self.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                });
                self.$emit('addSuccess')
              }
            }).catch((error) => {
              self.submitDisabled = false;
              var data = error.response.data;
              if(data.status == 10034){//最大上限
                self.$notify({
                  title: '失败',
                  message: data.msg,
                  type: 'error'
                });
              }
            });
          }).catch(() => {
            self.submitDisabled = false;
          });
        }else{
          self.submitDisabled = false;
        }
      });
    },
    //初始化表单数据
    initData(){
      var self = this;
      if (this.formData.apply_type) {
        this.isEdit = true;
      }else{
        this.isEdit = false;
      }
      var conForm = this.conForm;
      var formData = self.formData;
      var applyId = formData.apply_id;
      if (self.dataIsNeedInit && applyId) {
        $.each(conForm, function(key, val){
          Vue.set(conForm, key, formData[key]);
        });
      }else{
        $.each(conForm, function(key, val){
          Vue.set(conForm, key, null);
        });
        if (applyId) {
          Vue.set(conForm, 'apply_id', applyId);
        }
      }
      self.conForm.province_id = self.conForm.province_id ? (self.conForm.province_id) : '';
      self.conForm.city_id = self.conForm.city_id ? (self.conForm.city_id) : '';
      self.conForm.area_id = self.conForm.area_id ? (self.conForm.area_id) : '';
      // city_id和area_id数据会丢失，暂用这个方法处理
      if (self.isEdit) {
        var city_id = self.conForm.city_id;
        var area_id = self.conForm.area_id;
        setTimeout(function(){
          self.conForm.city_id = city_id;
          setTimeout(function(){
            self.conForm.area_id = area_id;
          }, 200);
        }, 200);
      }
    }
  },
  watch:{
    formData(){
      this.initData();
    },
    'conForm.province_id': function(){
        this.changeProvince(this.conForm.province_id)
    },
    'conForm.city_id': function(){
        this.changeCity(this.conForm.city_id)
    }
  }
}
</script>


<style lang="scss">
.dlgtForm{
  width: 590px;height: 508px;
  .el-form-item__content{
    height: 36px;
  }
  .form-ipt-sm-wrap{
    > .el-form-item__content{
      height: auto;
    }
  }
}
</style>
