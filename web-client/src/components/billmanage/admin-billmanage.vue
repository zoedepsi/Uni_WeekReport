<template>
  <div class="page-wrapper">
    <div class="page-title">我的订单</div>
    <div class="bills-wrapper">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="applyid"
          label="订购编号"
        >
        </el-table-column>
        <el-table-column
          prop="applyuserid"
          label="订购用户编号">
        </el-table-column>
        <el-table-column
          prop="count"
          label="订购数量">
        </el-table-column>
        <el-table-column
          prop="total"
          label="订购总额">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="订购时间">
        </el-table-column>
        <el-table-column v-if="false"
          prop="createtime"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,tableData)" type="text" size="small">取消订购</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  import proddetail from '../proddetail/proddetail.vue'
  import {rootPath} from '../../config/apiConfig'

  export default {
    data(){
      return {
        tableData: []
      }
    },
    created(){
      var that = this;
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/applybuy/admingetapplybuy',
        params: {
          userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
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
    data(){
      return {
        tableData: []
      }
    },
    methods: {
      handleClick(index,rows){
          var that=this;
          this.axios({
            method:'POST',
            url: rootPath + '/dbs/applybuy/cancelselfapplybuy',
            params:{
              userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
              applyBuyId:rows[index].applyid
            }
          }).then((response)=>{
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              this.$message({
                message: "取消成功",
                type: 'success'
              });
              this.axios({
                method: 'post',
                url: rootPath + '/dbs/applybuy/getsponsorapplybuy',
                params: {
                  userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                }
              }).then((response) => {
                if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
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
            }else if (response.data == undefined) {
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
          })
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

</style>
