<template>
	<div id="app">
		<sebe-header :userName="userName" :cartNum="cartNum"></sebe-header>
		<mini-login @callbackDo="callbackDo" :showMini.sync="showMini" @closeMini="showMini=false"></mini-login>
		<div class="container clearfix web-container-main">
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
				<!-- 首页部分 -->
				<div class="homepage">
					<!-- 存证分类 -->
					<div class="category_list">
						<!-- <p class="prompt mb20">为了更好的保证作品的安全性且具备法律效力，平台会把作品以区块链的技术手段进行存储，并同时出具区块链存证证书。</p> -->
						<div class="clearfix">
						<!-- 公证存证 -->
							<div class="category fl" @click="pathTo(1),txtType=1">
								<p class="tit">公证存证</p>
								<img class="mt25 mb15" src="~assets/img/literature/hzgz.png" width="60" alt="">
								<p class="name mt5">杭州互联网公证处</p>
								<p class="txt">公证机构作为法定的证明机构，拾贝携手杭州互联网公证处借助可靠的技术手段提供专业的解决方案，对知识产权的权利进行预登记，公证机构借助法定保密义务，保管权利载体文件。在发生纠纷时，通过公证职能，证明权利人在什么时间、持有什么知识产权，起到法定的特殊证据效力。</p>
								<button class="mt15">选择</button>
							</div>
							<!-- 司法鉴定存证 -->
							<div class="category fl ml20" @click="pathTo(2),txtType=2">
								<p class="tit">司法鉴定存证</p>
								<img class="mt10" src="~assets/img/literature/zgz.png" alt="">
								<p class="name mt5">福建中证司法鉴定中心</p>
								<p class="txt">司法鉴定存证是由我国专业、权威的司法鉴定机构——福建中证司法鉴定中心予以鉴证，确定了“什么人、在什么时候、拥有什么样的电子数据”的客观事实，并且存证证书及文件是不能被篡改和伪造的。</p>
								<button class="mt15">选择</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<customer-service :cartNum="cartNum"></customer-service>
		</div>
		<sebe-footer class="mt15"></sebe-footer>
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
	const indexUrl = CONFIG.indexUrl;
	const cartUrl = CONFIG.cartUrl;
	const userUrl = CONFIG.userUrl;
	const queryCzUrl = './cunnar/querycznum.do';

	const ishtml4 = !window.FormData;

	export default {
		data () {
			return {
				txtType:1,
        userUrl: userUrl,
        cartUrl: cartUrl,
        czbNum:0, //存证包数量
        cartNum:"",
        CONFIG: CONFIG,
        indexUrl: indexUrl,
        showMini: false,
        userName: '',
        source: 1,
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
      var userName = this.$cookie.get('truename');
      var phone = this.$cookie.get('phone');
      if (phone) {
        phone = phone.slice(0, 3) + '****' + phone.slice(-4);
      }
      this.userName = userName ? userName : phone;
      this.cartNum = this.$cookie.get('cart_num') || '0';
      this.getCzNum();
    },
    methods: {
    	pathTo(temp){
    		let path = temp == 2 ? '/app' : '/appNew';
    		this.$router.push(path);
    	},
      needLogin() {
        this.$message.warning('未登录或登录已失效，请登录');
        this.showMini = true;
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
    },
		watch: {
		}
	}
</script>

<style lang="scss">
.web-container-main{
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

	.homepage{width:1170px;margin:10px auto 15px;
		.category_list{background-color:#fff;padding:40px 60px 50px;
			.prompt{background: #FFF7E4;width:1050px;height:40px;font-size: 13px;color: #D8A045;text-align:center;line-height:40px; }
			.category:hover{border-color:#3db1fa}
			.category{width:515px;height:368px;border:1px solid #eee;text-align:center;padding-top:30px;cursor:pointer;
				.tit{font-size:20px;color:#000;font-weight: bolder;line-height:26px;}
				.name{font-size: 14px;color: #666666;line-height:20px;}
				.txt{width:350px;text-align:left;margin:10px auto 0;font-size: 13px;color:#999;height:90px;line-height:18px;}
			}
		}
		button {
			width: 140px;
			height: 42px;
			background-color: #3db1fa;
			color: #FFF;
			font-size: 14px;
			text-align: center;
			border-radius: 3px;
		}
	}
}
</style>
<style>
.el-loading-mask {background-color: rgba(255,255,255,.5);}
.el-message-box{vertical-align: top;top: 20%;position: absolute;left: 50%;-ms-transform: translateX(-50%);transform: translateX(-50%);}
.el-dialog{top:20%!important;}
.el-message{z-index: 3001!important;}
</style>
