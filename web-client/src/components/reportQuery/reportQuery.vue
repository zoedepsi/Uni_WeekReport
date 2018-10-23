<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">周报查询</div>
      </el-col>
      <el-col :span="14">
        <!-- <el-button type="primary" style="float:right;margin-right:10px" @click="addClass" :disabled="tableData.length>0?true:false">填写周报</el-button> -->
        <el-date-picker style="float:right;margin-right:10px" v-model="dateValue" type="week" format="yyyy 第 WW 周"
          :picker-options="pickOption" :value-format="dateFormat" placeholder="选择周" @change="queryReport"></el-date-picker>
                  <el-select style="float:right;margin-right:10px" v-model="userValue" placeholder="选择团队成员" @change="getreportbyuser">
          <el-option label="查看全部" value="99999"></el-option>
          <el-option v-for="item in users" :key="item.id" :label="item.truename" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <div v-for="(value, key) in tableData" :key="key">
        <p style="height:60px;line-height:60px; font-weight:bold;">{{key}}</p>
        <el-table :data="value" stripe style="width: 100%" :row-class-name="tableRowComplete">
          <!-- <el-table-column prop="id" label="ID" width='100'></el-table-column> -->
          <el-table-column label="周报内容">
            <template slot-scope="scope">
              <p style="color:#888;font-size:12px;">本周工作内容</p>
              <ul>
                <li v-for="(item,index) in scope.row.content.worked" :key="index" style="display:flex;justify-content:space-between;padding:0 30px;margin:5px 0;">
                  <span>{{index+1}}. {{item.content}}</span>
                  <span>完成度：{{item.complete}}%</span>
                </li>
              </ul>
              <p style="color:#888;font-size:12px;">下周工作计划</p>
              <ul>
                <li v-for="(item,index) in scope.row.content.toWork" :key="index" style="display:flex;justify-content:space-between;padding:0 30px;margin:5px 0;">
                  <span>{{index+1}}. {{item.content}}</span>
                  <span>完成度：{{item.complete}}%</span>
                </li>
              </ul>
              <!-- <el-button type="primary" size="mini" @click="routerTo(scope.$index, scope.row)">查看</el-button> -->
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width='200'>
            <template slot-scope="scope">
              <span>{{formatDate(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="上次更新时间" width='200'>
            <template slot-scope="scope">
              <span>{{formatDate(scope.row.updateTime)}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width='100'>
          <template slot-scope="scope">
          <el-button type="primary">查看详情</el-button>
          </template>
        </el-table-column> -->
        </el-table>
      </div>

    </div>
    <el-dialog title="填写周报" :visible.sync="dialogVisible" :before-close="clickCancel">
      <div class="formContent">
        <p class="repTitle">本周工作总结</p>
        <div class="report" :key="index" v-for="(item,index) in formData.worked">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0"></el-option>
            <el-option label="20%" value="20"></el-option>
            <el-option label="50%" value="50"></el-option>
            <el-option label="60%" value="60"></el-option>
            <el-option label="80%" value="80"></el-option>
            <el-option label="100%" value="100"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,0)" :disabled="formData.worked.length==1">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(0)" v-if="formData.worked.length-1==index">+</el-button>
        </div>
        <p class="repTitle">下周工作计划</p>
        <div class="report" :key="index" v-for="(item,index) in formData.toWork">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0"></el-option>
            <el-option label="20%" value="20"></el-option>
            <el-option label="50%" value="50"></el-option>
            <el-option label="60%" value="60"></el-option>
            <el-option label="80%" value="80"></el-option>
            <el-option label="100%" value="100"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,1)" :disabled="formData.toWork.length==1">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(1)" v-if="formData.toWork.length-1==index">+</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="submitReport">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑班级信息" :visible.sync="dialogVisible2" :before-close="clickCancel2">
      <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="班级名称" :required="true">
          <el-input type="text" v-model="formData.className" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级人数" :required="true">
          <el-input type="number" v-model="formData.classMemberCount" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="开班时间" :required="true">
          <el-date-picker v-model="formData.classPeriodStart" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="闭班时间" :required="true">
          <el-date-picker v-model="formData.classPeriodEnd" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="班级描述" :required="true">
          <el-input type="text" v-model="formData.classInfo" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="欢迎语" :required="true">
          <el-input type="text" v-model="formData.classWelInfo" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级地点" :required="true">
          <el-input type="text" v-model="formData.classLocation" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
      </el-form><span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel2">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";

export default {
  data() {
    return {
      users: [],
      userValue: "",
      pickOption: {
        firstDayOfWeek: 1
      },
      tableData: [],
      dateFormat: "yyyy-MM-dd",
      dateValue: "",
      dialogVisible: false,
      dialogVisible2: false,
      formData: {
        worked: [],
        toWork: []
      }
    };
  },

  mounted() {
    this.refreshData();
    this.getuserbygroup();
  },

  methods: {
    getWeekFirstDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    getWeekLastDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 7 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    getreportbyuser(val) {
      var that = this;
      if (that.dateValue) {
        var startDay = this.getWeekFirstDay(that.dateValue);
        var endDay = this.getWeekLastDay(that.dateValue);
        this.refreshData(startDay, endDay, val);
      } else {
        this.refreshData(undefined, undefined, val);
      }
    },
    getuserbygroup() {
      var that = this;
      var groupId = window.sessionStorage.getItem("groupId");
      that
        .axios({
          method: "post",
          url: rootPath + "/weekly/user/getbygroup",
          params: {
            groupId: groupId
          }
        })
        .then(response => {
          if (response.data.data) {
            var data = response.data.data;
            that.users = data;
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    tableRowComplete(row, rowIndex) {
      if (row.complete == 0) {
        return "danger-row";
      }
      if (row.complete > 0 && row.complete < 60) {
        return "waring-row";
      }
      if (row.complete > 0 && row.complete > 80) {
        return "success-row";
      }
    },
    formatDate: function(date) {
      return (
        new Date(date).toLocaleDateString() +
        " " +
        new Date(date).toTimeString().slice(0, 8)
      );
    },
    getWeekFirstDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    getWeekLastDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 7 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    addItem(type) {
      if (type == 0) {
        var lastItem = this.formData.worked[this.formData.worked.length - 1];
        this.formData.worked.push({
          id: lastItem.id + 1,
          content: "",
          complete: "0"
        });
      } else {
        var lastItem = this.formData.toWork[this.formData.toWork.length - 1];
        this.formData.toWork.push({
          id: lastItem.id + 1,
          content: "",
          complete: "0"
        });
      }
    },
    delItem(index, type) {
      if (type == 0) {
        this.formData.worked.splice(index, 1);
      } else {
        this.formData.toWork.splice(index, 1);
      }
    },
    submitReport() {
      var that = this;
      for (var i = 0; i < that.formData.worked.length; i++) {
        if (that.formData.worked[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      for (var i = 0; i < that.formData.toWork.length; i++) {
        if (that.formData.toWork[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      that
        .axios({
          method: "post",
          url: rootPath + "/weekly/report/add",
          params: {
            userId: window.sessionStorage.getItem("userId"),
            content: that.formData
          }
        })
        .then(response => {
          if (response.data.code == "00000") {
            that.$message({
              message: "提交成功",
              type: "success"
            });
            that.dialogVisible = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    queryReport() {
      var startDay = this.getWeekFirstDay(this.dateValue);
      var endDay = this.getWeekLastDay(this.dateValue);
      var userId = this.userValue;
      this.refreshData(startDay, endDay, userId);
    },
    editClass(id) {
      var that = this;
      that.dialogVisible2 = true;

      that
        .axios({
          method: "get",
          url: rootPath + "/chuangyou-crm/classInfo/crm/classInfo",
          params: {
            infoKey: id
          }
        })
        .then(response => {
          if (response.data) {
            that.formData = response.data.classInfo;
            console.log(response.data.classInfo);
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
    },

    clickCancel() {
      this.dialogVisible = false;
    },

    clickCancel2() {
      this.dialogVisible2 = false;
    },

    addClass() {
      this.dialogVisible = true;
      this.formData.worked.length = 0;
      this.formData.toWork.length = 0;
      this.formData.worked.push({
        id: 1,
        content: "",
        complete: "0"
      });
      this.formData.toWork.push({
        id: 1,
        content: "",
        complete: "0"
      });
    },

    refreshData(startDay, endDay, userId) {
      var that = this;
      var groupId = window.sessionStorage.getItem("groupId");
      that
        .axios({
          method: "post",
          url: rootPath + "/weekly/report/getbygroup",
          params: {
            groupId: groupId,
            startTime: startDay,
            endTime: endDay,
            userId: userId
          }
        })
        .then(response => {
          if (response.data.data) {
            var data = response.data.data;
            Object.keys(data).forEach(function(key) {
              for (var i = 0; i < data[key].length; i++) {
                data[key][i].content = JSON.parse(data[key][i].content);
              }
            });
            that.tableData = data;
            console.log(data);
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    }
  }
};
</script>
<style scoped>
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: "Microsoft YaHei";
  font-size: 18px;
}

#page-title {
  margin-bottom: 0;
}

.bills-wrapper {
  float: left;
  width: 99%;
  padding-top: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  min-height: 30px;
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
  clear: both;
}

.dkdia .el-dialog--small {
  width: 40%;
}

.dateContainer {
  height: 60px;
  border: 1px solid black;
}

.repTitle {
  font-size: 16px;
  color: #ccc;
  font-weight: bold;
  margin: 10px 0;
}

.report {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 5px 0;
}

.report span {
  display: block;
  width: 30px;
  font-size: 16px;
  text-align: center;
  margin: 0 5px;
}

.reportInput {
  width: 70%;
}

.reportSel {
  width: 80px;
  margin: 0 10px;
}
</style>
