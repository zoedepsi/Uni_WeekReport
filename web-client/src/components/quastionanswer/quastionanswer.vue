<template>
  <div class="page-wrapper">
    <div class="page-title" id="page-title">用户咨询</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="questionid" label="问题编号"></el-table-column>
        <el-table-column prop="questioncontent" label="会员疑问" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="questionname" label="会员微信名称">
        </el-table-column>
        <el-table-column prop="phone" label="会员手机号"></el-table-column>
        <el-table-column prop="wechatid" label="会员微信号"></el-table-column>
        <el-table-column prop="statusName" label="问题状态"></el-table-column>
        <el-table-column prop="questiontime" label="时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="tableData[scope.$index].status=='0'" :disabled="tableData[scope.$index].status!='0'" @click="clickAdd(scope.$index,tableData)" type="success" size="small">回答问题</el-button>
            <el-button v-if="tableData[scope.$index].status!='0'" @click="lookAnswerDetail(scope.$index,tableData)" type="info" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增答案"
        :visible.sync="adddialogVisible"
        size="tiny">
        <el-form  ref="questionanswer" :model="questionanswer" :rules="consumerules" label-width="80px">
          <el-form-item label="会员姓名">
            <div class="data-item-data1">{{questionanswer.name}}</div>
          </el-form-item>
          <el-form-item label="会员的疑问">
            <div class="data-item-data1">{{questionanswer.content}}</div>
          </el-form-item>
          <el-form-item label="会员手机号">
            <div class="data-item-data1">{{phoneforpc}}</div>
          </el-form-item>
          <el-form-item label="会员微信号">
            <div class="data-item-data1">{{questionanswer.wechatid}}</div>
          </el-form-item>
          <el-form-item label="提问时间">
            <div class="data-item-data1">{{questionanswer.questiontime}}</div>
          </el-form-item>
          <el-form-item label="我的回答">
            <el-input type="textarea" :maxlength="100" v-model="questionanswer.answercontent" @input="descInput" placeholder="请在此处输入您的回答"></el-input>
          </el-form-item>
          <div style="float:right;"><span class="contentcount">{{remnant}}</span>/100</div>
        </el-form>       
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false;questionanswer.answercontent='';">取 消</el-button>
          <el-button type="primary" @click="confirmAnswer">提交答案</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="查看详情"
        :visible.sync="detailDialogVisible"
        size="tiny">
        <el-form  ref="questiondetail" :model="questiondetail" label-width="80px">
          <el-form-item label="会员userid" v-show="false">
            <el-input v-model="questiondetail.userid"></el-input>
          </el-form-item>
          <el-form-item label="会员姓名">
            <div class="data-item-data1">{{questiondetail.name}}</div>
          </el-form-item>
          <el-form-item label="会员的疑问" style="word-break: break-all;">
            <div class="data-item-data1">{{questiondetail.content}}</div>
          </el-form-item>
          <el-form-item label="会员手机号">
            <div class="data-item-data1">{{phoneforpc}}</div>
          </el-form-item>
          <el-form-item label="会员微信号">
            <div class="data-item-data1">{{questiondetail.wechatid}}</div>
          </el-form-item>
          <el-form-item label="提问时间">
            <div class="data-item-data1">{{questiondetail.questiontime}}</div>
          </el-form-item>
          <el-form-item label="客服姓名">
            <div class="data-item-data1">{{questiondetail.answername}}</div>
          </el-form-item>
          <el-form-item label="客服回答" style="word-break: break-all;">
            <div class="data-item-data1">{{questiondetail.answer}}</div>
          </el-form-item>
          <el-form-item label="回答时间">
            <div class="data-item-data1">{{questiondetail.answertime}}</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialogVisible = false;">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {rootPath} from '../../config/apiConfig'
  var questionStatus = {"0":"未回答","1":"已回答"}
  export default {
    data() {
      return {
        adddialogVisible: false,
        remnant: 0,
        tableData: [],
        savedIndex: 0,
        detailDialogVisible: false,
        phoneforpc: '',
        questiondetail: {
          userid:'',
          name:'',
          content:'',
          phone: '',
          wechatid: '',
          questiontime:'',
          answername: '',
          answer:'',
          answertime:'',
        },
        questionanswer: {
          name:'',
          content:'',
          phone: '',
          wechatid: '',
          questiontime:'',
          answercontent:''
        },
        consumerules: {
          answercontent: [
            { required: true, message: '请输入答案内容', trigger: 'blur' }
          ],
          checked: true
        }
      }
    },
    created() {
      this.refreshData();
    },
    methods: {
      descInput(){
       var txtVal = this.questionanswer.answercontent.length;
       if(txtVal>100){
        this.remnant = 100;
       }else{
        this.remnant = txtVal;
       }
      },
      lookAnswerDetail(index,rows){
        this.detailDialogVisible = true;
        var that = this;
        var row = rows[index];
        this.questiondetail.userid = row.userid;
        this.questiondetail.name = row.questionname;
        this.questiondetail.content = row.questioncontent;
        this.phoneforpc = row.phone ==''?"未填写":row.phone;
        this.questiondetail.phone = row.phone == '' || row.phone == null ? "": row.phone;
        this.questiondetail.wechatid = row.wechatid =='' || row.wechatid == null?"未填写":row.wechatid;
        this.questiondetail.questiontime = row.questiontime;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/question/detail',
          params: {
            userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            questionid: row.questionid
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData;
            this.questiondetail.answer = data.answercontent;
            this.questiondetail.answertime = data.answertime;
            this.questiondetail.answername = data.answername;
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
      clickAdd(index,rows){
        this.adddialogVisible = true;
        var that = this;
        var row = rows[index];
        this.questionanswer.questionid = row.questionid;
        this.questionanswer.name = row.questionname;
        this.questionanswer.content = row.questioncontent;
        this.phoneforpc = row.phone ==''?"未填写":row.phone;
        this.questionanswer.phone = row.phone == '' || row.phone == null ? "": row.phone;
        this.questionanswer.wechatid = row.wechatid =='' || row.wechatid == null?"未填写":row.wechatid;
        this.questionanswer.questiontime = row.questiontime;
      },
      confirmAnswer() {
        var that = this;
        this.$refs.questionanswer.validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/question/answer',
              params: {
                questionid: this.questionanswer.questionid,
                userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                content: this.questionanswer.answercontent,
                phone: this.questionanswer.phone
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.adddialogVisible = false;
                this.$message({
                  message: "您已回答会员"+this.questionanswer.name+"的问题",
                  type: 'success'
                });
                this.refreshData();
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
      refreshData() {
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/question/getall',
          params: {
            userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.allQuestion;
            for (var i = 0; i < data.length; i++) {
              data[i].statusName = questionStatus[data[i].status];
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
        });
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .data-item-data1
    font-size: 14px;
    margin-top: 0px;
    color: #000;
  .page-title {
    border-left 3px solid #699fff;
    text-indent 8px;
    font-family "Microsoft YaHei"
    font-size 18px
  }
  #page-title{
    margin-bottom 0
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
