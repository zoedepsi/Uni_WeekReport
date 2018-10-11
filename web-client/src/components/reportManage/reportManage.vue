<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">周报填写</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right;margin-right:10px" @click="addClass">填写周报</el-button>
        <el-date-picker style="float:right;margin-right:10px" v-model="dateValue" type="week" format="yyyy 第 WW 周"
          :picker-options="pickOption" :value-format="dateFormat" placeholder="选择周" @change="queryReport"></el-date-picker>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table data="" stripe style="width: 100%">
        <el-table-column prop="className" label="班级名称" width='100'></el-table-column>

      </el-table>
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
          <el-button class="delBtn" type="danger" @click="delItem(index,0)"  :disabled="formData.worked.length==1">x</el-button>
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
          <el-button class="delBtn" type="danger"  @click="delItem(index,1)" :disabled="formData.toWork.length==1">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(1)"  v-if="formData.toWork.length-1==index">+</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="submitClass">提 交</el-button>
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
        <el-button type="primary" @click="submitEditClass">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";

export default {
  data() {
    return {
      pickOption: {
        firstDayOfWeek: 1
      },

      dateFormat: "yyyy-MM-dd",
      dateValue: "",
      dialogVisible: false,
      dialogVisible2: false,
      formData: {
        worked: [
          {
            id: 1,
            content: "",
            complete: "0"
          }
        ],
        toWork: [
          {
            id: 1,
            content: "",
            complete: "0"
          }
        ]
      }
    };
  },

  mounted() {
    this.refreshData();
  },

  methods: {
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
    queryReport() {
      var that = this;
      console.log(this.dateValue);
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
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    refreshData() {
      var that = this;
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
