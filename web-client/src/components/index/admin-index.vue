<template>
  <div class="welcome">
    <!-- <div class="banner"></div> -->
    <div class="gaishu">
      <div class="title" style="color:rgb(0,122,204)">欢 迎 登 陆 周 报 管 理 平 台</div>
      <!-- <el-card class="index-box-card">
        <div class="dataitem link" @click="changeView('dealwithdraw')">
          <div class="data-item-title">待发货订单</div>
          <div class="data-item-data">{{withdrawReqCount}} <span>个</span></div>
        </div>
        <div class="dataitem link">
          <div class="data-item-title">销售总金额</div>
          <div class="data-item-data">{{sumtotal}} <span>元</span></div>
        </div>
        <div class="dataitem link">
          <div class="data-item-title">会员总数</div>
          <div class="data-item-data">{{usercount}} <span>人</span></div>
        </div>
      </el-card> -->
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {

    };
  },

  methods: {

  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.title{
  font-size 50px;
  margin auto 0;
  text-align center;
  margin 150px;
}
</style>
