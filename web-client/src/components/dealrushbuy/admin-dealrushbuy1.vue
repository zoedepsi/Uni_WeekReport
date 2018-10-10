<template>
  <div class="page-wrapper">
    <div class="page-title">回收申请明细</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="recyclingid" label="回收编号">
        </el-table-column>
        <el-table-column prop="userInfo.truename" label="用户姓名">
          <template slot-scope="scope">
            <a @click="seeUserDetail(scope.row.recyclinguser)"
               style="text-decoration: none;color:#386fda;cursor: pointer">
              {{scope.row.truename}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="productname" label="商品">
        </el-table-column>
        <el-table-column prop="recyclingcount" label="数量">
        </el-table-column>
        <el-table-column prop="total" label="金额">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column prop="reason" label="处理意见">
        </el-table-column>
        <el-table-column prop="createtime" label="申请时间">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="拒绝理由" :visible.sync="dialogVisible">
      <el-input type="textarea" :rows="3" placeholder="请输入拒绝的理由" v-model="reason" auto-complete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="refuse">确 定</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script type='text/ecmascript-6'>
  import proddetail from '../proddetail/proddetail.vue'
  import {rootPath} from '../../config/apiConfig'

  export default {
    data() {
      return {
        vipstatusEnums: {"1": "正常", "0": "冻结"},
        vipgradeEnums: {1: "金牌会员", 2: "银牌会员", 3: "铜牌会员", 4: "普通会员"},
        booleanEnums: {0: "否", 1: "是", "0": "否", "1": "是"},
        tableData: [],
        dialogVisible: false,
        dkdialogVisible:false,
        reason: '',
        savedIndex: 0,
        detailDialogVisible: false,
        dktype:'',
        dkindex:'',
        options:[{
          value:'0',
          label:'微信'
        },{
          value:'1',
          label:'支付宝'
        },{
          value:'2',
          label:'银行卡'
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
        },
      }
    },
    created() {
      var that = this;
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/recycling/getAllRecyclingApply',
        params: {
          adminId: "*",
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData.allrecyclingapplylist;
          for (var i = 0; i < data.length; i++) {
            switch (data[i].status) {
              case "0":
                data[i].status = "申请中"
                break;
              case "1":
                data[i].status = "已通过"
                break;
              case "2":
                data[i].status = "已拒绝"
                break;
              case "3":
                data[i].status = "用户取消"
                break;
            }
            if (data[i].userInfo==null) {
              data[i].userInfo = {
                username:'已踢出',
                phone:'',
                truename:'',
                idnumber:'',
                wexin:'',
                alipay:'',
                bankname:'',
                cardno:''
              }
            }
          }

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
      cancel() {
        this.dialogVisible = false;
        this.reason = '';
      },
      canceldk() {
        this.dkdialogVisible = false;
      },
      clickPass(index) {
        this.dkdialogVisible = true;
        this.dkindex=index;
        this.pass(index);
      },
      pass() {
        var that = this;
        var params = {
          adminId:'*',
          recyclingId: that.tableData[that.dkindex].recyclingid
        };
        that.axios({
          method: 'POST',
          url: rootPath + '/dbs/recycling/adminPassRecyclingApply',
          params: params,
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: "成功",
              type: 'success'
            });
            this.dkdialogVisible = false;
            that.tableData[that.dkindex].status = '已通过';
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
      },
      clickRefuse(index) {
        this.dialogVisible = true;
        this.savedIndex = index;
      },
      refuse() {
        var that = this;
        var params = {
          adminId:'*',
          recyclingId: that.tableData[that.savedIndex].recyclingid,
          //refuse reason
          reason: that.reason,
        };
        that.axios({
          method: 'POST',
          url: rootPath + '/dbs/recycling/adminRefuseRecyclingApply',
          params: params,
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: "成功",
              type: 'success'
            });
            that.tableData[that.savedIndex].status = '已拒绝';
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
        that.reason = '';
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
  .dkdia .el-dialog--small{
    width:40%
  }
</style>
