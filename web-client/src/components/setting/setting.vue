<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="5">
        <div class="page-title" id="vip-title">个人设置</div>
      </el-col>
      <el-col :span="18">
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-tabs style="width:50%;margin:20px auto;" type="border-card">
        <el-tab-pane label="基本信息">
          <el-form style="width:50%;" ref="basicInfo" :model="basicInfo" label-width="80px">
            <el-form-item label="真实姓名">
              <el-input v-model="basicInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="basicInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitBasic">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码修改">
          <el-form style="width:50%;" ref="passInfo" :model="passInfo" label-width="100px">
            <el-form-item label="旧密码">
              <el-input v-model="passInfo.oldPass" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passInfo.newPass" type="password"></el-input>
            </el-form-item>
                       <el-form-item label="确认新密码">
              <el-input v-model="passInfo.againPass" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitPassword">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="角色管理" disabled>角色管理</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import Vue from "vue";
import { rootPath } from "../../config/apiConfig";
var trueName = sessionStorage.getItem("trueName");
var email = sessionStorage.getItem("email");
export default {
  data() {
    return {
      basicInfo: {
        name: trueName,
        email: email
      },
      passInfo:{
        oldPass:'',
        newPass:'',
        againPass:''
      }
    };
  },
  mounted() {},
  methods: {
    formatDate: function(date) {
      return (
        new Date(date).toLocaleDateString() +
        " " +
        new Date(date).toTimeString().slice(0, 8)
      );
    },
    onSubmitBasic() {
      var that = this;
      this.axios({
        method: "post",
        url: rootPath + "/weeklyserver/user/updateUserInfo",
        params: {
          truename: that.basicInfo.name,
          email: that.basicInfo.email,
          id: sessionStorage.getItem("userId")
        }
      }).then(response => {
        if (response.data.code == "00000") {
          this.$message({
            message: "更新成功",
            type: "success"
          });
          sessionStorage.setItem("trueName", that.basicInfo.name);
          sessionStorage.setItem("email", that.basicInfo.email);
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
    onSubmitPassword(){
      var that = this;
      if(that.passInfo.newPass!=that.passInfo.againPass){
         that.$message({
            message: "两次密码输入不一致",
            type: "warning"
          });
          return;
      }
      this.axios({
        method: "post",
        url: rootPath + "/weeklyserver/user/updatePassword",
        params: {
          newPass: that.passInfo.newPass,
          id: sessionStorage.getItem("userId"),
          oldPass:that.passInfo.oldPass
        }
      }).then(response => {
        if (response.data.code == "00000") {
          this.$message({
            message: "更新成功",
            type: "success"
          });
          that.passInfo={

          }
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
    }
  }
};
</script>

<style scoped>
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: "Microsoft YaHei";
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
  margin-top: 20px;
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
  clear: both;
}

.detail_dialog {
  height: 400px;
  overflow-y: scroll;
}

.discussList p {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #ccc;
  margin: 5px 0;
}

.discussList .item {
  margin: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
</style>
