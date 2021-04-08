<template>
	<el-dialog title=" " :visible.sync="eVisible" top="0" class="experience_dialog" :lock-scroll="false" :close-on-click-modal="false" :before-close="selfVisible" :append-to-body="true">
    <div class="experience_in">
      <div class="img" :class="{'hidden': idx !== index}" v-for="(item, index) in imgData" :key="item.src">
        <img :src="item.src">
        <div class="mask" :class="{hidden: nomask}"></div>
        <a v-if="nomask && item.style1" href="javascript:void (0);" class="hand_img" :style="item.style1" @click="handle"></a>
        <a v-if="nomask && item.style2" href="javascript:void (0);" class="hand_img" :style="item.style2" @click="handle"></a>
        <button v-if="index == 0 && nomask == false" class="btn" @click="nomask=true">立即体验</button>
        <button v-if="!nomask && index == (imgData.length-1)" class="btn" @click="idx=0,nomask=true">重新体验</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
	import qs from 'qs'
	const userUrl = CONFIG.userUrl;
  import img1 from 'assets/img/literature/steps/1.png';
  import img2 from 'assets/img/literature/steps/2.png';
  import img3 from 'assets/img/literature/steps/3.png';
  import img4 from 'assets/img/literature/steps/4.png';
  import img5 from 'assets/img/literature/steps/5.png';
  import img6 from 'assets/img/literature/steps/6.png';
  import img7 from 'assets/img/literature/steps/7.png';
  import img8 from 'assets/img/literature/steps/8.png';
  import img9 from 'assets/img/literature/steps/9.png';
  import img10 from 'assets/img/literature/steps/10.png';
  import img11 from 'assets/img/literature/steps/11.png';
  import img12 from 'assets/img/literature/steps/12.png';
  export default {
  	props:['eVisible'],
    data() {
      return {
        idx: 0,
        nomask: false,
        imgData: [
          {
            src: img1,
            style1: 'left:579px;top:148px;',
          },
          {
            src: img2,
            style1: 'left:579px;top:188px;',
          },
          {
            src: img3,
            style1: 'left:668px;top:229px;',
          },
          {
            src: img4,
            style1: 'left:620px;top:238px;',
            style2: 'left:462px;top:317px;',
          },
          {
            src: img5,
            style1: 'left:250px;top:160px;',
          },
          {
            src: img6,
            style1: 'left:240px;top:255px;',
          },
          {
            src: img7,
            style1: 'left:240px;top:310px;',
          },
          {
            src: img8,
            style1: 'left:240px;top:337px;',
          },
          {
            src: img9,
            style1: 'left:705px;top:425px;',
          },
          {
            src: img10,
            style1: 'left:369px;top:246px;',
          },
          {
            src: img11,
            style1: 'left:424px;top:300px;',
          },
          {
            src: img12,
            style1: 'left:473px;top:286px;',
          }
        ]
      };
    },
    mounted(){
    },
    methods: {
      selfVisible(){
        this.$emit('update:eVisible', false);
      },
      handle(){
        this.idx += 1;
        if (this.idx>this.imgData.length-1) {
          this.nomask = false;
          this.idx = this.imgData.length-1;
        }else{
          this.nomask = true;
        }
      }
    },
    watch:{
      eVisible(){
        this.idx = 0;
        this.nomask = false;
      }
    }
  };
</script>
<style lang="scss">
.experience_dialog{
  .btn{}
  // 弹框尺寸
  .el-dialog{width:900px;height: 500px;-ms-transform: translate(0, -50%) !important;transform: translate(0, -50%);top:50%!important;margin-bottom: 0;
    .el-dialog__header{
    	padding: 0;
      span{font-size:14px;color: #333333;line-height:16px;}
      .el-dialog__headerbtn{
        position: absolute;right: 20px;top:20px;z-index: 1000;
      }
    }
    .el-dialog__body{
      padding:0;
    }
  }
  .experience_in{
    margin-top:-20px; width: 900px;height: 500px;
    .img{
      position: relative;width: 900px;height: 500px;
      img{width: 900px;height: 500px;}
      .mask{position: absolute;left:0;top:0;background: rgba(0, 0, 0, 0.9);width: 900px;height: 500px;}
      .hand_img{
        width: 50px;
        height: 50px;
        position: absolute;
        left:0;
        top:0;
        background: url(~assets/img/literature/hand_img.png) no-repeat;
        animation: handImg 1s infinite linear;
      }
      button{position: absolute;left: 50%;top:50%;margin-left: -70px;margin-top: -21px;background: #3DB1FA;border-radius: 3px;width:140px;height:42px;text-align:center;line-height:42px;font-size:14px;color:#fff;display:block;border:1px solid #3DB1FA;}
    }
  }
  @keyframes handImg{
    0% {
      filter: alpha(opacity=10);
      -moz-opacity: .1;
      opacity: .1;
    }
    50% {
        filter: alpha(opacity=100);
        -moz-opacity: 1;
        opacity: 1;
    }
    100% {
        filter: alpha(opacity=10);
        -moz-opacity: .1;
        opacity: .1;
    }
  }
}
</style>
