<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>回 收</span>
      <el-button type="primary" style="margin-right:70px;float:right" @click="add">
        <span style="font-size:15px">申请回收</span>
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="recyclingid" label="回收编号">
      </el-table-column>
      <el-table-column prop="productname" label="产品">
      </el-table-column>
      <el-table-column prop="recyclingcount" label="数量">
      </el-table-column>
      <el-table-column prop="total" label="金额">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="reason" label="处理意见">
      </el-table-column>
      <el-table-column prop="createtime" label="时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="tableData[scope.$index].status!='处理中'" @click="cancelGoods(scope.$index,tableData)"
                     type="text" size="small">取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="回收" :visible.sync="dialogVisible" :before-close="clickCancel">
      <div class="recydiabody">
        <p class="recyclingTitle"><span>商品：精品莜麦糊</span><span>库存:{{stackCount}}</span></p>
        <div class="huishoudiv">
          <span>选择数量:</span>
          <el-input-number v-model="num" :min="0" :max="limitCount"></el-input-number>
          <span class="shouru">收入:{{price * num * 0.6}}</span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="recycle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'
  export default {
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        stackCount: 0,
        applyCount: 0,
        limitCount: 10,
        price: 0,
        num: 0

      }
    },
    created() {
      this.getHistList();
    },

    methods: {
      recycle(){
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
          productId: 1,
          recyclingCount: that.num,
          total: that.price * that.num * 0.6
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/recycling/userApplyRecycling',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: '申请成功',
              type: 'success'
            });
            that.dialogVisible=false;
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
      add(){
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/recycling/getUserRecyclingInfo',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData;
            that.applyCount = parseInt(data.recyclingcount);
            that.stackCount = parseInt(data.stockCount);
            that.limitCount = that.applyCount > that.stackCount ? that.stackCount : that.applyCount;
            that.num = that.limitCount;
            that.price = parseInt(data.price);
            that.dialogVisible = true;
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
      },
      clickCancel() {
        this.dialogVisible = false
      },

      getHistList() {
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
          productId: 1,
          recyclingCount: that.num,
          total: that.price * that.num * 0.6
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/recycling/getUserRecyclingApplyInfo',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            that.tableData = response.data.returnData.bizReturnData.userrecyclingapply;
            for (var i = 0; that.tableData && i < that.tableData.length; i++) {
              switch (that.tableData[i].status) {
                case '0':
                  that.tableData[i].status = '处理中';
                  break;
                case '1':
                  that.tableData[i].status = '申请通过';
                  break;
                case '2':
                  that.tableData[i].status = '申请被拒绝';
                  break;
                case '3':
                  that.tableData[i].status = '用户取消';
                  break;
              }
            }
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
      },

      cancelGoods(index, tableData) {
        var that = this;
        var params = {
          recyclingId: that.tableData[index].recyclingid,
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/recycling/userCancelRecyclingApply',
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

  .recydiabody {
    height: 200px
    font-size 18px
  }

  .recyclingTitle {
    margin-bottom 50px
  }

  .recyclingTitle span {
    margin-right: 200px
  }

  .shouru {
    margin-left 90px
  }

  .huishoudiv {
    margin-bottom 50px
  }

  .hint span {
    display: block
  }


</style>
