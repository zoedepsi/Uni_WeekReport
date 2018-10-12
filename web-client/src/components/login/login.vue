<template>
  <el-row class="content">
    <el-col>
      <div class=login_container>
        <el-row class="header_row">
          <el-col>
            <h1 class="htitle">uhome周报管理系统</h1>
          </el-col>
        </el-row>
        <el-row class="login_panel_row vertical">
          <el-col class="login_panel_col">
            <el-tabs class="tabview" v-model="activeTab" @tab-click="tabClick">
              <el-tab-pane label="用户登录" name="login">
                <el-form ref="loginform" :model="loginform" :rules="loginrules" label-width="100px">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginform.username" auto-complete="off" placeholder="账号" type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input v-model="loginform.password" auto-complete="off" placeholder="密码" type="password" @keyup.enter.native="dologin"></el-input>
                  </el-form-item>
                  <!--<el-checkbox class="remember">记住密码</el-checkbox>-->
                  <el-form-item class="formBtnGroup">
                    <!-- <router-link to="/register">
                      <el-button :plain="true" type="primary">去注册</el-button>
                    </router-link> -->
                    <el-button class="btnpuprle" type="primary" @click.native.prevent="dologin" :loading="logining">登录</el-button>
                  </el-form-item>
                  <!-- <span id="find"><router-link to="/find">忘记密码？</router-link></span> -->
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row class="footer_row">
          <el-col>
            版权所有 codingBoys
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {
      activeTab: "login",
      logining: false,
      loginform: {
        username: this.$route.query.tel || "",
        password: ""
      },
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checked: true
      }
    };
  },
  watch: {},
  methods: {
    tabClick(ll) {
      console.log(ll);
    },
    dologin() {
      this.$refs.loginform.validate(valid => {
        if (valid) {
          this.logining = true;
          this.axios({
            method: "post",
            url: rootPath + "/weekly/login",
            params: {
              username: this.loginform.username,
              password: this.loginform.password
            }
          }).then(response => {
            if (response.data.code == "00000") {
              var data=response.data.data[0];
              window.sessionStorage.setItem('userId',data.id);
              window.sessionStorage.setItem('trueName',data.truename);
              window.sessionStorage.setItem('roleId',data.roleId);
              this.$router.push({ path: "/admin-main" });
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
            this.logining = false;
          });
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-button--primary:hover {
  background-color: #C35894;
  border-color: #C35894;
}

.btnpuprle {
  background-color: #005CAF;
  border-color: #005CAF;
}

.el-row.content {
  position: fixed;
  background: url('../../assets/login_index.jpg') center no-repeat fixed;
  background-size: cover;
  overflow-y: auto;
}

.login_container {
  position: relative;
  min-height: 470px;
  height: 100vh;
}

.index_logo {
  display: inline-block;
  margin-top: 20px;
  height: 100px;
  width: 360px;
  // background: url(../../assets/qs_indexlogo1.png) no-repeat;
  background-size: contain;
}

.remember {
  margin-left: 100px;
  margin-right: 150px;
}

.el-button {
  width: 25%;
  float: right;
  margin: 15px 0 0px 15px;
}

#find {
  float: right;
  margin-right: 10px;
  font-size: 13px;
  color: #5e7382;
}

.login_panel_row {
  height: 64vh;
  width: 100%;
  display: flex;
}

.login_panel_col {
  width: 666px;
  margin: auto;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #eaeefb;
  box-shadow: 0 0 25px #767676;
  -webkit-box-shadow: 0 0 25px #767676;
  box-sizing: border-box;
}

.footer_row {
  font-size: 0.875rem;
  line-height: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 5.5vh 0;
  text-align: center;
  color: #aaa;
}

.vertical {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-grid-row-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.formBtnGroup {
  width: 100%;
}
.htitle{
  font-size 50px;
  text-align center;
  margin-top 80px;
}
</style>
