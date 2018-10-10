<template>
  <div class="page-wrapper">
    <div class="page-title">美丽基金明细</div>
    <div style="float:right;">
    <el-button :class="[dayDatashow ? 'el-button--primary': '']" class="el-icon-date" @click="dayDatashow = true;monthDatashow = false;yearDatashow = false;autoDatashow = false;">&nbsp;日</el-button>
    <el-button :class="[monthDatashow ? 'el-button--primary': '']" class="el-icon-date" @click="dayDatashow = false;monthDatashow = true;yearDatashow = false;autoDatashow = false;">&nbsp;月</el-button>
    <el-button :class="[yearDatashow ? 'el-button--primary': '']" class="el-icon-date" @click="dayDatashow = false;monthDatashow = false;yearDatashow = true;autoDatashow = false;">&nbsp;年</el-button>
    <el-button :class="[autoDatashow ? 'el-button--primary': '']" class="el-icon-date" @click="dayDatashow = false;monthDatashow = false;yearDatashow = false;autoDatashow = true;">&nbsp;自定义</el-button>
        <el-date-picker
          v-show="dayDatashow"
          v-model="day"
          align="right"
          type="date"
          placeholder="选择日期"
          @change="pickTime"
          :picker-options="pickerOptions1">
        </el-date-picker>
        <el-date-picker
          v-show="monthDatashow"
          v-model="month"
          type="month"
          placeholder="选择月"
          @change="pickTime">
        </el-date-picker>
        <el-date-picker
          v-show="yearDatashow"
          v-model="year"
          align="right"
          type="year"
          placeholder="选择年"
          @change="pickTime">
        </el-date-picker>
        <el-date-picker
          v-show="autoDatashow"
          v-model="auto"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="pickTime"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <el-input class="vipconsumemobile" v-model="mobile" prop="mobile" placeholder="请输入手机号"></el-input>
      <el-button type="primary" icon="search" @click="handleSearchClick">搜索</el-button>
      </div>
    <div class="bills-wrapper">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="username"
          label="会员姓名">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="微信昵称">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="total"
          label="基金金额">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="消费时间">
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import { rootPath } from "../../config/apiConfig";
import { formatDate } from "../../common/js/dateformat.js";

export default {
  data() {
    return {
      tableData: [],
      mobile: "",
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dayDatashow: true,
      monthDatashow: false,
      yearDatashow: false,
      autoDatashow: false,
      day: "",
      month: "",
      year: "",
      auto: "",
      searchtime: ""
    };
  },
  created() {
    var that = this;
    this.axios({
      method: "post",
      url: rootPath + "/gold/standing/get",
      params: {
        // userid: JSON.parse(window.sessionSt/gold/standing/getorage.getItem("userInfo")).userid,
        phone: that.mobile,
        date: this.searchtime
      }
    }).then(response => {
      if (
        response.data &&
        response.data.isSucceed &&
        response.data.returnData.bizIsSucceed
      ) {
        var data = response.data.returnData.bizReturnData.standingRecord;
        for (var index in data) {
          if (data[index].type == "0") {
            data[index].type = "支出";
          } else {
            data[index].type = "收入";
          }
        }
        that.tableData = data;
      } else if (response.data == undefined) {
        this.$message({
          message: "系统请求发生错误",
          type: "error"
        });
      } else if (response.data.isSucceed == false) {
        this.$message({
          message: response.data.returnMessage,
          type: "error"
        });
      } else {
        this.$message({
          message: response.data.returnData.bizReturnMessage,
          type: "error"
        });
      }
      this.logining = false;
    });
  },

  methods: {
    pickTime(val) {
      this.searchtime = val;
    },
    handleSearchClick() {
      var that = this;
      this.axios({
        method: "post",
        url: rootPath + "/gold/standing/get",
        params: {
          // userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          phone: that.mobile,
          date: this.searchtime
        }
      }).then(response => {
        if (
          response.data &&
          response.data.isSucceed &&
          response.data.returnData.bizIsSucceed
        ) {
          var data = response.data.returnData.bizReturnData.standingRecord;
          for (var index in data) {
            if (data[index].type == "0") {
              data[index].type = "支出";
            } else {
              data[index].type = "收入";
            }
          }
          that.tableData = data;
        } else if (response.data == undefined) {
          this.$message({
            message: "系统请求发生错误",
            type: "error"
          });
        } else if (response.data.isSucceed == false) {
          this.$message({
            message: response.data.returnMessage,
            type: "error"
          });
        } else {
          this.$message({
            message: response.data.returnData.bizReturnMessage,
            type: "error"
          });
        }
        this.logining = false;
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-input__icon {
  background-color: #20A0FF;
}

.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: 'Microsoft YaHei';
  font-size: 18px;
}

.bills-wrapper {
  float: left;
  width: 99%;
  padding-top: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  min-height: 30px;
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

.clearfix:before, .clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
