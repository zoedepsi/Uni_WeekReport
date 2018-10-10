<template>
  <div class="page-wrapper">
    <div class="page-title">会员消费录入</div>
    <el-input
        class="mobile"
        placeholder="请输入手机号"
        icon="search"
        v-model="mobile"
        prop="mobile"
        :on-icon-click="handleSearchClick">
      </el-input>
    <div class="bills-wrapper">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="username"
          label="会员名">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="微信昵称">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column v-if="true"
          prop="createtime"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="clickAdd(scope.$index,tableData)" type="success" icon="edit" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增消费"
        :visible.sync="adddialogVisible"
        size="tiny">
        <el-form  ref="consumeform" :model="consumeform" :rules="consumerules" label-width="80px">
          <el-form-item label="会员userid" v-show="false">
            <el-input v-model="consumeform.userid"></el-input>
          </el-form-item>
          <el-form-item label="会员姓名">
            <div class="data-item-data2">{{consumeform.name}}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div class="data-item-data2">{{consumeform.mobile}}</div>
          </el-form-item>
          <el-form-item label="消费项目" prop="pluid">
            <el-select v-model="consumeform.pluid" placeholder="请选择消费项目" @change="pluidChange">
              <el-option
                v-for="item in productList"
                :label="item.pluname"
                :value="item.pluid"
                :key="item.pluname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费金额" prop="total">
            <el-input type="number" v-model="consumeform.total"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="consumeform.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false;consumeform.pluid='';consumeform.total='';consumeform.remark='';">取 消</el-button>
          <el-button type="primary" @click="confirmConsume">立即创建</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import proddetail from '../proddetail/proddetail.vue'
  import {rootPath} from '../../config/apiConfig'

  export default {
    data(){
      return {
        productList:[],
        adddialogVisible: false,
        tableData: [],
        mobile: '',
        consumeform: {
          userid:'',
          name: '',
          mobile: '',
          pluid: '',
          total: '',
          remark: ''
        },
        consumerules: {
          pluid: [
            { required: true, message: '请输入消费项目', trigger: 'blur' }
          ],
          total: [
             {required: true, message: '请输入金额'},
            {validator(r,v,b){console.log(v);(/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v)?b():b(new Error('请填写数字'))}}
          ],
          checked: true
        }
      }
    },
    created(){
      var that = this;
      this.axios({
        method: 'post',
        url: rootPath + '/gold/user/getallcustomer',
        params: {
          userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          phone: that.mobile
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData.allUserInfo;
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
      this.initProiductList();
    },

    methods: {
      pluidChange(pluid){
          for(var i in this.productList){
              var prod = this.productList[i];
              if(prod.pluid == pluid){
                  var price = 0+ prod.price ;
                  this.consumeform.total = price;
                  break;
              }
          }
      },
      confirmConsume() {
        var that = this;
        this.$refs.consumeform.validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/sale/savesaleinfo',
              params: {
                adminid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                userid: that.consumeform.userid,
                nickname:that.consumeform.name,
                total: that.consumeform.total,
                pluid: that.consumeform.pluid,
                remark: that.consumeform.remark == undefined?"":that.consumeform.remark
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.adddialogVisible = false;
                that.consumeform.pluid='';
                that.consumeform.total='';
                that.consumeform.remark='';
                this.$message({
                  message: "添加消费成功",
                  type: 'success'
                });
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
        })
      },
      clickAdd(index,rows){
        this.adddialogVisible = true;
        var that = this;
        var row = rows[index];
        this.consumeform.userid = row.userid;
        this.consumeform.name = row.username || row.nickname;
        this.consumeform.mobile = row.phone;
      },
      handleSearchClick() {
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/user/getallcustomer',
          params: {
            userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            phone: that.mobile
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.allUserInfo;
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
      initProiductList(){
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/product/getall',
          params: {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.list;
            that.productList = data;
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .data-item-data2
    font-size: 18px;
    margin-top: 0px;
    color: #D94B73;
  .el-input__icon
    background-color #20A0FF;
  .mobile
    width: 17% !important;
    padding-left: 82% !important;

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
