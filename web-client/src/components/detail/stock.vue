<template>
    <div class="page-wrapper">
        <div class="page-title">
            <span>库存明细</span>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="standingid" label="明细编号">
            </el-table-column>
            <el-table-column prop="userid" label="用户ID">
            </el-table-column>
            <el-table-column prop="vipid" label="会员ID">
            </el-table-column>
            <el-table-column prop="productid" label="产品名称">
            </el-table-column>
            <el-table-column prop="updatetype" label="更新原因">
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <span>{{scope.row.updatetype==='买入'?'+'+scope.row.addcount:'-'+scope.row.deductcount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="更新类型">
            </el-table-column>
            <el-table-column prop="createtime" label="更新时间">
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
        getHistList() {
            var that = this;
            var params = {
                userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
                productId: '1'
            }
            that.axios({
                method: 'post',
                url: rootPath + '/dbs/user/getstockstanding',
                params: params
            }).then((response) => {
                if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
                    var sslist = response.data.returnData.bizReturnData.stockstandlist;
                    sslist.sort(function(obj1, obj2) {
                        var t1 = obj1.createtime,
                            t2 = obj2.createtime;
                        if (t1 > t2)
                            return 1;
                        else if (t1 < t2)
                            return -1;
                        return 0;
                    });
                    var len = sslist.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            sslist[i].productid = '1号产品';
                            switch (sslist[i].type) {
                                case '1':
                                    sslist[i].type = '发起购买';
                                    break;
                                case '2':
                                    sslist[i].type = '处理购买';
                                    break;
                                case '3':
                                    sslist[i].type = '发起自购';
                                    break;
                                case '4':
                                    sslist[i].type = '发起提货';
                                    break;
                            }
                            switch (sslist[i].updatetype) {
                                case '1':
                                    sslist[i].updatetype = '买入';
                                    break;
                                case '2':
                                    sslist[i].updatetype = '卖出';
                                    break;
                            }
                        }
                    }
                    sslist.sort(function(obj1, obj2) {
                        return obj1.createtime < obj2.createtime ? 1 : -1;
                    })
                    that.tableData = sslist;
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
