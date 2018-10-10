<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">提现管理</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right;margin-right:10px" @click="lookAll">查看全部</el-button>
        <el-button type="primary" style="float:right;margin-right:10px" @click="notDelivery">未打款</el-button>
        <el-button type="primary" style="float:right;margin-right:10px" @click="deliveryed">已打款</el-button>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table :data="orderList" stripe style="width: 100%">
        <el-table-column label="头像" width='100'>
          <template slot-scope="scope">
            <img :src="scope.row.headImgUrl" width="30px" height="30px" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column prop="wechatNickname" label="微信昵称" width='200'>
        </el-table-column>
        <el-table-column prop="withdrawAmount" label="提现金额" width='100'>
        </el-table-column>
        <el-table-column prop="aliPayUsername" label="支付宝姓名" width='200'>
        </el-table-column>
        <el-table-column prop="aliPayAccount" label="支付宝账户" width='200'>
        </el-table-column>
        <el-table-column label="提现状态" width='100'>
          <template slot-scope="scope">
          <span>{{scope.row.nstatus==0?'未打款':'已打款'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.withdrawTime.time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='100'>
          <template slot-scope="scope">
            <el-button :disabled="scope.row.nstatus==1?true:false" @click="withdrawFinish(scope.row.serialNo,scope.row.userId)" type="text" size="small">打款</el-button>
          </template>
        </el-table-column>
      </el-table>
            <el-pagination layout="prev, pager, next" :total="total" :page-size='20' @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import proddetail from "../proddetail/proddetail.vue";
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {
      orderList: [],
      pageNo: 0,
      total: 100,
      status: 0
    };
  },
  created() {
    this.refreshData(this.status);
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    withdrawFinish(serialNo, userId) {
      var that = this;
      var orderIdList = [
        {
          serialNo: serialNo,
          userId: userId
        }
      ];
      this.$confirm("该操作无法撤销，请确认?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .axios({
              method: "POST",
              url: rootPath + "/cms/trans/confirmWithdraw",
              data: {
                serialNos: orderIdList
              }
            })
            .then(response => {
              if (response.data && response.data.retCode == "00000") {
                that.$message({
                  type: "success",
                  message: "已确认打款!"
                });
                this.refreshData(0);
              } else if (response.data == undefined) {
                that.$message({
                  message: "系统请求发生错误",
                  type: "error"
                });
              } else if (response.data.isSucceed == false) {
                that.$message({
                  message: response.data.returnMessage,
                  type: "error"
                });
              } else {
                that.$message({
                  message: response.data.returnData.bizReturnMessage,
                  type: "error"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    notDelivery() {
      this.status = 0;
      this.refreshData(this.status);
    },
    deliveryed() {
      this.status = 1;

      this.refreshData(this.status);
    },
    lookAll() {
      this.status = -1;
      this.refreshData(this.status);
    },
    handleCurrentChange(val) {
      this.pageNo = val - 1;
      this.refreshData(-1);
    },
    refreshData(type) {
      var that = this;
      this.axios({
        method: "get",
        url: rootPath + "/cms/trans/withdrawOrders",
        params: {
          nstatus: type,
          pageNo: that.pageNo,
          pageSize: 20
        }
      }).then(response => {
        if (response.data) {
          var data = response.data.data;
          that.orderList = data;
          that.total = response.data.count;
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
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: 'Microsoft YaHei';
  font-size: 18px;
}

#page-title {
  margin-bottom: 0;
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

.dkdia .el-dialog--small {
  width: 40%;
}
</style>
