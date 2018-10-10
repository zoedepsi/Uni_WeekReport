<template>
  <div class="page-wrapper">
    <div class="page-title">我的订单</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="applyid" label="订购编号">
        </el-table-column>
        <el-table-column prop="productname" label="订购产品">
        </el-table-column>
        <el-table-column prop="count" label="订购数量">
        </el-table-column>
        <el-table-column prop="total" label="订购总额">
        </el-table-column>
        <el-table-column prop="createtime" label="订购时间">
        </el-table-column>
        <el-table-column prop="status" label="订购状态">
        </el-table-column>
                <el-table-column prop="ifspotgoods" label="是否现货">
        </el-table-column>
        <el-table-column prop="createtime" label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.ifspotgoods!='是'" @click="handleClick(scope.$index,tableData)" type="text" size="small">查看收货地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="收货地址列表" :visible.sync="dialogVisible" size="tiny">
        <el-row>
          <el-col :offset="1">
            <ul id="addrs">
              <li v-for="sp in sps">
                {{ sp.serialno}}.地址：{{sp.address}}，数量：{{sp.num}}
              </li>
            </ul>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
      sps: [],
      dialogVisible: false
    }
  },
  created() {
    var that = this;
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/applybuy/getsponsorapplybuy',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData.applylist;
        data.sort(function(obj1, obj2){
          return obj1.createtime < obj2.createtime;
        });
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
          data[i].ifspotgoods = (data[i].ifspotgoods==='1')?'是':'否';
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
    handleClick(index, rows) {
      this.sps = rows[index].shipments;
      this.dialogVisible = true;
    },
    handleClick1(index, rows) {
      var that = this;
      this.$confirm('继续取消订单您将失去赚取' + (40 * rows[index].count - rows[index].total) + '元利润的机会,是否确认取消？', '提示', {
        confirmButtonText: '确认取消',
        cancelButtonText: '暂不取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'POST',
          url: rootPath + '/dbs/applybuy/cancelselfapplybuy',
          params: {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            applyBuyId: rows[index].applyid
          }
        }).then((response) => {
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
          } else if (response.data == undefined) {
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

  #addrs{
    font-size:1.1em;
  }
  #addrs li{
    margin-bottom:10px;
  }
</style>
