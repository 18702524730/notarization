<template>
	<el-dialog :title="czChannel == 3 ? '本人操作验证' : '提示'" :visible.sync="selfValidateVisible" size="tiny" class="self_validation selfie9" :lock-scroll="false" :before-close="selfVisible" :close-on-click-modal="false">
		<div class="validation_data">
			<p v-if="czChannel == 3" class="mb10">为了您的信息安全及存证的合法性，需要验证是否是您本人操作</p>
			<div v-loading="dialogLoading" v-show="dialogLoading" element-loading-text="验证中" style="min-height: 132px;"></div>
			<div class="list_second" v-if="!dialogLoading && !stateSteps">
				<el-form ref="second" :rules="rules" :model="second" label-width="65px">
					<el-form-item label="手机号" style="margin-bottom:0">
						<span>{{bankPhone}}</span>
					</el-form-item>
					<el-form-item label="验证码" prop="mobile_code">
						<el-input v-model="second.mobile_code" placeholder="请输入验证码" :maxlength="6"></el-input>
					</el-form-item>
				</el-form>
				<button class="btn getcode" :class="{disabled: preventCode}" @click="getCode">{{codeText}}</button>
			</div>
			<!-- 成功 -->
			<div class="validation_end" v-if="!dialogLoading && stateSteps">
				<img src="~assets/img/literature/truelists.gif" alt="">
				<div class="end_btn">
					<p>剩余存证包数量：{{czbNum-1}}<a class="ml5" :href="indexUrl + '/store/service/218080008707.htm'" target="_blank">购买存证包</a></p>
					<div class="btn_end mt20">
						<a class="end_left mr20" :href="userUrl+'/iprp/#/orders'">查看我的存证</a>
						<a class="end_right" @click="resetUploader">继续存证</a>
					</div>
				</div>
			</div>
			<button class="btn mt30" v-if="!dialogLoading && !stateSteps" @click="selfValidationSubmit('second')">提交</button>
		</div>
	</el-dialog>
</template>
<script>
	import qs from 'qs'
	import $ from 'jquery'
	const userUrl = CONFIG.userUrl;
	const indexUrl = CONFIG.indexUrl;
	export default {
		props:['selfValidateVisible','allData','bankPhone','czbNum'],
		data() {
			return {
				clickDouble:true,
				codeText:'获取验证码',
				userUrl: userUrl,
				indexUrl: indexUrl,
				czChannel:'3',
				preventCode: false,
				second:{},
				dialogLoading:false,
				rules:{
					mobile_code:[
						{ required: true, message: '请输入验证码', trigger: 'blur' },
						{ required: true, pattern: /^[0-9]{6}$/, message: '验证码为6位数字值', trigger: 'blur' },
					],
				},
				stateSteps:false,
			};
		},
		mounted(){
			// this.getCode();
		},
		methods: {
			selfVisible(){
				this.$emit('selfVisible');
			},
			//本人验证弹框中，获取手机验证码
			getCode(){
				var self = this;
				if (self.preventCode) {
					return;
				}
				self.ver_tip = '';
				self.$http.post('./EvidenceController/egongzheng/getMobCode.do', qs.stringify({mobile: self.bankPhone}))
				.then((response) => {
					var data = response.data;
					self.$message.success('验证码已发送');
					self.timeout();
				})
				.catch((error) => {
					var data = error.response.data;
					self.ver_tip = data.msg;
					//self.submitDisabled = false;
					//self.$message(data.msg)
				});
			},
			timeout(){
				var self = this;
				var second = 60, timer;
				self.preventCode = true;
				timer = setInterval(function(){
					if(second<=0){
						clearInterval(timer);
						second = 60;
						self.codeText = "重发验证码";
						self.preventCode = false;
					}else{
						self.codeText = second + "s后可重发";
						self.preventCode = true;
						second--;
					}
				}, 1000);
			},
			submit(){//请求存证
				var self = this;
				self.dialogLoading=true;
				var postData=$.extend(this.allData,{mobCode:this.second.mobile_code});
				self.$http.post('./EvidenceController/addAttestations.do', postData)
				.then((resp) => {
					self.dialogLoading=false;
					self.clickDouble=true;
					if(resp.data.code === '0'){
						self.stateSteps = true;
					}else if(resp.data.code === '2010010'){
						self.$message.error('验证码错误');
					}else if(resp.data.code === '3010019'){
						self.$message.error('验证码错误');
					}else if(resp.data.code === '4010023'){
						self.selfValidate();
						self.$message.error('剩余存证次数不足');
					}else if(resp.data.code === '4010020'){
						self.selfValidate();
						self.resetUploader();
						self.$message.error(resp.data.desc);
					}else if(resp.data.code === '4010008'){
						// 未登录全局统一处理了
					}else{
						self.selfValidate();
						self.$alert('订单生成失败，请重试');
					}
				})
				.catch((error) => {
					this.clickDouble=true;
					this.dialogLoading=false;
					this.selfValidate();
					self.$alert('订单生成失败，请重试');
				})

			},
			selfValidate(){
				this.$emit('selfClick');
			},
			selfValidationSubmit(ref){
				var self = this;
				if(this.clickDouble){
					this.clickDouble=false;
					self.$refs[ref].validate((valid) => {
						if (valid) {
							self.submitDisabled = false;
							self.submit();
						}
					});
				}
			},
			getCode(){
				var self = this;
				if (self.preventCode) {
					return;
				}
				self.ver_tip = '';
				self.$http.post('./EvidenceController/egongzheng/getMobCode.do', qs.stringify({mobile: self.bankPhone}))
				.then((response) => {
					console.log(response.data)
					var data = response.data;
					self.$message.success('验证码已发送');
					self.timeout();
				})
				.catch((error) => {
					var data = error.response.data;
					// self.ver_tip = data.msg;
					//self.submitDisabled = false;
					//self.$message(data.msg)
				});
			},
			resetUploader(){//初始化
				this.$emit('initialize');
			},
			selfClick(){
				this.$emit('selfClick');
			}
		},
		watch:{
			// czChannel(){
			//   this.resetUploader()
			// },
			'selfValidateVisible':function(now,old){
				if(!now){
					this.stateSteps=false;
				}
				if (now) {
					this.getCode();
				}
			}
		}
	};
</script>
<style lang="scss">
.self_validation{
	.validation_data{
		>p{background: #FFF7E4;height:38px;line-height:38px;font-size: 13px;color: #D8A045;padding-left: 17px;}
		.validation_end{text-align:center;
			>p{margin:10px auto 0;width:268px;height:40px;border-radius:20px;border:1px solid #09BB07;line-height:40px;padding-left: 20px;color:#09BB07;
				span{width:207px;display:inline-block;}
			}
			.end_btn{width:300px;margin:0px auto 0;font-size:0;
				p{font-size:14px;text-align:center;
					span{color:#3db1fa;}
				}
				.btn_end a{width:140px;height:42px;border:1px solid #3db1fa;border-radius:3px;font-size:14px;display:inline-block;line-height:42px;text-decoration:none;cursor:pointer;}
				.end_left{color:#3db1fa;background-color:#fff;}
				.end_right{color:#fff;background-color:#3db1fa;}
			}
		}
	}
	.list_second{width:400px;margin:0 auto;position: relative;
		button{width:100px;height:34px;background: #FFFFFF;border: 1px solid #3DB1FA;border-radius: 3px;font-size: 14px;color: #3DB1FA;text-align:center;
			line-height:34px;position: absolute;bottom:10px;right:0;}
		.getcode.disabled{background-color: #ccc;border-color:#ccc;color: #eee;cursor:not-allowed;}
		.el-form-item{
			.el-form-item__label{height:34px;line-height:34px;}
			.el-form-item__content{width:233px;height:34px;margin-bottom: 10px;line-height:34px;
				.el-input{height:34px;
					.el-input__inner{height:34px;width:220px;vertical-align: top;}
				}
			}
		}
	}
	.btn{background: #3DB1FA;border-radius: 3px;width:140px;height:42px;text-align:center;line-height:42px;font-size:14px;color:#fff;margin:0 auto;display:block}
// 弹框尺寸
	.el-dialog{width:440px;
		.el-dialog__header{
			span{font-size:14px;color: #333333;line-height:16px;}
		}
		.el-dialog__body{padding:20px 20px 40px;}
	}
}
</style>
