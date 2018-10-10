<template>
  <div class="page-wrapper">
    <div class="page-title">我的团队NEW</div>
    <p style="font-size: 14px;margin-bottom: 20px">可点击下表按层级展开团队结构。</p>
    <p>我的团队</p>
    <tree
      ref='tree'
      :treeData="treeData"
      :options="options"
      @node-click="itemClick"

    />

    <el-alert title="团队未形成" type="warning" description="您暂无下级，未形成团队，请继续努力!" show-icon style="margin-bottom: 20px" v-if="alertVisible">
    </el-alert>


    <el-table :data="userList" stripe style="width: 100%;margin-top:30px;">
      <!--  <el-table-column prop="userid" label="会员编号">
                          </el-table-column> -->
      <el-table-column prop="truename" label="真实姓名">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="vipgrade" label="用户等级">
      </el-table-column>
      <el-table-column prop="createtime" label="创建日期">
      </el-table-column>
      <!--      <el-table-column prop="vipstatus" label="会员状态">
                          </el-table-column> -->
    </el-table>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Vue from 'vue'
  import { rootPath } from '../../config/apiConfig'
  import Tree from '../tree/tree.vue';
  export default {

    data() {
      var myinfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      return {
        tableData: [],
        userList: [],
        alertVisible: false,
        childCnt: 0,
        treeData: [],
        options: {
          showCheckbox: false,
          halfCheck: false,//控制父框是否需要半钩状态
          lazy: true,
          load: this.loadingChild,
          showSearch: false,
        },
      };
    },
    created() {

    },
    mounted: function () {
//      this.initTreeData();
      this.initTree();
    },
    components: {
      Tree
    },
    methods: {
      //初始化团队树
      initTree(){
        let userinfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let treeData = [
          {
            id: userinfo.userid,
            label: userinfo.username + " (我自己)",
            userid:userinfo.userid,
            open: false,
            checked: false,
            parentId: null,
            visible: true,
          }
        ]
        this.treeData = this.generateKey(treeData, 0);
      },
      generateKey (treeData = [], parentKey) {
        treeData = treeData.map((item, i) => {
          item.key = parentKey + '-' + i.toString();
          return item;
        })
        return treeData;
      },
      async loadingChild (node, index) {
        var that = this;
        try {
          let tem;
          let postions = node.key.split('-');
          var returnData = [];
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/user/getmysubordinate',
            params: {
              userId: node.userid
            }
          }).then((response) => {
            var userlist = response.data.returnData.bizReturnData.userlist;
            that.userList = [];
            if (userlist.length != 0) {
              for (var i = 0; i < userlist.length; i++) {
                var thisuesr = userlist[i];
                var userObj = {
                  label: thisuesr.truename + " (" + thisuesr.username + ") [" + node.level + "级下线][团队人数:" + (thisuesr.usercount + 1) + ']',
                  userid: thisuesr.userid,
                  checked: false,
                  searched: false,
                  visible: true
                }
                returnData.push(userObj);
              }
            }
          });


          for (let [index, item] of postions.entries()) {
            switch (index) {
              case 0:
                break;
              case 1:
                tem = this.treeData[item];
                break;
              default:
                tem = tem.children[item];
            }
          }
          // set Children
          Vue.set(tem, 'children', this.generateKey(returnData, node.key) );

          Promise.resolve(returnData);
        } catch (e) {
          Promise.reject(e);
        }
      },
      itemClick (node) {
        this.curChange(node);
      },

      /////////////////////////////////////////////////////
      getChildCnt() {
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/user/getmysubordinate',
          params: {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var ul = response.data.returnData.bizReturnData.userlist;
            for (var i = 0; i < ul.length; i++) {
              that.childCnt += ul[i].usercount;
            }
            that.childCnt += ul.length;
            //that.childCnt += 1;//self
            console.log(that.childCnt)
            //return that.getChildCnt;
          }
          else {
            this.$message({
              message: "系统请求发生错误",
              type: 'error'
            });
          }
        });
      },
      curChange(data) {
        var that = this;
        that.userList = [];
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/user/getmysubordinate',
          params: {
            userId: data.userid,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.userList = response.data.returnData.bizReturnData.userlist;
          }
          else {
            this.$message({
              message: "系统请求发生错误",
              type: 'error'
            });
          }
        });
        var params = {
          userId: data.userid,
          vipId: ''
        };
        this.axios({
          method: 'post',
          url: rootPath + '/dbs/user/getuserinfo',
          params: params
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            //console.log(response.data.returnData.bizReturnData)
            that.userList.push(response.data.returnData.bizReturnData);
            console.log('addself:' + that.userList)
            for (var i = 0, len = that.userList.length; i < len; i++) {
              switch (that.userList[i].vipgrade) {
                case "1":
                  that.userList[i].vipgrade = "金牌会员";
                  break;
                case "2":
                  that.userList[i].vipgrade = "银牌会员";
                  break;
                case "3":
                  that.userList[i].vipgrade = "铜牌会员";
                  break;
                case "4":
                  that.userList[i].vipgrade = "普通会员";
                  break;
                default:
                  that.userList[i].vipgrade = "未知";
                  break;
              }
            }
          }
          else {
            this.$message({
              message: "系统请求发生错误",
              type: 'error'
            });
          }
        });

        console.log('curChange');
        console.log(that.userList)
      },
      loadNode(node, resolve) {
        var that = this;
        if (node.level == 0) {
          var myinfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          var myuserid = myinfo.userid;
          this.axios({
            method: 'post',
            url: rootPath + '/dbs/user/getmysubordinate',
            params: {
              userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid
            }
          }).then((response) => {
            if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
              var ul = response.data.returnData.bizReturnData.userlist;
              for (var i = 0; i < ul.length; i++) {
                that.childCnt += ul[i].usercount;
              }
              that.childCnt += ul.length;
              return resolve([{ label: myinfo.truename + " (" + myinfo.username + ")[团队人数:" + (that.childCnt + 1) + ']', userid: myuserid }])
            }
            else {
              this.$message({
                message: "系统请求发生错误",
                type: 'error'
              });
            }
          });

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
                that.userList = [];
                var returnData = [];
                if (userlist.length != 0) {
                  for (var i = 0; i < userlist.length; i++) {
                    var thisuesr = userlist[i];
                    var userObj = {
                      label: thisuesr.truename + " (" + thisuesr.username + ") [" + node.level + "级下线][团队人数:" + (thisuesr.usercount + 1) + ']',
                      userid: thisuesr.userid
                    }
                    returnData.push(userObj);
                    that.childCnt += thisuesr.usercount;
                  }
                  that.childCnt += userlist.length;
                  that.userList = userlist;
                  for (var i = 0, len = that.userList.length; i < len; i++) {
                    switch (that.userList[i].vipgrade) {
                      case "1":
                        that.userList[i].vipgrade = "金牌会员";
                        break;
                      case "2":
                        that.userList[i].vipgrade = "银牌会员";
                        break;
                      case "3":
                        that.userList[i].vipgrade = "铜牌会员";
                        break;
                      case "4":
                        that.userList[i].vipgrade = "普通会员";
                        break;
                      default:
                        that.userList[i].vipgrade = "未知";
                        break;
                    }
                  }
                  console.log('loadNode');
                  console.log(that.userList)
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

      }
    }
  }
</script>
<link rel="stylesheet" href="../../node_modules/tree-component/tree.min.css" />
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
    padding-bottom: 20px;
    padding-left: 10px;
    -webkit-border-radius: 4px
    -moz-border-radius: 4px
    border-radius: 4px
    min-height: 30px
  }

  .title {
    margin-bottom 10px;
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
