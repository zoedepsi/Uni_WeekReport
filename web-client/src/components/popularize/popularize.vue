<template>
  <div class="page-wrapper">
    <div class="page-title">
      <span>推广邀请</span>
    </div>
    <el-card style="margin-bottom:30px;" :body-style="{'background':'#f8f8f8'}">
      <el-row style="height: 40px;line-height: 40px">
        <el-col :span="24" style="line-height: 40px">
          我的邀请链接
        </el-col>
      </el-row>
      <el-row>
        <el-input v-model="myInviteLink" auto-complete="off" placeholder="身份证号"
                  type="text" :readonly="true" :id="'myInviteLink'"></el-input>
      </el-row>
      <el-row style="margin-top: 10px;text-align: right">
        <el-button type="primary" @click="copyUrl">复制邀请链接</el-button>
      </el-row>
    </el-card>
    <el-row style="height: 40px;line-height: 40px">
      <el-col :span="24" style="line-height: 40px">
        我的邀请成功记录
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="truename" label="用户姓名">
      </el-table-column>
      <el-table-column prop="username" label="用户编码">
      </el-table-column>
      <el-table-column prop="isteam" label="是否形成团队">
      </el-table-column>
      <!--<el-table-column prop="status" label="状态">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="createtime" label="时间">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="remark" label="备注">-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script type='text/ecmascript-6'>
  import { rootPath } from '../../config/apiConfig'
  export default {

    data() {
      return {
        myInviteLink:'',
        tableData: []
      }
    },
    created() {
      var regcode = (JSON.parse(window.sessionStorage.getItem("userInfo"))).registercode;
      var inviteUrl=window.location.protocol+"//"+window.location.host+"/#/invite#"+regcode;
      this.myInviteLink = inviteUrl;

      this.axios({
        method: 'post',
        url: rootPath + '/dbs/user/getmysubordinate',
        params: {
          userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid
        }
      }).then((response) => {
        if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
          var userlist = response.data.returnData.bizReturnData.userlist;
          for(var i in userlist){
            if(userlist[i].ifSpread){
              userlist[i].isteam="是"
            }else{
              userlist[i].isteam="否"
            }
          }
          this.tableData = userlist;
        }
      })
    },

    methods: {
      copyUrl(){
        if (this.myInviteLink != null && this.myInviteLink !="") {
          if (document.queryCommandSupported("copy")) {
            var myInviteLinkStr = document.getElementById("myInviteLink").firstChild.nextSibling.nextSibling;
            myInviteLinkStr.focus();
            myInviteLinkStr.select();
            document.execCommand("copy");
            this.$notify({
              title: '复制成功',
              message: '邀请链接已经成功复制至剪贴板，请粘贴给他人进行注册。',
              type: 'success'
            });
          } else {
            this.$notify({
              title: '复制失败',
              message: '您的浏览器不支持自动复制，请您手动复制。',
              type: 'error'
            });
          }
        } else {
          this.$notify({
            title: '复制失败',
            message: '邀请链接为空，复制失败。',
            type: 'error'
          });
        }
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

  .payPic
    display block
    position: absolute
    left 400px
    top 50px
    border 0


</style>
