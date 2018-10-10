<template>
  <div class="page-wrapper">
    <div class="prods-wrapper">
      <el-row>
        <el-col :span="18"  :offset="3">
          <div style="height:180px;line-height: 180px; font-size: 3em; text-align: center">
          <i class="el-icon-circle-check" style="color:#39bf47;"></i>
            <span style="font-size:0.7em;color:#666">商品购买成功</span></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2" style="text-align: center">
          <el-button type="success" @click="changeView('billmanage')" >查看我的订单</el-button>
          <el-button type="warning" @click="changeView('proddetail')" >　继续购买　</el-button>
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
      changeView(id){
        this.$emit('changeCurrentView', "v-"+id);
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
