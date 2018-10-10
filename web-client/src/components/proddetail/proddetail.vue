<template>
  <div class="page-wrapper">
    <div class="page-title">商品购买</div>
    <div class="prods-wrapper">
      <el-row>
        <el-col :span="11" :offset="1">
          <img src="../../assets/chongdian.jpg" style="width:350px;border:1px solid #ccc;">
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form ref="buyform" :model="buyform" class="buyform">
          <div class="prodName">精品莜麦糊</div>
          <el-form-item label="会员价" :style="'margin-bottom:0px'">
            <span style="font-size:24px;color: #cc373a;">¥ {{price}} </span>
            <span style=" color: #bbb;text-decoration: line-through;">(原价：¥{{originprice}})</span>
          </el-form-item>
          <div class="prodAmount" style="margin:10px 0">商品库存充足</div>
            <el-form-item label="购买数量" prop="count">
              <el-input-number v-model="buyform.count" :disabled="true"></el-input-number>
            </el-form-item>
            <el-form-item label="是否发货">
              <el-radio-group v-model="radio">
                <el-radio :label="0">无需发货</el-radio>
                <el-radio :label="1">需要发货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="购买总价">
              <span style="font-size:24px;color: #cc373a;">¥{{price * buyform.count}}</span>
            </el-form-item>
            <el-form-item :style="addressBtnStyle">
              <el-table :data="addressTableData" border style="width: 600px">
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
                <el-table-column :width="100" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="deleteAddress(scope.$index,addressTableData)" type="text" size="small">删除
                    </el-button>
                    <el-button type="text" size="small" @click="editAddress(scope.$index,addressTableData)">编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="large" @click="addAddress">添加收货地址</el-button>
            </el-form-item>
            <el-form-item class="formBtnGroup">
              <el-button type="primary" size="large" style="width:150px;height:50px;margin-top: 30px;" @click="apply">
                发起购买
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <el-form :model="shouhuo" label-width="100px">
        <el-form-item label="收货人姓名">
          <el-input v-model="shouhuo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="shouhuo.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="shouhuo.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发货数量">
          <el-input-number v-model="shouhuo.num" :min="1" :max="limit"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddress">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="充值" :visible.sync="chargeDialogVisible">
      <el-alert
        :title="'抱歉，由于您的余额不足以完成此次购买，请须充值 ¥'+differtotal+'元 方可进行此次购买！'"
        type="warning"
        show-icon
        style="margin-bottom:10px">
      </el-alert>
      <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="充值金额" :required="true">
            <el-input type="number" v-model="formData.total" auto-complete="off" style="width:200px;" :disabled="true"></el-input>
          </el-form-item>
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

          <el-form-item label="备注" :required="true">
            <el-input type="textarea" v-model="formData.remark" auto-complete="off" style="width:200px;" :rows="3"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <p>请先选择充值类型，然后扫描二维码支付</p>
            <img :src="payPic" alt='' width="180" height="180" style="margin:0 auto">
            <p>请上传充值图片</p>
            <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" a action="" :on-success="handleAvatarSuccess" :on-change="imgChange">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus" id="avatar-uploader-icon"></i>
            </el-upload>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rechargeandsponser">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'
  export default {

    data() {
      return {
        needGoods: false,//该变量用来标记最后提交购买的时候，是发货还是不发货
        needGoodsCount: 0,
        isFromEdit: false,//进入对话框，有两种方式，添加地址和编辑地址
        curRow: 0,
        limit: 0,//当前剩下的最大上限数目
        price: 0,
        originprice:0,
        buyform: {
          count: 0,
        },
        radio: 0,
        addressBtnStyle: {
          display: "none"
        },
        dialogTableVisible: false,
        shouhuo: {
          name: '',
          phone: '',
          address: '',
          num: 1
        },
        addressTableData: [],
        differtotal:0,

        //充值相关
        chargeDialogVisible:false,
        formData:{
          type: '',
          total: '',
          paynumber: '',
          remark: '',
          imgBase64: '',
          truename: ''
        },
        options: [
          { label: '微信', value: 0 },
          { label: '支付宝', value: 1 }
        ],
        payPic: 'http://ojsqjl9hp.bkt.clouddn.com/defaultPay.png',
        imageUrl: '',
      }
    },
    created(){
      this.buyform.count = Math.pow(2,(4 - parseInt(JSON.parse(window.sessionStorage.getItem("userInfo")).vipgrade)))*5;
      this.limit = this.buyform.count;
      var that = this;
      //获取商品原始价格
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/user/getproductprice',
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData;
          that.originprice = data.price;

          var vipgrade = JSON.parse(window.sessionStorage.getItem("userInfo")).vipgrade;
          switch (parseInt(vipgrade)) {
            case 4:
              that.price = that.originprice;
              break;
            case 3:
              that.price = that.originprice *0.7;
              break;
            case 2:
              that.price = that.originprice *0.6;
              break;
            case 1:
              that.price = that.originprice *0.5;
              break;
            default:
              that.price = that.originprice *1;
              break;
          }
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
    watch: {
      radio: function (val) {
        if (val == '0') {
          this.addressBtnStyle.display = 'none';
          this.needGoods = false;
        } else {
          this.addressBtnStyle.display = 'block';
          this.needGoods = true;
        }
      },
    },
    methods: {
      changeView(id){
        this.$emit('changeCurrentView', "v-"+id);
      },
      closeDialog() {
        this.dialogTableVisible = false;
      },
      addAddress() {
        /* 如果购买数目不足1个，则不再弹出添加地址的对话框，而是提示用户购买数目达到上限 */
        if (this.limit < 1) {
          this.$message({
            message: '购买数目已达到最大值！',
            type: 'warning'
          });
          return;
        }
        this.dialogTableVisible = true;
      },
      deleteAddress(index, row) {
        this.limit += row[index].num;
        this.needGoodsCount -= row[index].num;
        this.addressTableData.splice(index, 1);
      },
      editAddress(index, addrTabData) {
        this.shouhuo.name = addrTabData[index].name;
        this.shouhuo.phone = addrTabData[index].phone;
        this.shouhuo.addAddress = addrTabData[index].addAddress;
        this.shouhuo.num = addrTabData[index].num;
        this.limit += this.shouhuo.num;
        this.isFromEdit = true;
        this.curRow = index;
        this.dialogTableVisible = true;
      },
      saveAddress() {
        /*
         需要发货的话，最后的数量应该是添加的所有地址里的货物数量之和，
         否则，应该是服务器返回的this.buyform.count;每添加一个地址，就
         统计其数量，并计算还剩余多少可以购买
         */
        if (this.isFromEdit) {
          this.needGoodsCount -= this.addressTableData[this.curRow].num - this.shouhuo.num;
          this.limit = this.buyform.count - this.needGoodsCount;
          this.addressTableData[this.curRow].name = this.shouhuo.name;
          this.addressTableData[this.curRow].phone = this.shouhuo.phone;
          this.addressTableData[this.curRow].address = this.shouhuo.address;
          this.addressTableData[this.curRow].num = this.shouhuo.num;
        }
        else {
          this.needGoodsCount += this.shouhuo.num;
          this.limit = this.buyform.count - this.needGoodsCount;
          this.addressTableData.push(this.shouhuo);
          this.shouhuo = {
            name: '',
            phone: '',
            address: '',
            num: 1
          };
        }
        this.isFromEdit = false;
        this.dialogTableVisible = false;
              },
      apply() {
        var that = this;

        this.$confirm('将从余额扣除' + this.price * this.buyform.count+ '元，是否确认购买？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
            count: this.needGoods ? this.needGoodsCount : this.buyform.count,//count取决于是不是要发货，如果发货，则之和
            productId: 1,
            address: JSON.stringify(this.addressTableData),
            ifspotgoods: this.radio
          }
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/applybuy/sponsor',
            params: params
          }).then((response) => {
            if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              this.$message({
                message: '商品购买成功！请等待上级处理。',
                type: 'success'
              });
              this.changeView("applyresult");
            } else if (response.data && response.data.returnData) {
              if(response.data.returnData.bizReturnCode == "MNS-00010"){
                this.chargeDialogVisible = true;
                this.differtotal = response.data.returnData.bizReturnData.differtotal;
                this.formData.total = this.differtotal;
              }else{
                this.$message({
                  message: response.data.returnData.bizReturnMessage,
                  type: 'error'
                });
              }

            } else {
              this.$message({
                message: '发生未知错误',
                type: 'error'
              });
            }
            this.registering = false;
          });
          this.addressTableData = [];//购买完成后，清空
          this.needGoods = false;
          this.needGoodsCount = 0;
          this.isFromEdit = false;
          this.limit = this.buyform.count;
        }).catch(() => { //此部分内容需要填写到充值中

        });
      },
      changePay(value) {
        if (value == 0) {
          this.payPic = 'http://ojsqjl9hp.bkt.clouddn.com/wxpay.jpg';
        } else {
          this.payPic = 'http://ojsqjl9hp.bkt.clouddn.com/alipay.jpg';
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      imgChange(file, filelist) {
        var that = this;
        file = file.raw;
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          return;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return;
        }
        this.imageUrl = URL.createObjectURL(file);//显示图片
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          //console.log(e.target.result);
          that.formData.imgBase64 = e.target.result;
        }
      },
      charge: function() {

      },
      uploadComplete: function(evt) {
        //alert(evt.target.responseText);
      },
      uploadFailed: function(evt) {
        //alert("There was an error attempting to upload the file.");
      },
      uploadCanceled: function(evt) {
        //alert("The upload has been canceled by the user or the browser dropped the connection.");
      },
      rechargeandsponser(){
        var that = this,
          _this = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            if (that.formData.type !== 0 && that.formData.type !== 1) {
              that.$message({
                message: "请选择充值类型",
                type: 'error'
              });
              return;
            }
            var fd = new FormData();
            var img = that.formData.imgBase64.slice(that.formData.imgBase64.indexOf('base64,') + 7)
            var xhr = new XMLHttpRequest();

            fd.append('userId', (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid)
            fd.append('rechartype', that.formData.type)
            fd.append('paynumber', that.formData.paynumber)
            fd.append('remark', that.formData.remark)
            fd.append('image', img)
            fd.append('truename', that.formData.truename)
            fd.append('count', this.needGoods ? this.needGoodsCount : this.buyform.count)
            fd.append('productId', "1")
            fd.append('address',JSON.stringify(this.addressTableData))
            fd.append('ifspotgoods', this.radio)
            fd.append('deductTotal', that.price *that.buyform.count - that.differtotal)
            fd.append('reChargeTotal', that.formData.total)
            xhr.addEventListener("load", function(e) {
              console.log(e);
              var response = e.target.response;
              if (response.indexOf('"bizIsSucceed":"true"')) {
                that.$message({
                  message: '充值成功',
                  type: 'success'
                });
                that.getHistList();
              } else {
                that.$message({
                  message: '充值失败',
                  type: 'error'
                });
              }
            }, false);
            xhr.addEventListener("error", function(e) {
              that.$message({
                message: '图片上传失败:' + e,
                type: 'error'
              });
            }, false);
            xhr.addEventListener("abort", function(e) {
              that.$message({
                message: '图片上传取消:' + e,
                type: 'error'
              });
            }, false);
            xhr.open("POST", rootPath + '/dbs/applybuy/rechargeandsponsor');
            xhr.send(fd);
            this.changeView("applyresult");
          }
        });

//        //
//        var that = this;
//        var params = {
//
//        }
//        this.axios({
//          method: 'post',
//          url: rootPath + '/dbs/applybuy/rechargeandsponser',
//          params: params
//        }).then((response) => {
//          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
//            this.$message({
//              message: '商品购买成功！请等待上级处理。',
//              type: 'success'
//            });
//            this.changeView("applyresult");
//          } else if (response.data && response.data.returnData) {
//            this.$message({
//              message: response.data.returnData.bizReturnMessage,
//              type: 'error'
//            });
//          } else {
//            this.$message({
//              message: '发生未知错误',
//              type: 'error'
//            });
//          }
//          this.registering = false;
//        });
      }
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
