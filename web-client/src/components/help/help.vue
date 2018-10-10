<template>
  <div class="page-wrapper">
    <div class="page-title">帮助说明</div>
    <el-tabs v-model="activeName2" type="card">
      <el-tab-pane label="升级方式" name="first" class="textcon">
        <h1 style="font-size: larger;margin-bottom: 10px;margin-top: 10px">代理等级</h1>
        <p>一、金牌代理（金牌特权：自购、回收）</p>
        <p>二、银牌代理</p>
        <p>三、铜牌代理</p>
        <p>四、普通代理</p>
        <h1 style="font-size: larger;margin-bottom: 10px;margin-top: 10px">升级方式</h1>
        <p>处理订单中一次性拿货40盒升为金牌</p>
        <p>处理订单中一次性拿货20盒升为银牌</p>
        <p>处理订单中一次性拿货10盒升为铜牌</p>

        <h1 style="font-size: larger;margin-bottom: 10px;margin-top: 10px">购买</h1>
        <p>购买的数量根据代理账户等级是固定的</p>
        <p>例如：金牌代理会员每次购买40盒</p>
        <p>银牌代理每次购买20盒</p>
        <p>铜牌代理每次购买10盒</p>
        <p>普通代理每次购买5 盒</p>
        <h1 style="font-size: larger;margin-bottom: 10px;margin-top: 10px">自购（暂未开通）</h1>
        <p>金牌会员可以普通会员身份在任意下级代理下购买货物，帮助下级代理升级，享受更高折扣、赚取更多利润，提高团队质量。</p>
        <h1 style="font-size: larger;margin-bottom: 10px;margin-top: 10px">回收（暂未开通）</h1>
        <p>抢售条件：</p>
        <p>（一）必须成为金牌会员</p>
        <p>（二）完成一次自购可参加一次回收。回收卖出的价格为原价0.6折</p>
        <p>（三）成为金牌首次回收的数量为（一级代理5盒  二级代理15盒 三级代理及以下20盒），之后回收统一为5盒。</p>
        <p>（四）因下级未处理订单被封号，订单上移，因此产生的多余库存数量，享受特殊回收。</p>
      </el-tab-pane>
      <el-tab-pane label="会员制度" name="second" class="textcon">
        <h1 style="font-size: larger;margin-top: 10px;margin-bottom: 10px;">一、如何盈利</h1>
        <p>1、推广费：推广好友扫码成为会员，每人每线最高可获得23元广告费（例：1级代理会员10元，2级代理会员8元、3级代理5元）</p>
        <p>2、效益分红：代理或匹配购买产品发起者，他的上级代理平均分效益分红。</p>
        <p>3、销售收益：代理需要买货找上级代理拿货，根据代理身份级别产产生差价，级别越高折扣越高（例：金牌会员享5折优惠，银牌会员享6折优惠铜牌会员享7折优惠）</p>
        <h1 style="font-size: larger;margin-top: 10px;margin-bottom: 10px;">二、如何提现</h1>
        <p>1、广告费提现：推广好友注册，72小时内账号无待处理订单可提现，有待处理订单，处理后可提现。</p>
        <p>2、效益分红：每月至少完成一次购买，或处理一笔订单，即可实时提现，当月未完成此要当月分红清零。</p>
        <p>3、销售收益：实时提现。</p>
        <h1 style="font-size: larger;margin-top: 10px;margin-bottom: 10px;">三、惩罚制度</h1>
        <p>1、系统中待处理订单第一次24小时内未处理，冻结账号，需联系客服解封。第二次24小时内未处理订单永久封号。48小时未处理，直接永久封号除名。</p>
        <p>2、严禁线下低于统一零售价格（280.00）出售。一经发现扣除当月效益分红。超过两次永久封号除名。</p>
        <p>3、会员享受保护制度，每个账号是唯一认证方式，严禁线下串货。</p>
        <br>
        <br>
        <h1 style="font-size: large;margin-top: 10px;margin-bottom: 10px;">申请提现时间为法定工作日8：00-18：00（需人工审核操作）</h1>
        <h1 style="font-size: large;margin-top: 10px;margin-bottom: 10px;">申请提货时间为法定工作日8：00-18：00（需人工审核操作）</h1>
        <h1 style="font-size: large;margin-top: 10px;margin-bottom: 10px;">匹配时间：不定时间（根据营销系统自动）</h1>
        <h1 style="font-size: large;margin-top: 10px;margin-bottom: 10px;">客服咨询时间：法定工作日8：30-17：00</h1>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type='text/ecmascript-6'>
  import proddetail from '../proddetail/proddetail.vue'
  import {rootPath} from '../../config/apiConfig'

  export default {
    data() {
      return {
        activeName2: 'first'
      }
    },
    methods: {
      handleClick(index, rows) {
        this.dialogTableVisible = true;
        this.index = index;
        this.fromwho = this.tableData ? this.tableData[index].username : '';
      },
      closeDialog() {
        this.dialogTableVisible = false;
      },
      startSelfbuy() {
        var that = this;
        var params = {
          applyuserId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
          beapplieduserId: that.tableData[that.index].userid,
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

  .textcon p {
    margin-top: 5px;
    margin-bottom: 5px;
    color: #2c3e50;
    text-indent 2em
  }

</style>
