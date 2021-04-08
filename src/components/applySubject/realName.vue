<template>
	<el-dialog
	  title="实名认证"
	  :visible.sync="dialogVisible"
	  size="tiny"
	  :class="{'real':stepsIndex!=3,'end':stepsIndex==3}">
	  <div class="prompt" v-if="stepsIndex!=3">
	  	<p>为了您的信息安全及存证的合法性，请填写您的个人信息，进行银联四要素实名验证。实名认证后，信息不可修改。</p>
	  </div>
	  <!-- 步骤条 -->
	  <div class="steps_list mt20 mb20" v-if="stepsIndex!=3">
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
	  <div class="list_one" v-if="stepsIndex==1">
	  	<el-form ref="first" :rules="rules" :model="first" label-width="70px">
	  		<el-form-item label="姓名" style="margin-bottom:0">
			    <span>李峰</span>
			  </el-form-item>
			  <el-form-item label="身份证号" style="margin-bottom:10px;">
			    <span>500000000000000000</span>
			  </el-form-item>
			  <el-form-item label="银行卡号" prop="number">
			    <el-input v-model="first.number" placeholder="请输入银行卡号"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号" prop="phone">
			    <el-input v-model="first.phone" placeholder="请输入身份证号"></el-input>
			  </el-form-item>
			</el-form>
	  </div>
	  <!-- 第二步 -->
	  <div class="list_second" v-if="stepsIndex==2">
	  	<el-form ref="second" :rules="rules2" :model="second" label-width="70px">
	  		<el-form-item label="手机号" style="margin-bottom:0">
			    <span>13603030303</span>
			  </el-form-item>
			  <el-form-item label="验证码" prop="codenum">
			    <el-input v-model="second.codenum" placeholder="请输入验证码"></el-input>
			  </el-form-item>
			</el-form>
			<button>获取验证码</button>
	  </div>
	  <!-- 第三步 -->
	  <div class="list_end" v-if="stepsIndex==3">
	  	<img src="~assets/img/success.png" alt="">
	  	<p class="mt10 mb20">实名认证成功</p>
	  	<button>确定</button>
	  </div>
	  <div class="btn_list" v-if="stepsIndex!=3">
	  	<button class="mr20">上一步</button>
	  	<button @click="nextClick">下一步</button>
	  </div>
	</el-dialog>
</template>
<script>
  export default {
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
        dialogVisible: false,
        first:{},
        second:{},
        stepsIndex:1,
        rules:{
        	phone:[{ type: "string",validator:checkPhone,trigger: 'blur' }],
        	number:[{ type: "string",validator:bankNumber,trigger: 'blur' }]
        }
      };
    },
    methods: {
      nextClick(){
      	var self = this;
      	if(self.stepsIndex == 1){
      		self.stepsIndex = 2;
      	}else{
      		self.stepsIndex = 3;
      	}
      }
    }
  };
</script>
<style lang="scss">
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
					.el-input__inner{height:34px;}
				}
			}
		}
	}
	.list_second{width:430px;margin:0 auto;position: relative;
		button{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;line-height:34px;position: absolute;bottom:0;right:0;}
		.el-form-item{
			.el-form-item__label{height:34px;}
			.el-form-item__content{width:250px;height:34px;
				.el-input{height:34px;
					.el-input__inner{height:34px;}
				}
			}
		}
	}
	.btn_list{height:34px;text-align:center;font-size:0px;padding-bottom:20px;
		button{width:100px;height:34px;background: #3db1fa;border-radius: 3px;font-size: 14px;color: #fff;text-align:center;line-height:34px;}
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
</style>
