<template>
  <div class="page-wrapper">
    <div class="page-title">会员自购</div>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="userid" label="用户ID">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="truename" label="真实姓名">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,tableData)" type="text" size="small">发起自购</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="自购信息" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="12">
          <el-form label-width="100px">
            <el-form-item label="向谁自购:">
              <el-input :readonly="true" v-model="fromwho" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="数量:">
              <el-input :readonly="true" value="5" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="startSelfbuy">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import proddetail from '../proddetail/proddetail.vue'
import { rootPath } from '../../config/apiConfig'

export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      index: 0,
      fromwho:'',
    }
  },
  created() {
    var that = this;
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/applybuy/getselfbuyuserlist',
      params: {
        userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
      }
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        that.tableData = response.data.returnData.bizReturnData.applyuserlist;
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
  methods: {
    handleClick(index, rows) {
      this.dialogTableVisible = true;
      this.index = index;
      this.fromwho = this.tableData?this.tableData[index].username:'';
    },
    closeDialog() {
      this.dialogTableVisible = false;
    },
    startSelfbuy() {
      var that = this;
      var params = {
        applyuserId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        beapplieduserId:that.tableData[that.index].userid,
        count: '5',
        productId: '1',
      }
      that.axios({
        method: 'post',
        url: rootPath + '/dbs/applybuy/sponsorselfbuy',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          that.$message({
            message: '商品自购成功！请等待处理。',
            type: 'success'
          });
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
      that.dialogTableVisible = false;
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
