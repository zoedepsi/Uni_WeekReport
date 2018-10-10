<template>
  <div class="page-wrapper">
    <div class="page-title">会员可回收数量</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="userInfo.truename" label="用户">
          <template slot-scope="scope">
            <a @click="seeUserDetail(scope.row.userid)"
               style="text-decoration: none;color:#386fda;cursor: pointer">
              {{scope.row.truename}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="productname" label="产品">
        </el-table-column>
        <el-table-column prop="recyclingcount" label="可回收数量">
        </el-table-column>
        <el-table-column prop="stockcount" label="现有库存">
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间">
        </el-table-column>
        <el-table-column prop="updatetime" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" prop="status">
          <template slot-scope="scope">
            <el-button @click="clickPass(scope.$index)" type="text"
                       size="small">修改

            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="会员详情" :visible.sync="detailDialogVisible" size="small">
      <el-form style="line-height: 30px">
        <el-row>
          <el-col :span="12">
            会员ID: {{detailForm.vipid}}


          </el-col>
          <el-col :span="12">
            用户名: {{detailForm.username}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            真实姓名: {{detailForm.truename}}


          </el-col>
          <el-col :span="12">
            用户等级: {{vipgradeEnums[detailForm.vipgrade]}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            手机号码: {{detailForm.phone}}


          </el-col>
          <el-col :span="12">
            微信号码: {{detailForm.weixin}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            账户余额: {{detailForm.balance}} 元


          </el-col>
          <el-col :span="12">
            注册奖励金余额: {{detailForm.regrewardbalance}} 元


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            共享金余额: {{detailForm.rewardbalance}} 元


          </el-col>
        </el-row>
        <el-row style="width: 100%;height:1px;border-top:1px solid #ccc;margin:5px 0"></el-row>
        <el-row>
          <el-col :span="12">
            银行卡号: {{detailForm.cardno}}


          </el-col>
          <el-col :span="12">
            银行卡开户行: {{detailForm.bankname}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            支付宝: {{detailForm.alipay}}


          </el-col>
          <el-col :span="12">
            身份证号: {{detailForm.idnumber}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            上级用户: {{detailForm.supertruename}}


          </el-col>
          <el-col :span="12">
            上级用户手机: {{detailForm.superphone}}


          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            创建时间: {{detailForm.createtime}}


          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改可回收数量" :visible.sync="DialogVisible" size="small">
      <el-input-number v-model="num" @change="" :min="1" :max="1000"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
  import proddetail from '../proddetail/proddetail.vue'
  import {rootPath} from '../../config/apiConfig'

  export default {
    data() {
      return {
        num: 0,
        vipstatusEnums: {"1": "正常", "0": "冻结"},
        vipgradeEnums: {1: "金牌会员", 2: "银牌会员", 3: "铜牌会员", 4: "普通会员"},
        booleanEnums: {0: "否", 1: "是", "0": "否", "1": "是"},
        tableData: [],
        dialogVisible: false,
        dkdialogVisible: false,
        reason: '',
        savedIndex: 0,
        detailDialogVisible: false,
        DialogVisible: false,
        dktype: '',
        dkindex: '',
        options: [{
          value: '0',
          label: '微信'
        }, {
          value: '1',
          label: '支付宝'
        }, {
          value: '2',
          label: '银行卡'
        }],
        detailForm: {
          vipid: '',
          alipay: "",
          balance: 0,
          bankname: "",
          cardno: "",
          createtime: "",
          idnumber: "",
          ifvirtual: "",
          isactive: "",
          phone: "",
          regrewardbalance: 0,
          rewardbalance: 0,
          truename: "",
          userid: "",
          username: "",
          usertype: "",
          vipgrade: "",
          weixin: ""
        }
      }
    },
    created() {
      var that = this;
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/recycling/getAllRecyclingInfo',
        params: {
          adminId: "*",
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData.allrecyclinglist;
          that.tableData = data;
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
        this.logining = false;
      });
    },
    methods: {
      seeUserDetail(userid){
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/user/getuserinfo',
          params: {
            userId: userid,
            vipId: ''
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData;
            this.detailForm = data;
            this.detailDialogVisible = true;
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
      clickPass(index) {
        this.DialogVisible = true;
        this.dkindex = index;
//        this.pass(index);
      },
      pass() {
        var that = this;
        var params = {
          adminId: '*',
          userId:that.tableData[that.dkindex].userid,
          recyclingCount: that.num
        };
        that.axios({
          method: 'POST',
          url: rootPath + '/dbs/recycling/adminUpdateRecycling',
          params: params,
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: "成功",
              type: 'success'
            });
            this.DialogVisible = false;
            this.axios({
              method: 'post',
              url: rootPath + '/dbs/recycling/getAllRecyclingInfo',
              params: {
                adminId: "*",
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                var data = response.data.returnData.bizReturnData.allrecyclinglist;
                that.tableData = data;
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
              this.logining = false;
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
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .page-title {
    border-left 3px solid #699fff;
    text-indent 8px;
    font-family "Microsoft YaHei"
    font-size 18px
  }

  .bills-wrapper {
    float left;
    width: 99%;
    padding-top: 20px;
    -webkit-border-radius: 4px
    -moz-border-radius: 4px
    border-radius: 4px
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

  .dkdia .el-dialog--small {
    width: 40%
  }
</style>
