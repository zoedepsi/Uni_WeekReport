<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">会员管理</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right" @click="addVip">添加会员</el-button>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%;">
        <el-table-column prop="userid" label="会员ID">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="nickname" label="微信昵称">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="balance" label="美丽基金">
        </el-table-column>
        <el-table-column prop="createtime" label="注册时间">
        </el-table-column>
        <el-table-column prop="statusName" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isactive == '1'" close-transition>正常</el-tag>
            <el-tag type="danger" v-else close-transition>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="status">
          <template slot-scope="scope">

            <el-button @click="editUser(scope.row)" type="text" size="small" >编辑</el-button>
            <el-button @click="changeActive(scope.row,'0')" type="text" size="small" v-if="scope.row.isactive == '1'">禁用</el-button>
            <el-button @click="changeActive(scope.row,'1')" type="text" size="small" v-else>启用</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">邀请详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="会员邀请详情" v-model="detailDialogVisible" size="small">
        <div style="font-size:13px;margin-bottom: 10px; color: #888">点击会员前的小三角可展开当前会员分支。</div>
        <tree
          ref='tree'
          :treeData="treeData"
          :options="options"
          @node-click="itemClick"
        />
      </el-dialog>
      <el-dialog :title="vipDialogTitle" v-model="vipDialog" size="small" @close="resetForm('vipForm')">
        <el-form ref="vipForm" :model="vipForm" :rules="vipFormRules"  label-width="100px">
          <el-form-item label="用户ID" prop="userid" style="width:90%" v-if="vipDialogMode=='edit'">
            <el-input v-model="vipForm.userid" disabled></el-input>
          </el-form-item>
          <el-form-item label="会员姓名" prop="username" style="width:90%">
            <el-input v-model="vipForm.username"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" style="width:90%">
            <el-input v-model="vipForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="上级用户" prop="superUserName" style="width:60%">
            <el-input placeholder="请选择上级用户" v-model="vipForm.superUserName" readonly>
              <template slot="append"><el-button type="primary" icon="more" @click="chooseSuperUser"></el-button></template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark" style="width:90%">
            <el-input v-model="vipForm.remark"  type="textarea"
                      :rows="2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="vipDialog = false">取 消</el-button>
          <el-button type="primary" @click="doAddVip" v-if="vipDialogMode=='create'">添 加</el-button>
          <el-button type="primary" @click="doEditVip"  v-if="vipDialogMode=='edit'">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="上级会员选择" v-model="superUserChooseDialogVisible" size="large">
        <el-row style="margin-bottom:10px">
          <el-col :span="10">请双击选取上级会员</el-col>
          <el-col :span="4" :offset="10">
            <el-input
              placeholder="请输入手机号筛选"
              icon="search"
              v-model="phoneSearchStr"
              :on-icon-click="chooseSuperUser">
            </el-input>
          </el-col>
        </el-row>
          <el-table :data="SuperUserData" highlight-current-row style="width: 100%" @row-dblclick="superUserChoose" @current-change="handleSuperUserCurrentChange">
            <el-table-column property="userid" label="会员ID"></el-table-column>
            <el-table-column property="username" label="会员姓名"></el-table-column>
            <el-table-column property="phone" label="手机号码"></el-table-column>
            <el-table-column property="nickname" label="微信昵称"></el-table-column>
          </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="superUserChooseDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSuperUserSelected">选 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  import Vue from 'vue'
  import { rootPath } from '../../config/apiConfig'
  import Tree from '../tree/tree.vue';
  export default {
    data() {
      return {
        tableData: [],
        detailDialogVisible: false,
        superUserChooseDialogVisible:false,
        treeData:[],
        SuperUserData:[],
        currentSupeUser:null,
        options: {
          showCheckbox: false,
          halfCheck: false,//控制父框是否需要半钩状态
          lazy: true,
          load: this.loadingChild,
          showSearch: false,
        },
        vipDialog:false,
        vipDialogMode: '',
        vipDialogTitle:'',
        vipForm:{

        },
        vipFormRules:{

        },
        phoneSearchStr:''
      }
    },
    created() {
      this.refreshData();
    },
    components: {
      Tree
    },
    methods: {
      changeActive(data,to){
        var toname = to=="0"?"禁用":"启用";
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/user/changeuseractive',
          params: {
            thisUserId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            userId: data.userid,
            type:to
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            that.$message({
              message: "用户"+toname+"成功",
              type: 'success'
            });
            this.refreshData();
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
      editUser(data){
        this.vipDialogMode = "edit";
        this.vipDialogTitle = "会员编辑";
        this.vipDialog = true;
        this.vipForm = deepCopy(data);
        this.vipForm.superUserName = deepCopy(data).superusername;
        this.vipForm.superUser = deepCopy(data).superuserid;
      },
      superUserChoose(row,event){
        this.vipForm.superUser = row.userid;
        this.vipForm.superUserName = row.username || row.nickname;
        this.superUserChooseDialogVisible = false;
      },
      chooseSuperUser(){
        if(!this.superUserChooseDialogVisible){
          this.phoneSearchStr = '';
        }
        this.axios({
          method: 'post',
          url: rootPath + '/gold/user/getallsupercustomer',
          params: {
            thisUserId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
            userId: this.vipForm.userid ||'',
            phone: this.phoneSearchStr || '',
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
           this.SuperUserData = response.data.returnData.bizReturnData.allUserInfo;
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
        this.currentSupeUser = null;
        this.superUserChooseDialogVisible = true;

      },
      doAddVip(){
        var that = this;
        this.$refs['vipForm'].validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/user/adduser',
              params: {
                userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                name: that.vipForm.username,
                phone: that.vipForm.phone,
                superUser: that.vipForm.superUser || "",
                remark: that.vipForm.remark || "",
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.$message({
                  message: "会员添加成功",
                  type: 'success'
                });
                that.vipDialog = false;
                this.refreshData();
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
          }
        });
      },
      doEditVip(){
        var that = this;
        this.$refs['vipForm'].validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/user/changeuserinfo',
              params: {
                thisUserId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                userId:that.vipForm.userid,
                name: that.vipForm.username,
                phone: that.vipForm.phone,
                superUser: that.vipForm.superUser || "",
                remark: that.vipForm.remark || "",
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.$message({
                  message: "会员信息修改成功",
                  type: 'success'
                });
                that.vipDialog = false;
                this.refreshData();
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
          }
        });
      },
      addVip(){
        this.vipDialogMode = "create";
        this.vipDialogTitle = "创建会员";
        this.vipForm={

        };
        this.vipDialog = true;
      },
      editVip(data){
        this.vipDialogMode = "edit";
        this.vipDialogTitle = "系统用户编辑";
        this.vipDialog = true;
        this.vipForm = deepCopy(data);
      },
      detail(data){
        this.detailDialogVisible = true;
        this.initTree(data);
      },
      initTree(data){
        console.log("data");
        console.log(data);
        let treeData = [
          {
            id: data.userid,
            label: data.username || data.nickname,
            userid:data.userid,
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
          var param = {
            "userid": node.userid,
              "type": 1
          };
          this.axios({
            method: 'post',
            url: rootPath + '/gold/user/getmycustomer',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data:param,
            params:param
          }).then((response) => {
            var userlist = response.data.returnData.bizReturnData.users;

            if (userlist.length != 0) {
              for (var i = 0; i < userlist.length; i++) {
                var thisuesr = userlist[i];
                var userObj = {
                  "id": i+1,
                  "label": thisuesr.username || thisuesr.nickname,
                  "userid": thisuesr.userid,
                  "checked": false,
                  "nodeSelectNotAll": false,
                  "parentId": null,
                  "visible": true,
                  "searched": false
                }
                returnData.push(userObj);
              }
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
            }
          });
        } catch (e) {
          Promise.reject(e);
        }
      },
      itemClick (node) {
        this.superiorId = node.userid;
        this.refreshData();
      },

      nodeSelect(data){
        this.superiorId = data.userid;
        this.refreshData();
      },
      loadNode(node, resolve) {
        if (node.level == 0) {
          var myinfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          var myuserid = myinfo.userid;
          return resolve([{label: "全部会员 (All)", userid: "*"}])
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
          url: rootPath + '/gold/user/admingetallcustomer',
          params: {
            userid: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.allUserInfo;
            for(var i = 0 ; i <data.length ; i++){
              if(data[i].isactive == "1"){
                data[i].statusName = "正常";
              }else{
                data[i].statusName = "停用";
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
      resetPassword(row) {
        var that = this;
        this.$confirm('确定将' + row.truename + '(' + row.phone + ')的登录密码重置为123456？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.axios({
            method: 'post',
            url: rootPath + '/dbs/user/adminresetpassword',
            params: {
              userId: (JSON.parse(window.sessionStorage.getItem("userInfo"))).userid,
              changeUserId: row.userid
            }
          }).then((response) => {
            if (response.data && response.data.returnData && response.data.returnData.bizIsSucceed) {
              that.$message({
                message: '已成功将' + row.truename + '(' + row.phone + ')的登录密码重置为123456',
                type: 'success'
              });
            } else {
              that.$message({
                message: '系统请求异常，请稍后重试',
                type: 'error'
              });
            }
          });
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleSuperUserCurrentChange(val){
        this.currentSupeUser = val;
        console.log(val);
      },
      onSuperUserSelected(){
        if(this.currentSupeUser == null){
          this.$message.error("请先选择上级用户");
        }else{
          this.superUserChoose(this.currentSupeUser);
        }
      }
    }
  }
  function deepCopy(source){
    var result={};
    for (var key in source) {
      if(source[key] == null){
        result[key]="";
      }else{
        result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
      }

    }
    return result;
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .page-title {
    border-left 3px solid #699fff;
    text-indent 8px;
    font-family "Microsoft YaHei"
    font-size 18px

  }
  #vip-title{
    margin-bottom 0
  }
  .bills-wrapper {
    float left;
    width: 99%;
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
