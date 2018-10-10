<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="5">
        <div class="page-title" id="vip-title">会员管理</div>
      </el-col>
      <el-col :span="18">
        <!-- <el-button type="primary" style="float:right;margin-right:10px" @click="lookVip">所有会员</el-button> -->
        <el-select @change="changeView" v-model="value" placeholder="请选择会员等级" style="float:right;margin-right:10px">
          <el-option label="普通游客" :value="0"></el-option>
          <el-option label="创业会员" :value="1"></el-option>
          <el-option label="官方经理" :value="2"></el-option>
          <el-option label="梦想合伙人" :value="3"></el-option>
          <el-option label="联合创始人" :value="4"></el-option>
        </el-select>
        <el-button type="primary" style="float:right;margin-right:10px" @click="searchNickName">搜索</el-button>
        <el-input id='searchNickName' v-model="nickName" placeholder="输入会员昵称关键字"></el-input>

        <el-button type="primary" style="float:right;margin-right:10px" @click="lookAll">查看全部</el-button>
        <el-button type="primary" style="float:right;margin-right:10px" @click="lookEmploy">只看员工</el-button>
      </el-col>

    </el-row>
    <div class="bills-wrapper">
      <el-table :data="tableDatas" stripe style="width: 100%;">
        <el-table-column prop="id" label="用户ID" width="80">
        </el-table-column>
        <el-table-column label="头像" width="50">
          <template slot-scope="scope">
            <img :src="scope.row.wechat_headimg_url" width="30px" height="30px" alt="" srcset="">
          </template>
        </el-table-column>

        <el-table-column prop="wechat_nick_name" label="微信昵称" width="150">
        </el-table-column>
        <el-table-column prop="user_level_name" label="会员等级" width="100">
        </el-table-column>
        <el-table-column label="员工" width="50">
          <template slot-scope="scope">
            <span>{{scope.row.is_employee==0?"否":"是"}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="性别" width="50">
          <template slot-scope="scope">
            <span>{{scope.row.wechat_sex==1?"男":"女"}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="wechat_province" label="省份" width="100">
        </el-table-column> -->
        <el-table-column label="上级用户" prop="chiefUserNickname">
        </el-table-column>
        <el-table-column label="上上级用户" prop="superChiefUserNickname">

        </el-table-column>
        <el-table-column label="加入时间" width="180">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.create_time.time?scope.row.create_time.time:scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="status" width="250">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.is_employee==0?false:true" type="text" size="small" @click="setEmployee(scope.row.id)">设为员工</el-button>
            <el-button :disabled="scope.row.is_employee==0?true:false" type="text" size="small" @click="setNoEmployee(scope.row.id)">删除员工</el-button>
            <el-button type="text" size="small" @click="setChiefUserDia(scope.row.id)">修改上级</el-button>
          </template>
        </el-table-column>
      </el-table>
            <el-pagination layout="prev, pager, next" :total="total" :page-size='pageSize' @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <el-input style="width:200px" v-model="chiefUserId" type='number' placeholder="请输入上级用户ID"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setChiefUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type='text/ecmascript-6'>
import Vue from "vue";
import { rootPath } from "../../config/apiConfig";
import Tree from "../tree/tree.vue";
export default {
  data() {
    return {
      tableDatas: [],
      tableData: [],
      tableDataEm: [],
      tableDataVip: [],
      value: "",
      temId: "",
      dialogVisible: false,
      chiefUserId: "",
      total: 100,
      pageNo: 0,
      nickName: "",
      temTotal: 0,
      userLevel: -1,

      pageSize: 20
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    getNickName(id) {
      var arr = this.tableData.filter(function(element) {
        return element.id == id;
      });
      if (arr.length > 0) {
        return arr[0].wechat_nick_name;
      } else {
        return "无";
      }
    },
    handleCurrentChange(val) {
      this.pageNo = val - 1;
      this.refreshData();
    },
    lookEmploy() {
      this.total = this.tableDataEm.length;
      this.tableDatas = this.tableDataEm;
    },
    lookAll() {
      this.userLevel = -1;
      this.refreshData();
    },
    searchNickName() {
      var that = this;
      that
        .axios({
          method: "GET",
          url: rootPath + "/cms/user/queryByNickname",
          params: {
            nickname: that.nickName,
            pageNo: that.pageNo,
            pageSize: 1000
          }
        })
        .then(response => {
          if (response.data && response.data.retCode == "00000") {
            that.tableDatas = response.data.data;
            that.pageSize=1000;
            that.total = response.data.count;
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
    },
    changeView() {
      switch (this.value) {
        case 0:
          this.userLevel = 0;
          this.refreshData();
          break;
        case 1:
          this.userLevel = 1;
          this.refreshData();
          break;
        case 2:
          this.userLevel = 2;
          this.refreshData();
          break;
        case 3:
          this.userLevel = 3;
          this.refreshData();
          break;
        case 4:
          this.userLevel = 4;
          this.refreshData();
          break;

        default:
          break;
      }
    },
    formatDate: function(date) {
      return (
        new Date(date).toLocaleDateString() +
        " " +
        new Date(date).toTimeString().slice(0, 8)
      );
    },
    setChiefUserDia(id) {
      this.temId = id;
      this.dialogVisible = true;
    },
    setEmployee(id) {
      var that = this;
      var orderIdList = [
        {
          id: id.toString(),
          isEmployee: "1"
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
              url: rootPath + "/cms/setEmployee",
              data: {
                employees: orderIdList
              }
            })
            .then(response => {
              if (response.data && response.data.retCode == "00000") {
                that.$message({
                  type: "success",
                  message: "已设置!"
                });
                this.refreshData();
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
    setNoEmployee(id) {
      var that = this;
      var orderIdList = [
        {
          id: id.toString(),
          isEmployee: "0"
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
              url: rootPath + "/cms/setEmployee",
              data: {
                employees: orderIdList
              }
            })
            .then(response => {
              if (response.data && response.data.retCode == "00000") {
                that.$message({
                  type: "success",
                  message: "已设置!"
                });
                this.refreshData();
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
    setChiefUser() {
      var that = this;
      that
        .axios({
          method: "POST",
          url: rootPath + "/cms/user/editChief",
          data: {
            id: that.temId.toString(),
            chiefUserId: that.chiefUserId
          }
        })
        .then(response => {
          if (response.data && response.data.retCode == "00000") {
            that.$message({
              type: "success",
              message: "已设置!"
            });
            that.dialogVisible = false;
            that.refreshData();
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
    },
    refreshData() {
      var that = this;
      this.axios({
        method: "get",
        url: rootPath + "/cms/dataPool",
        params: {
          pageNo: that.pageNo,
          pageSize: 20,
          userLevel: that.userLevel
        }
      }).then(response => {
        if (response.data && response.data.retCode == "00000") {
          var data = response.data.allWechatUsers;
          that.total = response.data.userCount;
          that.pageSize=20;
          that.tableDatas = that.tableData = data;
          that.tableDataEm = this.tableData.filter(function(element) {
            return element.is_employee == 1;
          });
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: 'Microsoft YaHei';
  font-size: 18px;
  margin-top: 9px;
}

.el-dialog--small {
  width: 400px !important;
}

#vip-title {
  margin-bottom: 0;
}

.bills-wrapper {
  float: left;
  width: 99%;
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

#searchNickName {
  width: 200px;
  float: right;
  margin-right: 10px;
}
</style>
