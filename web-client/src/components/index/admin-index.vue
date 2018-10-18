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
      <div class="detail">
        <h1>V0.2 使用说明</h1>
        <p>1. 数据以团队为单位进行隔离，团队成员可查看团队内部所有人的周报</p>
        <p>2. 除本周周报之外，其他周报不可编辑</p>
        <p>3. 本周仅可填写一次周报</p>
        <p>4. 本周工作总结由上周工作计划自动生成且不允许修改，所以填写周报需要严肃慎重</p>
        <h1>V0.3 待开发内容</h1>
        <p>2. 根据下周工作计划及待办事项自动生成下周周报</p>
        <p>3. 周报编辑功能</p>
        <p>4. 各位同事的反馈需求及建议</p>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {};
  },

  methods: {}
};
</script>

<style scoped>

.title{
  font-size: 50px;
  margin: auto 0;
  text-align: center;
  margin: 80px;
}
.detail{
  width:500px;
  margin:0 auto;
  background: #3A8FB7;
  color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
}
.detail h1{
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}
.detail p{
  margin:5px 0;
}
</style>
