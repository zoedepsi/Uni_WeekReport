<template>
  <div class="page-wrapper">
    <div class="page-title">商城中心</div>
    <div class="prods-wrapper">
      <el-row>
        <el-col :span="5"  :offset="1">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../../assets/chongdian.jpg" class="image">
            <div style="padding: 14px;">
              <span>三星便携式移动电源</span>
              <div class="bottom clearfix">
                <time class="time">¥ 20.00</time>
                <!--<el-button type="text" class="button"  @click="openProdDetail">立即购买</el-button>-->
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5"  :offset="1">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../../assets/chongdian.jpg" class="image">
            <div style="padding: 14px;">
              <span>三星便携式移动电源</span>
              <div class="bottom clearfix">
                <time class="time">¥ 20.00</time>
                <!--<el-button type="text" class="button"  @click="openProdDetail">立即购买</el-button>-->
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5"  :offset="1">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../../assets/chongdian.jpg" class="image">
            <div style="padding: 14px;">
              <span>三星便携式移动电源</span>
              <div class="bottom clearfix">
                <time class="time">¥ 20.00</time>
                <!--<el-button type="text" class="button"  @click="openProdDetail">立即购买</el-button>-->
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5"  :offset="1">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../../assets/chongdian.jpg" class="image">
            <div style="padding: 14px;">
              <span>三星便携式移动电源</span>
              <div class="bottom clearfix">
                <time class="time">¥ 20.00</time>
                <!--<el-button type="text" class="button"  @click="openProdDetail">立即购买</el-button>-->
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'
  import proddetail from '../proddetail/proddetail.vue'
  export default {

    create(){

    },
    data(){
      return {

      }
    },
    methods: {

      openProdDetail() {
        this.currentView = proddetail;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .page-title{
    border-left 3px solid #699fff;
    text-indent 8px;
    font-family "Microsoft YaHei"
    font-size 18px
  }
  .prods-wrapper{
    float left;
    width:99%;
    margin-top:20px;
    padding-top:20px;
    padding-bottom:30px;
    border:1px solid #eee;
    -webkit-border-radius: 4px
    -moz-border-radius: 4px
    border-radius: 4px
    min-height:30px
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

</style>
