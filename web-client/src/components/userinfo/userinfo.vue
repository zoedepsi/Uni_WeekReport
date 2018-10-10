<template>
  <div class="page-wrapper">
    <div class="page-title">我的资料</div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础信息" name="first">
        <div class="prods-wrapper">
          <el-row>
            <el-col :span="6" :offset="1">
              <img src="../../assets/avatar.jpg" width="200" height="200" style="border-radius: 50%; float:right;margin-right: 30px;">
            </el-col>
            <el-col :span="13" :offset="1">
              <el-form ref="formBasic" :model="formBasic" :rules="rulesBasic" label-width="130px">
                <el-form-item label="会员ID">
                  <el-input v-model="formBasic.vipid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="formBasic.username"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="formBasic.phone"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop='truename'>
                  <el-input v-model="formBasic.truename"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                  <el-input v-model="formBasic.idnumber" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="注册时间">
                  <el-input v-model="formBasic.createtime" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="邀请码">
                  <el-input v-model="formBasic.registercode" :readonly="true" :id="'registercode-input'"></el-input>
                  <el-button style="float:left;margin-left: 2px;" @click="copyAppkey">复制</el-button>
                </el-form-item>
                <el-form-item label="微信" prop='weixin'>
                  <el-input v-model="formBasic.weixin"></el-input>
                </el-form-item>
                <el-form-item label="支付宝" prop='alipay'>
                  <el-input v-model="formBasic.alipay"></el-input>
                </el-form-item>
                <el-form-item label="开户行名称" prop='bankname'>
                  <el-input v-model="formBasic.bankname"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop='cardno'>
                  <el-input v-model="formBasic.cardno"></el-input>
                </el-form-item>
                <el-form-item label="邀请人 / 电话" prop='cardno'>
                  <el-input v-model="formBasic.superiorinfo" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native.prevent="updateBasicInfo">　更新　</el-button>
                  <el-button type="normal" @click.native.prevent="addSub">下级注册</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-dialog title="下级注册" :visible.sync="dialogFormVisible">
            <el-form ref="subRegForm" :model="subRegForm" :rules="registerrules" label-width="100px">
              <el-form-item label="注册码" prop="registercode">
                <el-input v-model="subRegForm.registercode" auto-complete="off" placeholder="注册码"
                          type="text" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="subRegForm.userName" auto-complete="off" placeholder="用户名"
                          type="text"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="subRegForm.password" auto-complete="off" placeholder="密码"
                          type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="subRegForm.repassword" auto-complete="off" placeholder="重复密码"
                          type="password"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="subRegForm.phone" auto-complete="off" placeholder="手机号码"
                          type="text"></el-input>
              </el-form-item>
              <el-form-item label="短信验证码" prop="phoneCode">
                <div class="phoneCode">
                  <el-input v-model="subRegForm.phoneCode" auto-complete="off" placeholder="短信验证码"
                            type="text"></el-input>
                  <el-button type="success" @click="getPhoneCode" :disabled="phoneCodeBtn.status">
                    {{phoneCodeBtn.text}}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="真实姓名" prop="trueName">
                <el-input v-model="subRegForm.trueName" auto-complete="off" placeholder="真实姓名"
                          type="text"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idNumber">
                <el-input v-model="subRegForm.idNumber" auto-complete="off" placeholder="身份证号"
                          type="text"></el-input>
              </el-form-item>
              <!--<el-form-item class="formBtnGroup">-->
                <!--<el-button type="success" @click.native.prevent="doregister" :loading="registering">注册</el-button>-->
              <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelRegister">取 消</el-button>
              <el-button type="primary" @click="doRegister">注 册</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="second">
        <el-form class="passForm" ref="formPasswd" :rules="rulesPasswd" :model="formPasswd" label-width="100px">
          <el-form-item label="旧密码" prop="oldPasswd">
            <el-input v-model="formPasswd.oldPasswd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPasswd">
            <el-input v-model="formPasswd.newPasswd"></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="repeatPasswd">
            <el-input v-model="formPasswd.repeatPasswd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePasswd">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'
import proddetail from '../proddetail/proddetail.vue'
var countdown = 60;
export default {
  data() {
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
        if (this.subRegForm.repassword && this.subRegForm.repassword !== '') {
          this.$refs.subRegForm.validateField('repassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.subRegForm.password) {
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
      dialogFormVisible:false,
      activeName: 'first',
      formBasic: {},
      subRegForm: {
        userName: '',
        password: '',
        repassword: '',
        phone: '',
        phoneCode: '',
        trueName: '',
        idNumber: '',
        registercode: '',
        userid:''
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
      },
      rulesBasic: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          //{ type:'number',message:'请输入数字', trigger:'change'}
        ],
        truename: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        weixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        alipay: [
          { required: true, message: '请输入支付宝号', trigger: 'blur' }
        ],
        bankname: [
          { required: true, message: '请输入开户行名称', trigger: 'blur' }
        ],
        cardno: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          //{ type:'number', message:'请输入数字', trigger:'change'}
        ]
      },
      formPasswd: {
        oldPasswd: '',
        newPasswd: '',
        repeatPasswd: ''
      },
      rulesPasswd: {
        oldPasswd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPasswd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        repeatPasswd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          //{validator: checkSame, trigger: 'change'},
          { equalto: "#passwd", message: 'nonono', trigger: 'change' },
        ],
      },
    }
  },
  created(){
    var that = this;
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/user/getuserinfo',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
        vipId:''
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData;
        switch (data.vipgrade) {
          case "1":
            data.vipgrade = "金牌会员"
            break
          case "2":
            data.vipgrade = "银牌会员"
            break
          case "3":
            data.vipgrade = "铜牌会员"
            break
          case "4":
            data.vipgrade = "普通会员"
            break
        }
        data.superiorinfo = data.supertruename + " / "+ data.superphone;
        that.formBasic=data;
      }
      else if (response.data == undefined) {
        this.$message({
          message: "系统请求发生错误",
          type: 'error'
        });
      } else if (response.data.isSucceed == false) {
        this.$message({
          message: response.data.returnMessage,
          type: 'error'
        });
      } else {
        this.$message({
          message: response.data.returnData.bizReturnMessage,
          type: 'error'
        });
      }
    });
  },

  methods: {
    cancelRegister(){
      this.dialogFormVisible = false;
      this.$refs["subRegForm"].resetFields();
    },
    doRegister(){
      this.$refs.subRegForm.validate((valid) => {
        if (valid) {
          var md5 = require('md5');
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/safecode/checkphonecode',
            params: {
              phone: this.subRegForm.phone,
              phoneCode: this.subRegForm.phoneCode
            }
          }).then((response) => {
            if (response.data.returnData.bizIsSucceed) {
              this.axios({
                method: 'post',
                url: rootPath + '/dbs/user/reg',
                params: {
                  userName: this.subRegForm.userName,
                  password: this.subRegForm.password,
                  phone: this.subRegForm.phone,
                  trueName: this.subRegForm.trueName,
                  idNumber: this.subRegForm.idNumber,
                  registercode: this.subRegForm.registercode
                }
              }).then((response) => {
                if (response.data.returnData.bizIsSucceed) {
                  this.$message({
                    message: '下级用户注册成功!',
                    type: 'success'
                  });
                  this.dialogFormVisible = false;
                  this.$refs["subRegForm"].resetFields();
                } else {
                  this.$message({
                    message: response.data.returnData.bizReturnMessage,
                    type: 'error'
                  });
                }
              });
            } else {
              this.$message({
                message: response.data.returnData.bizReturnMessage,
                type: 'error'
              });
            }
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
          phone: that.subRegForm.phone
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
    },
    addSub(){
      this.dialogFormVisible = true;
      this.subRegForm.registercode = this.formBasic.registercode;
    },
    copyAppkey(){
      if (this.formBasic.registercode != null && this.formBasic.registercode !="") {
       if (document.queryCommandSupported("copy")) {
          var registercode_input = document.getElementById("registercode-input").firstChild.nextSibling.nextSibling;
          console.log(registercode_input);
          registercode_input.focus();
          registercode_input.select();
          document.execCommand("copy");
          this.$notify({
            title: '复制成功',
            message: '邀请码已经成功复制至剪贴板。',
            type: 'success'
          });
        } else {
          this.$notify({
            title: '复制失败',
            message: '您的浏览器不支持自动复制，请您手动复制。',
            type: 'error'
          });
       }
      } else {
        this.$notify({
          title: '复制失败',
          message: '邀请码为空，复制失败。',
          type: 'error'
        });
      }
    },
    openProdDetail() {
      this.currentView = proddetail;
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },
    updateBasicInfo() {
      var that = this;
      that.$refs.formBasic.validate((valid) => {
        if (valid) {
          that.axios({
            method: 'post',
            url: rootPath + '/dbs/user/changeuserinfo',
            params: {
              userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
              userName: that.formBasic.username,
              phone: that.formBasic.phone,
              trueName: that.formBasic.truename,
              idNumber: that.formBasic.idnumber,
              weixin: that.formBasic.weixin,
              alipay: that.formBasic.alipay,
              bankname: that.formBasic.bankname,
              cardno: that.formBasic.cardno,
            }
          }).then((response) => {
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '修改成功',
                type: 'success'
              });

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
        }
      })
    },
    updatePasswd() {
      var that = this;
      that.$refs.formPasswd.validate((valid) => {
        if (valid) {
          if (that.formPasswd.newPasswd === that.formPasswd.repeatPasswd) {
            that.axios({
              method: 'post',
              url: rootPath + '/dbs/user/changepassword',
              params: {
                userId: that.formBasic.userid,
                oldPassword:that.formPasswd.oldPasswd,
                password:that.formPasswd.newPasswd,
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.$message({
                  message: '修改成功',
                  type: 'success'
                });
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
          }
        }
        else {
          that.$message({
            message: '两次新密码输入不一致，请重新输入',
            type: 'error'
          });
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

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

  .passForm {
    width: 500px;
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
    clear: both
  }

  .el-form-item__label
    font-size 13px !important
  #registercode-input input
    width:327.5px;
    color #bbb;
    background-color #eef1f6;
    border-color: #d1dbe5;
  #registercode-input
    width 330px;
    float left;
  .phoneCode
    display flex
    flex-direction row
    .el-button
      margin-top 0px
      margin-left 5px
      margin-bottom 0px
</style>
