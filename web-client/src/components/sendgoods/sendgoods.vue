<template>
  <div class="page-wrapper">
    <div class="page-title">发货列表</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="serialno" label="序列号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="电话">{{}}
        </el-table-column>
        <el-table-column prop="num" label="数量">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="type" label="发货类型">
        </el-table-column>
        <el-table-column prop="shipmentsstatus" label="发货状态">
        </el-table-column>
        <el-table-column label="操作" prop="status">
          <template slot-scope="scope">
            <el-button :disabled="tableData[scope.$index].shipmentsstatus!='未发货'" @click="complete(scope.$index)" type="text" size="small">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import proddetail from '../proddetail/proddetail.vue'
import { rootPath } from '../../config/apiConfig'

export default {
  data() {
    return {
      tableData: [],
    }
  },
  created() {
    var that = this;
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/pickupgoods/admingetshipments',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData.shipmentslist;
        data.sort(function(obj1, obj2){
          return obj1.shipmentsstatus - obj2.shipmentsstatus;
        });
        for (var i = 0; i < data.length; i++) {
          switch (data[i].shipmentsstatus) {
            case "0":
              data[i].shipmentsstatus = '未发货'
              break
            case "1":
              data[i].shipmentsstatus = "已发货"
              break
            case "2":
              data[i].shipmentsstatus = "已取消"
              break
          }
          switch (data[i].type) {
            case "0":
              data[i].type = '购买现货'
              break
            case "1":
              data[i].type = "提货申请"
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
  methods: {
    complete(index) {
      var that = this;
      var params = {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
        shipmentsId: that.tableData[index].shipmentsid,
      };
      that.axios({
        method: 'POST',
        url: rootPath + '/dbs/pickupgoods/admindealshipments',
        params: params,
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          that.$message({
            message: "成功",
            type: 'success'
          });
          that.tableData[index].shipmentsstatus = '已发货';
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
