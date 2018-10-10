<template>
  <el-row class="content">
    <el-col>
      <div class=register_container>
        <el-row class="header_row">
          <el-col>
            <a href="#">
              <span class="index_logo"></span>
            </a>
          </el-col>
        </el-row>
        <el-row class="register_panel_row vertical">
          <el-col class="register_panel_col">
            <el-tabs class="tabview" v-model="activeTab">
              <el-tab-pane label="用户注册" name="register">
                <el-form ref="registerform" :model="registerform" :rules="registerrules" label-width="100px">
                  <el-form-item label="用户名" prop="userName">
                    <el-input v-model="registerform.userName" auto-complete="off" placeholder="用户名"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input v-model="registerform.password" auto-complete="off" placeholder="密码"
                              type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="repassword">
                    <el-input v-model="registerform.repassword" auto-complete="off" placeholder="重复密码"
                              type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="registerform.phone" auto-complete="off" placeholder="手机号码"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="短信验证码" prop="phoneCode">
                    <div class="phoneCode">
                      <el-input v-model="registerform.phoneCode" auto-complete="off" placeholder="短信验证码"
                                type="text"></el-input>
                      <el-button type="success" @click="getPhoneCode" :disabled="phoneCodeBtn.status">
                        {{phoneCodeBtn.text}}
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="真实姓名" prop="trueName">
                    <el-input v-model="registerform.trueName" auto-complete="off" placeholder="真实姓名"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号" prop="idNumber">
                    <el-input v-model="registerform.idNumber" auto-complete="off" placeholder="身份证号"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="注册码" prop="registercode">
                    <el-input v-model="registerform.registercode" auto-complete="off" placeholder="注册码"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item class="formBtnGroup">
                    <router-link to="/login">
                      <el-button :plain="true" type="success" to="/find">已注册，去登录</el-button>
                    </router-link>
                    <el-button type="success" @click.native.prevent="doregister" :loading="registering">注册</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row class="footer_row">
          <el-col>
            版权所有 © 2017 金夫人 鲁ICP备0000000号




          </el-col>
        </el-row>
      </div>

    </el-col>
  </el-row>
</template>
<script>
  import {rootPath} from '../../config/apiConfig'
  var countdown = 60;
  export default {
    data () {
      //自定义验证
      var validateTelephone = (rule, value, callback) => {
        var telephoneRegx = new RegExp("^1[3|4|5|7|8]{1}[0-9]{9}$");
        if (!telephoneRegx.test(value)) {
          callback(new Error('请输入有效的手机号'));
        } else {
          callback();
        }
      };
      var validateUserCode = (rule, value, callback) => {
        var num_wordRegx = new RegExp("^[a-zA-Z0-9_]+$");
        var purenumRegx = new RegExp("^[0-9]*$");
        if (!num_wordRegx.test(value)) {
          callback(new Error('账号仅允许包含数字字母及下划线'));
        } else if (purenumRegx.test(value)) {
          callback(new Error('账号不能为纯数字'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerform.repassword && this.registerform.repassword !== '') {
            this.$refs.registerform.validateField('repassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.registerform.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateIdNumber = (rule, value, callback) => {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(value) === false) {
          callback(new Error('请输入有效的18位身份证号!'));
        } else {
          callback();
        }
      };
      return {
        activeTab: 'register',
        registering: false,
        registerform: {
          userName: '',
          password: '',
          repassword: '',
          phone: '',
          phoneCode: '',
          trueName: '',
          idNumber: '',
          registercode: ''
        },
        phoneCodeBtn: {
          text: '获取验证码',
          status: false
        },

        registerrules: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: validateTelephone, trigger: 'blur'}
          ],
          phoneCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
//          usercode:[
//            { required: true, message: '请输入账号', trigger: 'blur' },
//            { min:6,max:20, message: '账号长度应为6-20字符', trigger: 'blur' },
//            { validator: validateUserCode, trigger: 'blur'}
//          ],
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 20, message: '用户名长度应为2-20字符', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          repassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          trueName: [
            {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
            {min: 2, max: 5, message: '真实姓名长度应为2-5字符', trigger: 'blur'}
          ],
          idNumber: [
            {required: true, message: '请输入您的身份证号', trigger: 'blur'},
            {validator: validateIdNumber, trigger: 'blur'}
          ],
          registercode: [
            {required: true, message: '请输入您的注册码', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {},
    methods: {
      doregister() {
        this.$refs.registerform.validate((valid) => {
          if (valid) {
            this.registering = true;
            var md5 = require('md5');
            this.axios({
              method: 'post',
              url: rootPath + '/dbs/safecode/checkphonecode',
              params: {
                phone: this.registerform.phone,
                phoneCode: this.registerform.phoneCode
              }
            }).then((response) => {
              if (response.data.returnData.bizIsSucceed) {
                this.axios({
                  method: 'post',
                  url: rootPath + '/dbs/user/reg',
                  params: {
                    userName: this.registerform.userName,
                    password: this.registerform.password,
                    phone: this.registerform.phone,
                    trueName: this.registerform.trueName,
                    idNumber: this.registerform.idNumber,
                    registercode: this.registerform.registercode
                  }
                }).then((response) => {
                  if (response.data.returnData.bizIsSucceed) {
                    this.$message({
                      message: '注册成功,请登录!',
                      type: 'success'
                    });
                    this.$router.push({path: '/login', query: {tel: this.registerform.telephone}})
                  } else {
                    this.$message({
                      message: response.data.returnData.bizReturnMessage,
                      type: 'error'
                    });
                  }
                  this.registering = false;
                });
              } else {
                this.$message({
                  message: response.data.returnData.bizReturnMessage,
                  type: 'error'
                });
              }
              this.registering = false;
            });

          }
        })
      },
      getPhoneCode(){
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/safecode/getphonecode',
          params: {
            phone: this.registerform.phone
          }
        }).then((response) => {
          if (response.data.returnData.bizIsSucceed) {
            var int=window.setInterval(function () {
              if (countdown == 0) {
                that.phoneCodeBtn.status = false;
                that.phoneCodeBtn.text = '获取验证码';
                countdown = 60;
                window.clearInterval(int);
              } else {
                that.phoneCodeBtn.status = true;
                that.phoneCodeBtn.text = '重新获取(' + countdown + ')';
                countdown--;
              }
            }, 1000)
          } else {
            this.$message({
              message: response.data.returnData.bizReturnMessage,
              type: 'error'
            });
          }
        });
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .el-row.content
    position fixed
    background: url(../../assets/login_index.jpg) center no-repeat fixed;
    background-size: cover;
    overflow-y auto

  .register_container
    position relative
    min-height 850px
    height 100vh

  .index_logo
    display: inline-block;
    margin-top: 20px;
    height: 100px;
    width: 360px
    background: url(../../assets/qs_indexlogo1.png) no-repeat;
    background-size contain

  .remember
    margin-left 100px
    margin-right 150px

  .el-button
    width 25%
    float right
    margin 15px 0 15px 15px

  #find
    float right
    margin-right 10px
    font-size 13px
    color #5e7382

  .register_panel_row
    height 64vh
    width 100%
    display flex

  .register_panel_col
    /*position: relative;*/
    width: 685px;
    margin: auto;
    padding: 16px;
    background #fff
    border-radius 4px
    border 1px solid #eaeefb;
    box-shadow: 0 0 25px #767676;
    -webkit-box-shadow: 0 0 25px #767676;
    box-sizing: border-box;

  .footer_row
    font-size: .875rem;
    line-height: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 5.5vh 0;
    text-align: center;
    color: #aaa;

  .vertical
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-grid-row-align: center;
    -ms-flex-align: center;
    align-items: center;

  .formBtnGroup
    width 100%

  .phoneCode
    display flex
    flex-direction row
    .el-button
      margin-top 0px
      margin-bottom 0px

</style>
