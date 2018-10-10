<template>
  <div class="page-wrapper">
    <div class="page-title">订单处理</div>
    <div class="applydeal-wrapper">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="applyid"
          label="订单编号"
        >
        </el-table-column>
        <el-table-column
          prop="truename"
          label="购买人"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="productid"
          label="产品">
        </el-table-column>
        <el-table-column
          prop="count"
          label="购买数量">
        </el-table-column>
        <el-table-column
          prop="total"
          label="购买总额">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="购买发起时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="share"-->
          <!--label="预计奖励">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="createtime"
          label="处理操作">
          <template slot-scope="scope">
            <el-button :disabled="tableData[scope.$index].status!='申请中'" @click="handleClick(scope.$index,tableData)"
                       type="text" size="small">处理订单




            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="商品购买"
        :visible.sync="dialogVisible"
        size="small">
        <el-form :model="form" label-width="140px">
          <el-form-item label="产品名称">
            精品莜麦糊


          </el-form-item>
          <el-form-item label="单价">
            <span style="font-size:24px;color: #cc373a;">¥{{buyPrice}}</span>
            <span style=" color: #bbb;text-decoration: line-through;">(原价：¥280)</span>
          </el-form-item>
          <el-form-item label="购买数量" prop="count">
            <el-input-number v-model="buyCount" :disabled="true"></el-input-number>
          </el-form-item>
          <el-form-item label="购买总价">
            <span style="font-size:24px;color: #cc373a;">¥{{buyPrice * buyCount}}</span>
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-radio-group v-model="radio">-->
          <!--<el-radio :label="0">无需发货</el-radio>-->
          <!--<el-radio :label="1">需要发货</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <!--<el-form-item :style="addressBtnStyle">-->
          <!--<el-table :data="addressTableData" border style="width: 600px">-->
          <!--<el-table-column prop="name" label="姓名"></el-table-column>-->
          <!--<el-table-column prop="phone" label="电话"></el-table-column>-->
          <!--<el-table-column prop="address" label="地址"></el-table-column>-->
          <!--<el-table-column prop="num" label="数量"></el-table-column>-->
          <!--<el-table-column :width="100" label="操作">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button @click="deleteAddress(scope.$index,addressTableData)" type="text" size="small">删除-->


          <!--</el-button>-->
          <!--<el-button type="text" size="small" @click="editAddress(scope.$index,addressTableData)">编辑-->


          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--</el-table>-->
          <!--<el-button type="primary" size="large" @click="addAddress">添加收货地址</el-button>-->
          <!--</el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消购买</el-button>
          <el-button type="primary" @click="confirmDealApply">确认购买</el-button>
        </span>
      </el-dialog>
      <!--<el-dialog title="收货地址" :visible.sync="dialogTableVisible">-->
      <!--<el-form :model="shouhuo" label-width="100px">-->
      <!--<el-form-item label="收货人姓名">-->
      <!--<el-input v-model="shouhuo.name" auto-complete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收货人电话">-->
      <!--<el-input v-model="shouhuo.phone" auto-complete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收货人地址">-->
      <!--<el-input v-model="shouhuo.address" auto-complete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="发货数量">-->
      <!--<el-input-number v-model="shouhuo.num" :min="1" :max="limit"></el-input-number>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="closeDialog">取 消</el-button>-->
      <!--<el-button type="primary" @click="saveAddress">确 定</el-button>-->
      <!--</div>-->
      <!--</el-dialog>-->

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
          <el-button @click="chargeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rechargeandsponser">提 交</el-button>
        </div>
      </el-dialog>

    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'

  export default {

    mounted: function () {

      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
      }
      this.refreshPage();
    },
    data() {
      return {
        prodPirce: 0.00,
        needGoods: false,//该变量用来标记最后提交购买的时候，是发货还是不发货
        needGoodsCount: 0,
        isFromEdit: false,//进入对话框，有两种方式，添加地址和编辑地址
        curRow: 0,
        tableData: [],
        dialogVisible: false,
        limit: 0,//当前剩下的最大上限数目
        form: {
          region: '',
          price: 0,
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
        buyPrice:'0.00',
        buyCount:'0',

        //充值相关
        chargeDialogVisible:false,
        formData:{
          type: '',
          total: '',
          paynumber: '',
          remark: '',
          imgBase64: '',
          truename: '',
          applyId: ''
        },
        options: [
          { label: '微信', value: 0 },
          { label: '支付宝', value: 1 }
        ],
        payPic: 'http://ojsqjl9hp.bkt.clouddn.com/defaultPay.png',
        imageUrl: ''

      }
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
    created(){
      var that = this;
      //获取商品原始价格
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/user/getproductprice',
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData;
          that.prodPirce = data.price;
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
      closeDialog() {
        this.dialogTableVisible = false;
      },
//      addAddress() {
//        /* 如果购买数目不足1个，则不再弹出添加地址的对话框，而是提示用户购买数目达到上限 */
//        if (this.limit < 1) {
//          this.$message({
//            message: '购买数目已达到最大值！',
//            type: 'warning'
//          });
//          return;
//        }
//        this.dialogTableVisible = true;
//      },
//      deleteAddress(index, row) {
//        this.limit += row[index].num;
//        this.needGoodsCount -= row[index].num;
//        this.addressTableData.splice(index, 1);
//      },
//      editAddress(index, addrTabData) {
//        this.shouhuo.name = addrTabData[index].name;
//        this.shouhuo.phone = addrTabData[index].phone;
//        this.shouhuo.addAddress = addrTabData[index].addAddress;
//        this.shouhuo.num = addrTabData[index].num;
//        this.limit += this.shouhuo.num;
//        this.isFromEdit = true;
//        this.curRow = index;
//        this.dialogTableVisible = true;
//      },
//      saveAddress() {
//        /*
//         需要发货的话，最后的数量应该是添加的所有地址里的货物数量之和，
//         否则，应该是服务器返回的this.buyform.count;每添加一个地址，就
//         统计其数量，并计算还剩余多少可以购买
//         */
//        if (this.isFromEdit) {
//          this.needGoodsCount -= this.addressTableData[this.curRow].num - this.shouhuo.num;
//          this.limit = this.form.count - this.needGoodsCount;
//          this.addressTableData[this.curRow].name = this.shouhuo.name;
//          this.addressTableData[this.curRow].phone = this.shouhuo.phone;
//          this.addressTableData[this.curRow].address = this.shouhuo.address;
//          this.addressTableData[this.curRow].num = this.shouhuo.num;
//        }
//        else {
//          this.needGoodsCount += this.shouhuo.num;
//          this.limit = this.form.count - this.needGoodsCount;
//          this.addressTableData.push(this.shouhuo);
//          this.shouhuo = {
//            name: '',
//            phone: '',
//            address: '',
//            num: 1
//          };
//        }
//        this.isFromEdit = false;
//        this.dialogTableVisible = false;
//      },
      handleClick(index, rows) {
        var that = this;
        that.applyBuyId = rows[index].applyid;

        //将订单编号赋给 this.formData.applyId
        this.formData.applyId = rows[index].applyid;
//        获取收益
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/applybuy/getprofit',
          params: {
            applyId: rows[index].applyid,
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
          }
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData;
            that.buyPrice=data.buyPrice;
            that.buyCount=data.buyCount;
            if (data.isenough==="0") {
              that.$alert('您处理此单的收益为：' + parseInt(data.profit).toFixed(2) + '.', '提示', {
                confirmButtonText: '继续',
                callback: action =>{
                  that.goOndeal(index, rows);
                }
              })
            } else {
              that.$alert('您处理此单的收益为：' + parseInt(data.profit).toFixed(2) + ',预计总收益为：' + parseInt(data.predictProfit).toFixed(2)||0 + '.', '提示', {
                confirmButtonText: '继续',
                callback: action =>{
                  that.goOndeal(index, rows);
                }
              })
            }
          }
        })

      },
      goOndeal(index, rows){
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/applybuy/deal',
          params: {
            applyBuyId: rows[index].applyid,
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
          }
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            this.$alert('订单处理完成！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refreshPage();
              }
            })
          } else {
            if (response.data.returnData.bizReturnCode == "MNS-00012") {
              this.$confirm('您的商品库存已不足以通过此订单，是否立即向上级购买?', '提示', {
                confirmButtonText: '立即购买',
                cancelButtonText: '暂不购买',
                type: 'warning'
              }).then(() => {
                var discountRate = 1;
                var viplevel = parseInt(JSON.parse(window.sessionStorage.getItem("userInfo")).vipgrade);
                var buycount = parseInt(rows[index].count) * 2;
                if (parseInt(rows[index].count) == 40) {
                  buycount = 40;
                }
                switch (buycount) {
                  case 10:
                    discountRate = 0.7;
                    break;
                  case 20:
                    discountRate = 0.6;
                    break;
                  case 40:
                    discountRate = 0.5;
                    break;
                }
                that.limit = buycount;
                that.form.count = buycount;
                that.form.price = this.prodPirce * discountRate;
                that.dialogVisible = true;
              }).catch(() => {

              });
            } else {
              this.$message({
                message: response.data.returnData.bizReturnMessage,
                type: 'error'
              });
            }
          }
        });
      },
      confirmDealApply() {
        if (this.radio == 1 && this.needGoodsCount != this.form.count) {
          this.$message({
            message: "发货商品数目总和与购买数目不一致，请检查后提交购买",
            type: 'error'
          });
        } else {
          var params = {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            applyBuyId: this.applyBuyId
          }
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/applybuy/sponsordealapplybuy2',
            params: params
          }).then((response) => {
            if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              this.$message({
                message: '商品购买成功，订单完成！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.refreshPage();
            } else if (response.data && response.data.returnData) {
//              this.$message({
//                message: response.data.returnData.bizReturnMessage,
//                type: 'error'
//              });
              this.dialogVisible = false;
              this.chargeDialogVisible = true;
              this.differtotal = response.data.returnData.bizReturnData.differtotal;
              this.formData.total = this.differtotal;
            } else {
              this.$message({
                message: '发生未知错误',
                type: 'error'
              });
            }
          });
        }
      },
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
          truename: '',
          applyId: ''
        };
        this.imageUrl = '';
      },
      refreshPage() {
        //购买成功，刷新页面
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/applybuy/getapplybuy',
          params: {
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
          }
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.applylist;
            for (var i = 0; i < data.length; i++) {
              switch (data[i].status) {
                case "0":
                  data[i].status = "申请中"
                  break
                case "1":
                  data[i].status = "已完成"
                  break
                case "2":
                  data[i].status = "已取消"
                  break
                case "-2":
                  data[i].status = "充值购买中"
                  break
              }
              if (data[i].truename == "*") {
                data[i].truename = "线下销售匹配",
                  data[i].phone = "保密"
              }
            }
            this.tableData = data;
          } else {
            this.$message({
              message: response.data.returnData.bizReturnMessage,
              type: 'error'
            });
          }
        });
      },
      rechargeandsponser(){
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
            var fd = new FormData();
            var img = that.formData.imgBase64.slice(that.formData.imgBase64.indexOf('base64,') + 7)
            var xhr = new XMLHttpRequest();

            fd.append('userId', (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid)
            fd.append('type', that.formData.type)
            fd.append('paynumber', that.formData.paynumber)
            fd.append('image', img)
            fd.append('rechargetotal', that.formData.total)
            fd.append('truename', that.formData.truename)
            fd.append('remark', that.formData.remark)
            fd.append('applyId',that.formData.applyId)

            xhr.addEventListener("load", function(e) {
              console.log(e);
              var response = e.target.response;
              if (response.indexOf('"bizIsSucceed":"true"')) {
                that.$message({
                  message: '充值成功',
                  type: 'success'
                });
                that.chargeDialogVisible = false;
                that.reset();
                that.refreshPage();
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
            xhr.open("POST", rootPath + '/dbs/applybuy/sponsorapplyrecharge');
            xhr.send(fd);
          }
        });
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

  .applydeal-wrapper {
    float left;
    width: 99%;
    padding-top: 20px;

    /*border:1px solid #eee;*/
    /*-webkit-border-radius: 4px*/
    /*-moz-border-radius: 4px*/
    /*border-radius: 4px*/
    min-height: 30px
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

</style>
