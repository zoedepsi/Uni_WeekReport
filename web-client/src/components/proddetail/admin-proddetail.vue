<template>
  <div class="page-wrapper">
    <div class="page-title">商品购买</div>
    <div class="prods-wrapper">
      <el-row>
        <el-col :span="8" :offset="1">
          <img src="../../assets/chongdian.jpg" style="width:350px;border:1px solid #ccc;">
        </el-col>
        <el-col :span="13" :offset="2">
          <div class="prodName">精品莜麦糊</div>
          <div class="prodPrice">¥ {{price}}
          </div>
          <div class="prodAmount">商品库存充足</div>
          <el-form ref="buyform" :model="buyform" class="buyform">
            <el-form-item label="购买数量" prop="count">
              <el-select v-model="buyform.count">
                <el-option v-for="item in counts" :label="item.label" :value="item.value" :key="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>向谁购买：{{fromwho}}</span>
              <el-tree :data="treeTableData" :load="loadNode" :default-expand-all="true" :expand-on-click-node="false" :highlight-current="true" @current-change="nodeSelect" lazy>
              </el-tree>
            </el-form-item>
            <el-table :data="tableData" stripe style="width: 100%;margin-top:30px;">
              <el-table-column prop="productname" label="产品名称" width="100">
              </el-table-column>
              <el-table-column prop="count" label="数量" width="100">
              </el-table-column>
              <el-table-column prop="total" label="总金额" width="100">
              </el-table-column>
              <el-table-column prop="status" label="处理状态" width="100">
              </el-table-column>
              <el-table-column prop="createtime" label="创建时间">
              </el-table-column>
            </el-table>
            <el-form-item class="formBtnGroup">
              <el-button type="primary" size="large" style="width:150px;height:50px;margin-top: 30px;" @click="apply">
                发起购买
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from '../../config/apiConfig'
export default {

  data() {
    return {
      buyform: {
        count: 5
      },
      counts: [
        {
          label: '5',
          value: 5,
        }, {
          label: '10',
          value: 10,
        }, {
          label: '20',
          value: 20,
        }, {
          label: '40',
          value: 40,
        },
      ],
      price: 0,
      userlist: [],
      fromwho: '',
      treeTableData: [],
      tableData: [],
      superiorId: "",
    }
  },
  created: function() {
    var that = this;
    var params = {
      userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
    }
    that.axios({
      method: 'post',
      url: rootPath + '/dbs/applybuy/admingetallcommonuser',
      params: params
    }).then((response) => {
      if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
        that.userlist = response.data.returnData.bizReturnData.userlist;
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
    this.axios({
      method: 'post',
      url: rootPath + '/dbs/user/getproductprice',
    }).then((response) => {
      if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
        var data = response.data.returnData.bizReturnData;
        that.price = data.price;
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
    nodeSelect(data) {
      this.superiorId = data.userid;
      this.refreshData();
    },
    loadNode(node, resolve) {
      if (node.level == 0) {
        var myinfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        var myuserid = myinfo.userid;
        return resolve([{ label: "全部会员 (All)", userid: "*" }])
      } else {
        var node_userid = node.data.userid;
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/user/getmysubordinate',
          params: {
            userId: node_userid
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var userlist = response.data.returnData.bizReturnData.userlist;
            if (userlist.length != 0) {
              var returnData = [];
              for (var i = 0; i < userlist.length; i++) {
                var thisuesr = userlist[i];
                var userObj = {
                  label: thisuesr.truename + " (" + thisuesr.username + ") [" + node.level + "级下线会员]",
                  userid: thisuesr.userid
                }
                returnData.push(userObj);
              }
              return resolve(returnData);
            } else {
              if (node.level == 1) {
                this.alertVisible = true;
              }
              return resolve([]);
            }
          }
          else {
            this.$message({
              message: "系统请求发生错误",
              type: 'error'
            });
          }
        }
          );
      }
    },
    refreshData() {
      var that = this;
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/applybuy/getallapplybuytouser',
        params: {
          applyUserId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          beAppliedUserId: this.superiorId
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var data = response.data.returnData.bizReturnData.applylist;
          for (let i = 0, len = data.length; i < len; i++) {
            switch (data[i].status) {
              case '0':
                data[i].status = '申请中';
                break;
              case '1':
                data[i].status = '完成';
                break;
              case '2':
                data[i].status = '已取消';
                break;
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
      });
    },
    apply() {
      var params = {
        userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
        count: this.buyform.count,
        productId: 1,
        beAppliedUser: this.superiorId,//be applied user
      }
      this.axios({
        method: 'post',
        url: rootPath + '/dbs/applybuy/adminsponsor',
        params: params
      }).then((response) => {
        if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
          this.$message({
            message: '商品购买成功！请等待上级处理。',
            type: 'success'
          });
          this.refreshData();
        } else if (response.data && response.data.returnData) {
          this.$message({
            message: response.data.returnData.bizReturnMessage,
            type: 'error'
          });
        } else {
          this.$message({
            message: '发生未知错误',
            type: 'error'
          });
        }
        this.registering = false;
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
