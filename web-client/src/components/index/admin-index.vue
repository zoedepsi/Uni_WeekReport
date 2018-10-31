<template>
  <div class="content-wrapper">
      <div class="card-title">会议纪要</div>
      <div class="index-card-row">
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">本周会议总次数</div>
            <div class="content-panel-value total-color">{{datas.totalCount}}<span>次</span></div>
            <div class="content-panel-detail">
              <!-- <span>在线支付 0.00元</span> -->
              <!-- &nbsp;&nbsp;<span>货到付款 0.00元</span> -->
              </div>
          </div>
          <div class="content-panel-border"></div>
        </div>
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">需求讨论会</div>
            <div class="content-panel-value meituan-color">{{datas.requireCount}}<span>次</span></div>
            <!-- <div class="content-panel-detail"><span>在线支付 0.00元</span>
              &nbsp;&nbsp;<span>货到付款 0.00元</span></div> -->
          </div>
          <div class="content-panel-border"></div>
        </div>
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">研发讨论会
            </div>
            <div class="content-panel-value eleme-color">{{datas.devCount}}<span>次</span></div>
            <!-- <div class="content-panel-detail"><span>在线支付 0.00元</span>
              &nbsp;&nbsp;<span>货到付款 0.00元</span></div> -->
          </div>
        </div>
      </div>
            <div class="card-title">周报</div>
      <div class="index-card-row">
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">本周周报条数</div>
            <div class="content-panel-value total-color">{{datas2.totalCount}}<span>条</span></div>
            <div class="content-panel-detail">
              <!-- <span>在线支付 0.00元</span> -->
              <!-- &nbsp;&nbsp;<span>货到付款 0.00元</span> -->
              </div>
          </div>
          <div class="content-panel-border"></div>
        </div>
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">企划部</div>
            <div class="content-panel-value meituan-color">{{datas2.requireCount}}<span>条</span></div>
            <!-- <div class="content-panel-detail"><span>在线支付 0.00元</span>
              &nbsp;&nbsp;<span>货到付款 0.00元</span></div> -->
          </div>
          <div class="content-panel-border"></div>
        </div>
        <div class="index-card-col">
          <div class="content-panel">
            <div class="content-panel-title">研发部
            </div>
            <div class="content-panel-value eleme-color">{{datas2.devCount}}<span>条</span></div>
            <!-- <div class="content-panel-detail"><span>在线支付 0.00元</span>
              &nbsp;&nbsp;<span>货到付款 0.00元</span></div> -->
          </div>
        </div>
      </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {
      datas: "",
      datas2:''
    };
  },
  mounted() {
    this.queryCount();
    this.queryCount2();
  },

  methods: {
    queryCount() {
      var that = this;
      this.axios({
        method: "get",
        url: rootPath + "/weeklyserver/meet/queryCount"
      }).then(response => {
        if (response.data.code == "00000") {
          that.datas = response.data.data;
        } else if (response.data == undefined) {
          this.$message({
            message: "系统请求发生错误",
            type: "error"
          });
        } else {
          this.$message({
            message: response.data.msg,
            type: "error"
          });
        }
      });
    },
    queryCount2() {
      var that = this;
      this.axios({
        method: "get",
        url: rootPath + "/weeklyserver/report/queryCount"
      }).then(response => {
        if (response.data.code == "00000") {
          that.datas2 = response.data.data;
        } else if (response.data == undefined) {
          this.$message({
            message: "系统请求发生错误",
            type: "error"
          });
        } else {
          this.$message({
            message: response.data.msg,
            type: "error"
          });
        }
      });
    },
  }
};
</script>

<style scoped>
.content-wrapper {
  min-height: 100px;
  width: 90%;
  margin: 0 auto;
  display: block;
}

.card-title {
  line-height: 40px;
  margin-right: 30px;
}

.card-title:before {
  content: "";
  border-left: 2px solid #88b7e0;
  margin-right: 10px;
}

.index-card-row {
  margin: 10px 0 20px;
  width: 100%;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f7f7f7;
}

.index-card-col {
  float: left;
  width: 33.33%;
  position: relative;
}

.content-panel {
  width: 90%;
  height: 130px;
  margin: 10px auto;
}

.content-panel-title {
  width: 100%;
  line-height: 30px;
  font-size: 14px;
  color: #777;
}

.content-panel-value {
  width: 100%;
  line-height: 65px;
  text-align: center;
  font-size: 28px;
  color: #777;
}

.total-color {
  color: #ff5b73;
}

.content-panel-detail {
  width: 100%;
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: -5px;
}

.content-panel-detail span {
  display: inline-block;
  line-height: 15px;
}

.content-panel-border {
  width: 1px;
  height: 90px;
  border-right: 1px solid #ccc;
  right: 1px;
  top: 30px;
  position: absolute;
}
</style>
