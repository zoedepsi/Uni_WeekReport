<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>推广费提取</span>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="advertisingid" label="推广编号">
      </el-table-column>
      <el-table-column prop="invitedtruename" label="被邀请人">
      </el-table-column>
      <el-table-column prop="advertisingtotal" label="推广费（元）">
      </el-table-column>
      <el-table-column prop="getstatus" label="提取状态">
      </el-table-column>
      <el-table-column prop="createtime" label="推广时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  @click="handleClick(scope.$index,tableData)" :disabled="tableData[scope.$index].status != '0'" type="text" size="small">提取
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type='text/ecmascript-6'>
  import { rootPath } from '../../config/apiConfig'
  export default {
    data() {
      return {
        tableData: [],
      }
    },
    created() {
      this.getHistList();
    },

    methods: {
      handleClick(index,rows){
        var that = this;
        var row = rows[index];
        var advertisingId = row.advertisingid;
        this.$confirm('确认提取推广费 '+ row.advertisingtotal +' 元？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
            advertisingId:advertisingId
          }
          that.axios({
            method: 'post',
            url: rootPath + '/dbs/advertisingfee/extract',
            params: params
          }).then((response) => {
            if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '推广费提取成功',
                type: 'success'
              });
              that.getHistList();
            } else {
              that.$message({
                message: '推广费提取失败',
                type: 'error'
              });
            }
          });
        })
      },
      getHistList() {
        var that = this;
        var params = {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
          type:'2'
        }
        that.axios({
          method: 'post',
          url: rootPath + '/dbs/advertisingfee/get',
          params: params
        }).then((response) => {
          if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
            var alist = response.data.returnData.bizReturnData.advertislist;
            for(var i in alist){
              if(alist[i].status =="0"){
                alist[i].getstatus = "待提取";
              }else if(alist[i].status =="1"){
                alist[i].getstatus = "已提取";
              }else{
                alist[i].getstatus = "未知";
              }
            }
            that.tableData = alist;
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
