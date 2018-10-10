<template>
    <div class="page-wrapper">
        <div class="page-title">
            <span>货款明细</span>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="standingid" label="明细编号">
            </el-table-column>
            <el-table-column prop="total" label="变动数量">
            </el-table-column>
            <el-table-column prop="type" label="变动类型">
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间">
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
                type:'0'
            }
            that.axios({
                method: 'post',
                url: rootPath + '/dbs/withdrawals/getwithdrawalstand',
                params: params
            }).then((response) => {
                if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
                    var sslist = response.data.returnData.bizReturnData.list;
                    if(sslist && sslist.length){
                        for(let i=0; i<sslist.length; i++){
                            switch(sslist[i].type){
                                case '0': sslist[i].type = '充值增加货款'; break;
                                case '1': sslist[i].type = '注册奖励'; break;
                                case '2': sslist[i].type = '货款体现'; break;
                                case '21': sslist[i].type = '共享金提现'; break;
                                case '22': sslist[i].type = '注册奖励提现'; break;
                                case '3': sslist[i].type = '买货扣除货款'; break;
                                case '4': sslist[i].type = '卖货增加货款'; break;
                                case '5': sslist[i].type = '得共享金'; break;
                                case '6': sslist[i].type = '取消购买'; break;
                                case '7': sslist[i].type = '取消货款提现'; break;
                                case '71': sslist[i].type = '取消共享金提现'; break;
                                case '72': sslist[i].type = '取消注册奖励提现'; break;
                                case '8': sslist[i].type = '抢购'; break;
                                case '9': sslist[i].type = '管理员调整共享金'; break;
                                case '10': sslist[i].type = '管理员调整注册奖励'; break;
                            }
                        }
                    }
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
