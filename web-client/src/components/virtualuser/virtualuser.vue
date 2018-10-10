<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>创建虚拟会员</span>
      <el-button type="primary" style="margin-right:70px;float:right" @click="add">
        <span style="font-size:15px">创建</span>
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="userid" label="会员ID">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="del(scope.$index,tableData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建虚拟会员" :visible.sync="dialogVisible" :before-close="cancel">
      <el-col :span="20" :offset="3">
        <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="会员用户名" :required="true">
            <el-input type="text" @keyup.native="checkRepeat" v-model="formData.username" autofocus="autofocus" auto-complete="off" style="width:200px;"></el-input>
            <span>{{tip}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="creatUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'
export default {

  data() {
    return {
      formData: {
        username: '',
      },
      tableData: [],
      dialogVisible: false,
      tip: '需要校验重复',
      checkSuccess: '',
    }
  },

  created() {
    this.getVirtualUserList();
  },

  methods: {
    init() {
      this.formData.username = '';
      this.checkSuccess = '';
      this.tip = '需要校验重复';
    },

    checkRepeat() {
      if (this.tableData.length === 0) {
        this.tip = '可用';
        this.checkSuccess = true;
      }
      else if (this.formData.username) {
        for (var i = 0, len = this.tableData.length; i < len; i++) {
          if (this.formData.username === this.tableData[i].username) {
            break;
          }
        }
        if (i === len) {//没找到相同名字的，即不重复
          this.tip = '可用';
          this.checkSuccess = true;
        }
        else {
          this.tip = '已被使用';
          this.checkSuccess = false;
        }
      }
    },
    cancel() {
      this.dialogVisible = false;
      this.formData = {
        username: '',
      };
    },
    creatUser: function() {
      var that = this;
      if (that.checkSuccess) {
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/user/adminregvip',
          params: {
            adminUserId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
            userName: that.formData.username,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: '创建成功',
              type: 'success'
            });
            that.getVirtualUserList();
          }
          else if (response.data == undefined) {
            that.$message({
              message: "系统请求发生错误",
              type: 'error'
            });
          } else if (response.data.isSucceed == false) {
            that.$message({
              message: response.data.returnMessage,
              type: 'error'
            });
          } else {
            that.$message({
              message: response.data.returnData.bizReturnMessage,
              type: 'error'
            });
          }
        });
        that.dialogVisible = false;
        that.init();
      }
      else {
        this.$message({
          message: '用户名不合理',
          type: 'error'
        });
      }
    },
    add() {
      this.dialogVisible = true;
    },
    sortByTime(obj1, obj2) {
      //return obj1.createtime - obj2.createtime;
      return obj2.createtime - obj1.createtime;//why same?
    },

    getVirtualUserList() {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/user/getvirtualuserlist',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.tableData = response.data.returnData.bizReturnData.userlist;
          //that.tableData.sort(that.sortByTime);
        } else if (response.data && response.data.returnData) {
          that.$message({
            message: response.data.returnData.bizReturnMessage,
            type: 'error'
          });
        } else {
          that.$message({
            message: '发生未知错误',
            type: 'error'
          });
        }
        that.registering = false;
      });
      this.init();
    },


    del(index, tableData) {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        virtualUserId: that.tableData[index].userid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/user/deletevirtualuser',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.$message({
            message: '删除成功',
            type: 'success'
          });
          that.getVirtualUserList();
        } else if (response.data && response.data.returnData) {
          that.$message({
            message: response.data.returnData.bizReturnMessage,
            type: 'error'
          });
        } else {
          that.$message({
            message: '发生未知错误',
            type: 'error'
          });
        }
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .page-title {
    border-left 3px solid #699fff;
    text-indent 8px;
    font-family "Microsoft YaHei"
    font-size 18px
  }

  .prods-wrapper {
    float left;
    width: 99%;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 30px;
    border: 1px solid #eee;
    -webkit-border-radius: 4px
    -moz-border-radius: 4px
    border-radius: 4px
    min-height: 30px
  }

  .prodName {
    height: 50px;
    line-height: 50px;
    font-size 24px;
  }

  .prodPrice {
    height: 50px;
    line-height: 50px;
    font-size 24px;
    color: #cc373a;
    span {
      color: #aaa;
      font-size 14px;
      text-decoration: line-through;
    }
  }

  .prodAmount {
    height 30px;
    line-height: 30px;
  }

  .buyform {
    font-style: 14px;
    margin-top: 30px
  }

</style>
