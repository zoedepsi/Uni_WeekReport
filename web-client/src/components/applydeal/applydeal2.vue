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
        <el-table-column
          prop="share"
          label="预计奖励">
        </el-table-column>
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
            <span style="font-size:24px;color: #cc373a;">¥{{form.price}}</span>
            <span style=" color: #bbb;text-decoration: line-through;">(原价：¥280)</span>
          </el-form-item>
          <el-form-item label="购买数量" prop="count">
            <el-input-number v-model="form.count" :disabled="true"></el-input-number>
          </el-form-item>
          <el-form-item label="购买总价">
            <span style="font-size:24px;color: #cc373a;">¥{{form.price * form.count}}</span>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="radio">
              <el-radio :label="0">无需发货</el-radio>
              <el-radio :label="1">需要发货</el-radio>
            </el-radio-group>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消购买</el-button>
          <el-button type="primary" @click="confirmDealApply">确认购买</el-button>
        </span>
      </el-dialog>
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
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/applybuy/getapplybuy',
        params: params
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
            }
            if(data[i].truename == "*"){
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
    data() {
      return {
        prodPirce:0.00,
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
          this.limit = this.form.count - this.needGoodsCount;
          this.addressTableData[this.curRow].name = this.shouhuo.name;
          this.addressTableData[this.curRow].phone = this.shouhuo.phone;
          this.addressTableData[this.curRow].address = this.shouhuo.address;
          this.addressTableData[this.curRow].num = this.shouhuo.num;
        }
        else {
          this.needGoodsCount += this.shouhuo.num;
          this.limit = this.form.count - this.needGoodsCount;
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
      handleClick(index, rows) {
        var that = this;
        that.applyBuyId=rows[index].applyid;
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/applybuy/getprofit',
          params: {
            applyId: rows[index].applyid,
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
          }
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              var data=response.data.returnData.bizReturnData;
              if(!data.isenough){
                that.$alert('您处理此单的收益为：'+parseInt(data.profit).toFixed(2)+'.', '提示', {
                  confirmButtonText: '继续',
                  callback: function () {
                    that.axios({
                      method: 'post',
                      url: rootPath + '/dbs/applybuy/deal',
                      params: {
                        applyBuyId: rows[index].applyid,
                        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
                      }
                    }).then((response) => {
                      if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
                        that.$alert('订单处理完成！', '提示', {
                          confirmButtonText: '确定',
                          callback: function () {
                            that.axios({
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
                                  }
                                  if(data[i].truename == "*"){
                                    data[i].truename = "线下销售匹配",
                                      data[i].phone="保密"
                                  }
                                }
                                that.tableData = data;
                              } else {
                                that.$message({
                                  message: response.data.returnData.bizReturnMessage,
                                  type: 'error'
                                });
                              }
                            });
                          }
                        })
                      } else {
                        if (response.data.returnData.bizReturnCode == "MNS-00012") {
                          that.$confirm('您的商品库存已不足以通过此订单，是否立即向上级购买?', '提示', {
                            confirmButtonText: '立即购买',
                            cancelButtonText: '暂不购买',
                            type: 'warning'
                          }).then(() => {
                            var discountRate = 1;
                            var viplevel = parseInt(JSON.parse(window.sessionStorage.getItem("userInfo")).vipgrade);
                            var buycount = parseInt(rows[index].count) * 2;
                            if(parseInt(rows[index].count) == 40){
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
                          that.$message({
                            message: response.data.returnData.bizReturnMessage,
                            type: 'error'
                          });
                        }
                      }
                    });
                  }
                });
              }else{
                that.$alert('您处理此单的收益为：'+parseInt(data.profit).toFixed(2)+',预计总收益为：'+parseInt(data.predictProfit).toFixed(2)+'.', '提示', {
                  confirmButtonText: '继续',
                  callback: function () {
                    that.axios({
                      method: 'post',
                      url: rootPath + '/dbs/applybuy/deal',
                      params: {
                        applyBuyId: rows[index].applyid,
                        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
                      }
                    }).then((response) => {
                      if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
                        that.$alert('订单处理完成！', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                            that.axios({
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
                                  }
                                  if(data[i].truename == "*"){
                                    data[i].truename = "线下销售匹配",
                                      data[i].phone="保密"
                                  }
                                }
                                that.tableData = data;
                              } else {
                                that.$message({
                                  message: response.data.returnData.bizReturnMessage,
                                  type: 'error'
                                });
                              }
                            });
                          }
                        })
                      } else {
                        if (response.data.returnData.bizReturnCode == "MNS-00012") {
                          that.$confirm('您的商品库存已不足以通过此订单，是否立即向上级购买?', '提示', {
                            confirmButtonText: '立即购买',
                            cancelButtonText: '暂不购买',
                            type: 'warning'
                          }).then(() => {
                            var discountRate = 1;
                            var viplevel = parseInt(JSON.parse(window.sessionStorage.getItem("userInfo")).vipgrade);
                            var buycount = parseInt(rows[index].count) * 2;
                            if(parseInt(rows[index].count) == 40){
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
                          that.$message({
                            message: response.data.returnData.bizReturnMessage,
                            type: 'error'
                          });
                        }
                      }
                    });
                  }
                });
              }

          }
        })


      },
      confirmDealApply() {
          var that=this;
        if (this.radio == 1 && this.needGoodsCount != this.form.count) {
          this.$message({
            message: "发货商品数目总和与购买数目不一致，请检查后提交购买",
            type: 'error'
          });
        } else {
          var params = {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            applyBuyId:this.applyBuyId
          }
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/applybuy/sponsordealapplybuy2',
            params: params
          }).then((response) => {
            if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '商品购买成功！请等待上级处理。',
                type: 'success'
              });
              that.dialogVisible = false;
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
        }
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
