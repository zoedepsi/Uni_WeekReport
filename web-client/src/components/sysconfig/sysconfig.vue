<template>
  <div class="page-wrapper">
    <div class="page-title">系统配置</div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础配置" name="first">
        <div class="prods-wrapper">
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form ref="formConfig" :model="formConfig" :rules="rulesConfig" label-width="190px">
                <el-form-item label="订单处理超时冻结时间" prop="freezetime">
                  <el-input v-model="formConfig.freezetime">
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="会员购买产品价格" prop="price">
                  <el-input v-model="formConfig.price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="是否允许注册为·公司会员" prop="allowVip">
                  <el-switch v-model="formConfig.allowVip" on-color="#13ce66" off-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native.prevent="saveSysConfig"> 保 存 </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'

export default {
  data() {
    var checkHour = (rule, value, callback) => {
      var purenumRegx = new RegExp("^[0-9]*$");
      if (!value) {
        callback(new Error('订单处理超时不能为空'));
      }
      else if (!purenumRegx.test(value)) {
        callback(new Error('订单处理超时时间应为整数值'));
      } else if (value <= 0) {
        callback(new Error('订单处理超时时间必须大于0'));
      } else {
        callback();
      }
    };
    return {

      activeName: 'first',
      formConfig: {
        freezetime: '0',
        price: 0,
        allowVip: '',
      },
      rulesConfig: {
        freezetime: [
          { validator: checkHour, trigger: 'blur' }
        ],
      }
    }

  },
  created() {
    var that = this;
    that.axios({
      method: 'post',
      url: rootPath + '/dbs/user/getsystemconfig',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var configList = response.data.returnData.bizReturnData.systemConfiglist;
        for (var i in configList) {
          console.log(configList[i])
          if (configList[i].configname === "freezetime") {
            that.formConfig.freezetime = configList[i].configvalue;
          }
          else if (configList[i].configname === "allowVip") {
            that.formConfig.allowVip = (configList[i].configvalue==='true');
          }
        }
      }
      else {
        that.$message({
          message: "系统请求发生错误",
          type: 'error'
        });
      }
    })

    that.axios({
      method: 'post',
      url: rootPath + '/dbs/user/getproductprice',
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData;
        that.formConfig.price = data.price;
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
    })
  },
  mounted: function() {

  },

  methods: {
    saveSysConfig() {
      var that = this;
      var configList = [
        { configname: "freezetime", configvalue: that.formConfig.freezetime },
        { configname: "allowVip", configvalue: String(that.formConfig.allowVip) },
      ];
      that.$refs.formConfig.validate((valid) => {
        if (valid) {
          that.axios({
            method: 'post',
            url: rootPath + '/dbs/user/setsystemconfig',
            params: {
              userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
              configlist: JSON.stringify(configList)
            }
          }).then((response) => {
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '修改成功',
                type: 'success'
              });
            }
            else {
              that.$message({
                message: "系统请求发生错误",
                type: 'error'
              });
            }
          });
          that.axios({
            method: 'post',
            url: rootPath + '/dbs/user/changeproductprice',
            params: {
              price: that.formConfig.price
            }
          }).then((response) => {
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              this.$message({
                message: "设置成功",
                type: 'success'
              });
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
          })

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

</style>
