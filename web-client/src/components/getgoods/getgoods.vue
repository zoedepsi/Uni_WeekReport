<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>提 货</span>
      <el-button type="primary" style="margin-right:70px;float:right" @click="add">
        <span style="font-size:15px">提货</span>
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="pickupgoodsid" label="提货编号">
      </el-table-column>
      <el-table-column prop="productid" label="产品">
      </el-table-column>
      <el-table-column prop="count" label="数量">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="createtime" label="时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="tableData[scope.$index].status!='未发货'" @click="cancel(scope.$index,tableData)" type="text" size="small">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="填写提货信息" :visible.sync="dialogVisible">
      <el-form :model="shouhuo" label-width="100px">
        <el-form-item label="收货人姓名">
          <el-input v-model="shouhuo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="shouhuo.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="shouhuo.address">
          </el-input>
        </el-form-item>
        <el-form-item label="发货数量">
          <el-input-number v-model="shouhuo.num" :min="1" :max="40"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getgoods">提 货</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'
export default {

  data() {
    return {
      shouhuo: {
        name: '',
        phone: '',
        num: 1,
        address: '',
      },
      tableData: [],
      dialogVisible: false,
    }
  },

  created() {
    this.getHistList();
  },

  methods: {
    reset() {
      this.shouhuo = {
        name: '',
        phone: '',
        num: 1,
        address: '',
      };
    },
    cancel(index, tableData) {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        pickUpGoodsId: that.tableData[index].pickupgoodsid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/pickupgoods/cancelpickupgoods',
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
    add() {
      this.dialogVisible = true;
    },
    sortByTime(obj1, obj2) {
      return obj1.createtime < obj2.createtime;
    },

    getHistList() {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/pickupgoods/getselfpickupgoods',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.tableData = response.data.returnData.bizReturnData.pickUpGoodslist;
          that.tableData.sort(that.sortByTime);
          for (var i = 0; i < that.tableData.length; i++) {
            switch (that.tableData[i].status) {
              case '0':
                that.tableData[i].status = '未发货';
                break;
              case '1':
                that.tableData[i].status = '已发货';
                break;
              case '2':
                that.tableData[i].status = '已取消';
                break;
            }
            switch (that.tableData[i].productid) {
              case '1':
                that.tableData[i].productid = '1号产品';
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
      this.reset();
    },
    getgoods() {
      var that = this;
      that.dialogVisible = false;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        productId: 1,
        address: JSON.stringify([
          {
            name: that.shouhuo.name,
            phone: that.shouhuo.phone,
            num: that.shouhuo.num.toString(),
            address: that.shouhuo.address,
          }
        ]),
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/pickupgoods/sponsor',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.$message({
            message: '提货成功！请等待收货。',
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
        that.registering = false;
      });
      that.dialogVisible = false;
      that.reset();
    },
    cancel(index, tableData) {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        pickUpGoodsId: tableData[index].pickupgoodsid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/pickupgoods/cancelpickupgoods',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
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

</style>
