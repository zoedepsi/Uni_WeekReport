<template>
  <div class="content">
    <div class="header-wrapper">
      <div class="logo">
      </div>
      <div class="merinfo">
        <img src="../../assets/avatar.jpg" width="40" height="40" alt="">
        <p>admin</p>
      </div>
      <div class="close">
        <router-link to="/login">退出</router-link>
      </div>
      <div class="userinfo">管理员</div>
    </div>

    <div class="content-wrapper">
      <div class="menu-wrapper">
        <el-col :span="24">
          <el-menu default-active="v-index" class="" theme="dark" @select="changeTab" style="margin-bottom: 100px;">
            <el-menu-item v-for="item in menuItems" :index="'v-'+item.permissionid" :key="item.permissionid" >{{ item.permissionname }}</el-menu-item>
            <el-menu-item index="v-index">我的工作台</el-menu-item>
            <!-- <el-menu-item index="v-vipconsumelog">会员消费录入</el-menu-item> -->
            <!-- <el-menu-item index="v-vipconsume">消费明细</el-menu-item> -->
            <!-- <el-menu-item index="v-vip">会员管理</el-menu-item> -->
            <el-menu-item index='v-dealwithdraw'>周报填写</el-menu-item>
            <el-menu-item index="v-adminmanage">周报查询</el-menu-item>
            <el-menu-item index="v-productmanage">问卷录入</el-menu-item>
            <!-- <el-menu-item index="v-quastionanswer">用户咨询</el-menu-item> -->
          </el-menu>
        </el-col>
      </div>
      <div class="detail-wrapper">
        <component v-bind:is="currentView" v-on:changeCurrentView="changeView">
        </component>
      </div>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
import index from "../index/admin-index.vue";
import mall from "../mall/mall.vue";
import vipconsumelog from "../vipconsumelog/vipconsumelog.vue";
import vipconsume from "../vipconsume/vipconsume.vue";
import adminproddetail from "../proddetail/admin-proddetail.vue";
import adminapplydeal from "../applydeal/admin-applydeal.vue";
import userinfo from "../userinfo/userinfo.vue";
import settings from "../settings/settings.vue";
import { rootPath } from "../../config/apiConfig";
import selfbuy from "../selfbuy/selfbuy.vue";
import getgoods from "../getgoods/getgoods.vue";
import withdraw from "../withdraw/withdraw.vue";
import dealwithdraw from "../dealwithdraw/dealwithdraw.vue";
import sendgoods from "../sendgoods/sendgoods.vue";
import admindealrushbuy from "../dealrushbuy/admin-dealrushbuy.vue";
import admindealrushbuy1 from "../dealrushbuy/admin-dealrushbuy1.vue";
import admindealrushbuy2 from "../dealrushbuy/admin-dealrushbuy2.vue";
import sysconfig from "../sysconfig/sysconfig.vue";
import dealcharge from "../dealcharge/dealcharge.vue";
import vip from "../vip/vip.vue";
import virtualuser from "../virtualuser/virtualuser";
import adminmanage from "../adminmanage/adminmanage.vue";
import productmanage from "../productmanage/productmanage.vue";
import quastionanswer from "../quastionanswer/quastionanswer.vue";
import standingdetail from "../standingdetail/standingdetail.vue";

export default {
  data() {
    return {
      menuItems: [],
      rights: {
        index: "我的工作台",
        vipconsumelog: "会员消费录入",
        vipconsume: "消费明细",
        vip: "会员管理",
        dealwithdraw: "美丽基金使用申请",
        standingdetail: "美丽基金明细",
        adminmanage: "系统用户管理",
        productmanage: "商品管理",
        quastionanswer: "用户咨询"
      },
      currentView: "v-index"
    };
  },
  methods: {
    changeTab: function(key, keyPath) {
      this.currentView = key;
    },
    changeView(key) {
      this.currentView = key;
    },
    getUserMenu() {
      var roleId = JSON.parse(window.sessionStorage.getItem("userInfo"))
        .usertype;
      this.axios({
        method: "post",
        url: rootPath + "/gold/permission/getbyroleid",
        params: {
          roleId: roleId
        }
      }).then(response => {
        if (
          response.data &&
          response.data.isSucceed &&
          response.data.returnData.bizIsSucceed
        ) {
          this.menuItems = response.data.returnData.bizReturnData.list;
          console.log(response.data.returnData.bizReturnData);
        } else if (response.data == undefined) {
          this.$message({
            message: "系统请求发生错误",
            type: "error"
          });
        } else if (response.data.isSucceed == false) {
          this.$message({
            message: response.data.returnMessage,
            type: "error"
          });
        } else {
          this.$message({
            message: response.data.returnData.bizReturnMessage,
            type: "error"
          });
        }
      });
    }
  },
  created() {
    // this.getUserMenu();
  },
  components: {
    "v-vipconsumelog": vipconsumelog,
    "v-vipconsume": vipconsume,
    "v-index": index,
    "v-mall": mall,
    "v-adminproddetail": adminproddetail,
    "v-adminapplydeal": adminapplydeal,
    "v-userinfo": userinfo,
    "v-settings": settings,
    "v-selfbuy": selfbuy,
    "v-getgoods": getgoods,
    "v-withdraw": withdraw,
    "v-dealwithdraw": dealwithdraw,
    "v-dealcharge": dealcharge,
    "v-sendgoods": sendgoods,
    "v-admindealrushbuy": admindealrushbuy,
    "v-admindealrushbuy1": admindealrushbuy1,
    "v-admindealrushbuy2": admindealrushbuy2,
    "v-sysconfig": sysconfig,
    "v-vip": vip,
    "v-virtualuser": virtualuser,
    "v-adminmanage": adminmanage,
    "v-productmanage": productmanage,
    "v-quastionanswer": quastionanswer,
    "v-standingdetail": standingdetail
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.content {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: 'Microsoft YaHei';
  min-width: 1000px;

  .header-wrapper {
    width: 100%;
    height: 60px;
    background-color: #444;
    position: fixed;
    z-index: 10;
    top: 0;

    .logo {
      width: 200px;
      height: 60px;
      float: left;
      // background: url('../../assets/inner-logo.png') no-repeat;
    }

    .merinfo {
      height: 100%;
      width: 400px;
      float: left;
      line-height: 60px;

      img {
        display: block;
        float: left;
        margin: 10px 20px 0 30px;
        border-radius: 50%;
      }

      p {
        color: #fff;
      }
    }

    .userinfo, .close {
      float: right;
      height: 100%;
      line-height: 60px;
      margin-right: 20px;
      color: #fff;
    }

    .close {
      width: 50px;

      a {
        color: #fff;
      }
    }

    .userinfo {
      width: 100px;
    }
  }

  .content-wrapper {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
  }

  .menu-wrapper {
    width: 200px;
    height: 100%;
    background-color: #181D20;
    padding-right: 0px;
    padding-top: 20px;
    padding-bottom: 0px;
    padding-left: 0px;
    font-weight: lighter;
    float: left;
    position: fixed;
    overflow-y: scroll;
    z-index: 1001;

    .el-menu-item {
      background: #181D20;
      height: 50px;
    }
  }

  /* color #cccccc */
  .menu-wrapper::-webkit-scrollbar {
    width: 0px;
  }

  .detail-wrapper {
    flex: 1;
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
    bottom: 0;
    padding: 20px;
    overflow: auto;
    min-width: 600px;
  }

  .el-menu-item-group__title {
    padding-top: 0;
  }

  .el-submenu__title {
    height: 50px;
    background: #181D20;
  }
}

.detail-wrapper::-webkit-scrollbar {
  /* width: 0px; */
}
</style>
