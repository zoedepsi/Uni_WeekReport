<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>充 值</span>
      <el-button type="primary" style="margin-right:70px;float:right" @click="add">
        <span style="font-size:15px">充值</span>
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="rechargetotal" label="充值总额">
      </el-table-column>
      <el-table-column prop="type" label="支付类型">
      </el-table-column>
      <el-table-column prop="rechargeid" label="支付订单号" :min-width="200">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="createtime" label="时间">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
    </el-table>

    <el-dialog title="充值" :visible.sync="dialogVisible">
      <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="充值类型" :required="true">
          <el-select prop="type" v-model="formData.type" placeholder="请选择" style="width:200px;" @change="changePay">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值账户" :required="true">
          <el-input type="text" v-model="formData.paynumber" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :required="true">
          <el-input type="text" v-model="formData.truename" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" :required="true">
          <el-input type="number" v-model="formData.total" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" :required="true">
          <el-input type="textarea" v-model="formData.remark" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <div class="payPic">
          <p>请先选择充值类型，然后扫描二维码支付</p>
          <img :src="payPic" alt='' width="200" height="200">
          <p>请上传充值图片</p>
          <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" action=""
                     :on-change="imgChange">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus" id="avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="charge" :loading="submiting">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'
  export default {

    data() {
      return {
        options: [
          {label: '微信', value: 0},
          {label: '支付宝', value: 1}
        ],
        formData: {
          type: '',
          total: '',
          paynumber: '',
          remark: '',
          imgBase64: '',
          truename: ''
        },
        payPic: 'http://ojsqjl9hp.bkt.clouddn.com/defaultPay.png',
        tableData: [],
        dialogVisible: false,
        imageUrl: '',
        submiting: false,
      }
    },

    created() {
      this.getHistList();
    },

    methods: {

      imgChange(file, filelist) {
        var that = this;
        file = file.raw;
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG 或 PNG格式!');
          return;
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return;
        }
        this.imageUrl = URL.createObjectURL(file);//显示图片
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          //console.log(e.target.result);
          that.formData.imgBase64 = e.target.result;
        }
      },
      charge: function () {
        var that = this,
          _this = this;
        if (!that.imageUrl) {
          that.$message({
            message: "请上传打款截图!",
            type: 'error'
          });
          return;
        }
        that.$refs.form.validate((valid) => {
          if (valid) {
            if (that.formData.type !== 0 && that.formData.type !== 1) {
              that.$message({
                message: "请选择充值类型",
                type: 'error'
              });
              return;
            }
            that.submiting = true;

            var fd = new FormData();
            var img = that.formData.imgBase64.slice(that.formData.imgBase64.indexOf('base64,') + 7)
            var xhr = new XMLHttpRequest();

            fd.append('userId', (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid)
            fd.append('total', that.formData.total)
            fd.append('type', that.formData.type)
            fd.append('paynumber', that.formData.paynumber)
            fd.append('remark', that.formData.remark)
            fd.append('image', img)
            fd.append('truename', that.formData.truename)
            xhr.addEventListener("load", function (e) {
              console.log(e);
              var response = e.target.response;
              if (response.indexOf('"bizIsSucceed":"true"')) {
                that.$message({
                  message: '充值成功',
                  type: 'success'
                });
                that.submiting = false;
                that.dialogVisible = false;
                that.getHistList();
                that.reset();
              } else {
                that.$message({
                  message: '充值失败',
                  type: 'error'
                });
                that.submiting = false;
              }
            }, false);
            xhr.addEventListener("error", function (e) {
              that.$message({
                message: '充值失败',
                type: 'error'
              });
              that.submiting = false;
            }, false);
            xhr.addEventListener("abort", function (e) {
              that.$message({
                message: '充值取消:' + e,
                type: 'error'
              });
            }, false);
            xhr.open("POST", rootPath + '/dbs/recharge/apply');
            xhr.send(fd);
          }
        });
      },
      uploadComplete: function (evt) {
        //alert(evt.target.responseText);
      },
      uploadFailed: function (evt) {
        //alert("There was an error attempting to upload the file.");
      },
      uploadCanceled: function (evt) {
        //alert("The upload has been canceled by the user or the browser dropped the connection.");
      },
      changePay(value) {
        if (value == 0) {
          this.payPic = 'http://ojsqjl9hp.bkt.clouddn.com/wxpay.jpg';
        } else {
          this.payPic = 'http://ojsqjl9hp.bkt.clouddn.com/alipay.jpg';
        }
      },
      reset() {
        this.formData = {
          type: '',
          total: '',
          paynumber: '',
          remark: '',
          imgBase64: '',
          truename: ''
        };
        this.imageUrl = '';
      },
      add() {
        this.dialogVisible = true;
      },

      getHistList() {
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/recharge/getselfrecharge',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            that.tableData = response.data.returnData.bizReturnData.reChargeList;
            for (var i = 0; that.tableData && i < that.tableData.length; i++) {
              switch (that.tableData[i].status) {
                case '0':
                  that.tableData[i].status = '未处理';
                  break;
                case '1':
                  that.tableData[i].status = '已处理';
                  break;
                case '2':
                  that.tableData[i].status = '已拒绝';
                  break;
              }
            }
            for (var i = 0; that.tableData && i < that.tableData.length; i++) {
              switch (that.tableData[i].type) {
                case '0':
                  that.tableData[i].type = '微信';
                  break;
                case '1':
                  that.tableData[i].type = '支付宝';
                  break;
              }
            }
            that.tableData.sort(function (obj1, obj2) {
              var ret = undefined;
              if (obj1.createtime > obj2.createtime)
                ret = -1;
              else if (obj1.createtime < obj2.createtime)
                ret = 1;
              else
                ret = 0;
              return ret;
            });
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
        this.reset();
      },


      cancelGoods(index, tableData) {
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
          withdrawalsId: that.tableData[index].withdrawalsid,
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/withdrawals/cancelwithdrawals',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: '取消成功',
              type: 'success'
            });
            that.getHistList();
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

  .payPic
    display block
    position: absolute
    left 400px
    top 50px
    border 0

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    left: 50px;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  #avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
