<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>提 现</span>
      <el-button type="primary" style="margin-right:70px;float:right" @click="add">
        <span style="font-size:15px">提现</span>
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="withdrawalsid" label="提现编号">
      </el-table-column>
      <el-table-column prop="type" label="提现类型">
      </el-table-column>
      <el-table-column prop="total" label="提现总额">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
      <el-table-column prop="paytype" label="打款方式">
      </el-table-column>
      <el-table-column prop="createtime" label="时间">
      </el-table-column>
      <el-table-column prop="reason" label="处理意见">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="tableData[scope.$index].status!='申请中'" @click="cancelGoods(scope.$index,tableData)" type="text" size="small">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="填写提现信息" :visible.sync="dialogVisible" :before-close="clickCancel">
      <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="提现类型" :required="true">
          <el-select prop="type" v-model="formData.type" placeholder="请选择" style="width:200px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span v-if="formData.type === 0">可提现{{balance}}元</span>
          <span v-if="formData.type === 1">可提现{{rewardbalance}}元，冻结{{frozenrewardtotal}}元</span>
          <span v-if="formData.type === 2">可提现{{regrewardbalance}}元，冻结{{frozenregtotal}}元</span>
        </el-form-item>
        <el-form-item label="提现金额" :required="true">
          <el-input type="number" v-model="formData.total" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="withdraw">提 现</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'
export default {
  data() {
    return {
      options: [
        { label: '货款', value: 0 },
        { label: '效益分红', value: 1 },
        { label: '推广费', value: 2 },
      ],
      formData: {
        type: '',
        total: '',
      },
      tableData: [],
      dialogVisible: false,
      balance: (JSON.parse(window.sessionStorage.getItem("newUserInfo"))).balance,
      rewardbalance: (JSON.parse(window.sessionStorage.getItem("newUserInfo"))).rewardbalance,
      regrewardbalance: (JSON.parse(window.sessionStorage.getItem("newUserInfo"))).regrewardbalance,
      frozenrewardtotal: (JSON.parse(window.sessionStorage.getItem("newUserInfo"))).frozenrewardtotal,
      frozenregtotal: (JSON.parse(window.sessionStorage.getItem("newUserInfo"))).frozenregtotal,
    }
  },
  created() {
    this.getHistList();
  },

  methods: {
    add(){
      var that=this;
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
          if(!data.weixin||!data.alipay||!data.cardno||!data.bankname){
            this.$message({
              message: "请先去“我的资料”页面完善个人信息",
              type: 'error'
            });
          }else{
            this.dialogVisible = true;
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
    clickCancel() {
      this.dialogVisible = false
      this.formData = {
        type: '',
        total: '',
      };
    },
    withdraw: function() {
      var that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          if (!/^[012]{1}$/.test(that.formData.type)) {
            that.$message({
              message: "请选择提现类型",
              type: 'error'
            });
            return;
          }

          that.axios({
            method: 'post',
            url: rootPath + '/dbs/withdrawals/sponsor',
            params: {
              userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
              total: that.formData.total,
              type: that.formData.type,
            }
          }).then((response) => {
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '申请提现成功',
                type: 'success'
              });
              that.getHistList();
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
          that.dialogVisible = false;
          that.reset();
        }
      });
    },
    reset() {
      this.formData = {
        type: '',
        total: '',
      };
    },
    sortByTime(obj1, obj2) {
      //return obj1.createtime - obj2.createtime;
      return obj2.createtime - obj1.createtime;//why same?
    },

    getHistList() {
      var that = this;
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/withdrawals/getselfwithdrawals',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.tableData = response.data.returnData.bizReturnData.withdrawalslist;
          //that.tableData.sort(that.sortByTime);
          for (var i = 0; that.tableData && i < that.tableData.length; i++) {
            switch (that.tableData[i].status) {
              case '0':
                that.tableData[i].status = '未处理';
                break;
              case '1':
                that.tableData[i].status = '已处理';
                break;
              case '2':
                that.tableData[i].status = '已取消';
                break;
            }
            switch (that.tableData[i].paytype) {
              case '0':
                that.tableData[i].paytype = '微信';
                break;
              case '1':
                that.tableData[i].paytype = '支付宝';
                break;
              case '2':
                that.tableData[i].paytype = '银行卡';
                break;
            }
            switch (that.tableData[i].type) {
              case '0':
                that.tableData[i].type = '货款';
                break;
              case '1':
                that.tableData[i].type = '共享金';
                break;
              case '2':
                that.tableData[i].type = '注册奖励';
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

</style>
