<template>
  <div class="page-wrapper">
    <div class="page-title">充值列表</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <!--<el-table-column prop="applyuser" label="用户ID">-->
        <!--</el-table-column>-->
        <el-table-column prop="rechargeid" label="充值订单号" min-width="150">
        </el-table-column>
        <el-table-column prop="truename" label="用户名">
          <template slot-scope="scope">
            <a  @click="seeUserDetail(scope.row.applyuser)" style="text-decoration: none;color:#386fda;cursor: pointer">
              {{scope.row.truename}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机">{{}}
        </el-table-column>
        <el-table-column prop="rechargetotal" label="充值金额">
        </el-table-column>
        <el-table-column prop="type" label="充值方式">
        </el-table-column>
        <el-table-column prop="status" label="充值状态">
        </el-table-column>
        <el-table-column prop="createtime" label="申请时间" min-width="110">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作" prop="status" min-width="100">
          <template slot-scope="scope">
            <el-button @click="clickDetail(scope.$index,scope.row)" type="text" size="small">详情</el-button>
            <el-button :disabled="tableData[scope.$index].status!='申请中'" @click="clickPass(scope.$index)" type="text" size="small">通过</el-button>
            <el-button :disabled="tableData[scope.$index].status!='申请中'" @click="clickRefuse(scope.$index)" type="text" size="small">拒绝</el-button>
          </template>
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
    <el-dialog title="会员详情" :visible.sync="dialogVisibleDetail">
      <el-form label-width="120px">
        <el-form-item label='付款人真实姓名'>{{tableData[savedIndex].rechargetruename}}</el-form-item>
        <el-form-item label='付款账号'>{{tableData[savedIndex].paynumber}}</el-form-item>
        <el-form-item label='充值截图'>
          <img ref='jietu' :src="imgUrl" alt='无法载入图片' style='width:200px;height:200px;' data-action="zoom">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleDetail = false">关 闭</el-button>
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
import { rootPath } from '../../config/apiConfig'
import '../../../static/js/zoom-vanilla.min'

export default {
  data() {
    return {
      vipstatusEnums:{"1":"正常","0":"冻结"},
      vipgradeEnums:{1:"金牌会员",2:"银牌会员",3:"铜牌会员",4:"普通会员"},
      booleanEnums:{0:"否",1:"是","0":"否","1":"是"},
      tableData: [],
      dialogVisible: false,
      dialogVisibleDetail: false,
      reason: '',
      savedIndex: 0,
      imgUrl: null,
      detailDialogVisible:false,
      detailForm:{
        vipid:'',
        alipay:"",
        balance:0,
        bankname:"",
        cardno:"",
        createtime:"",
        idnumber:"",
        ifvirtual:"",
        isactive:"",
        phone:"",
        regrewardbalance:0,
        rewardbalance:0,
        truename:"",
        userid:"",
        username:"",
        usertype:"",
        vipgrade:"",
        weixin:""
      },
    }
  },
  created() {
    var that = this;
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/recharge/admingetrecharge',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData.reChargeList;
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
        }
        for (var i = 0; i < data.length; i++) {
          switch (data[i].type) {
            case "0":
              data[i].type = "微信"
              break
            case "1":
              data[i].type = "支付宝"
              break
          }
        }
        data.sort(function(obj1, obj2) {
          var first = obj1.createtime,
            second = obj2.createtime;
          if (first < second) {
            return 1;
          }
          else if (first == second) {
            return 0;
          }
          else {
            return -1;
          }
        })
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
    clickDetail(index, rowData) {
      //this.imgUrl = 'http://39.106.47.225:8081/dbs/recharge/getrechargeimage?reChargeId=6b6bc1b8-0d24-4d7c-8809-8e4a349a534a'
      //this.imgUrl = 'http://39.106.47.225:8081/dbs/recharge/getrechargeimage?reChargeId=' + '6b6bc1b8-0d24-4d7c-8809-8e4a349a534a';
      this.imgUrl = 'http://39.106.47.225:8081/dbs/recharge/getrechargeimage?reChargeId=' + rowData.rechargeid;
      this.dialogVisibleDetail = true;
    },
    cancel() {
      this.dialogVisible = false;
      this.reason = '';
    },
    clickPass(index) {
      this.pass(index);
    },
    pass(index) {
      var that = this;
      var params = {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
        reChargeId: that.tableData[index].rechargeid,
      };
      that.axios({
        method: 'POST',
        url: rootPath + '/dbs/recharge/admindealrecharge',
        params: params,
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          that.$message({
            message: "成功",
            type: 'success'
          });
          that.tableData[index].status = '已通过';
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
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
        reChargeId: that.tableData[that.savedIndex].rechargeid,
        //refuse reason
        reason: that.reason,
      };
      that.axios({
        method: 'POST',
        url: rootPath + '/dbs/recharge/adminrefundrecharge',
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

</style>
