<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">班级管理</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right;margin-right:10px" @click="addClass">添加班级</el-button>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table :data="classList" stripe style="width: 100%">
        <el-table-column prop="className" label="班级名称" width='100'></el-table-column>
        <el-table-column prop="classMemberCount" label="班级人数" width="100">
        </el-table-column>
        <el-table-column prop="classPeriodStart" label="开班时间" width='200'>
        </el-table-column>
        <el-table-column prop="classPeriodEnd" width='200' label="闭班时间">
        </el-table-column>
        <el-table-column prop="classLocation" label="班级位置" width='200'>
        </el-table-column>
        <el-table-column prop="classInfo" label="班级信息">
        </el-table-column>
        <el-table-column label="操作" width='250'>
          <template slot-scope="scope">
            <el-button @click="editClass(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="uploadImgDia(scope.row.id)" type="text" size="small">上传图片</el-button>
            <el-button @click="uploadFile(scope.row.id)" type="text" size="small">上传资料</el-button>
            <el-button style="color:red;" @click="deleteClass(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="total" :page-size='20' @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="添加班级" :visible.sync="dialogVisible" :before-close="clickCancel">
      <el-form :model="formData" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="班级用户名称" :required="true">
          <el-input type="text" v-model="formData.classUsername" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级密码" :required="true">
          <el-input type="text" v-model="formData.classPassword" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" :required="true">
          <el-input type="text" v-model="formData.className" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="班级人数" :required="true">
          <el-input type="number" v-model="formData.classMemberCount" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="开班时间" :required="true">
          <el-date-picker v-model="formData.classPeriodStart" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="闭班时间" :required="true">
          <el-date-picker v-model="formData.classPeriodEnd" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
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
      </el-form>
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
          <el-date-picker v-model="formData.classPeriodStart" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="闭班时间" :required="true">
          <el-date-picker v-model="formData.classPeriodEnd" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel2">取 消</el-button>
        <el-button type="primary" @click="submitEditClass">提 交</el-button>
      </span>
    </el-dialog>


    <el-dialog title="上传图片" :visible.sync="dialogVisible3" :before-close="clickCancel3">
      <el-upload :action="uploadImgUrl" :data="uploadData" list-type="picture-card" limit=8>
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible4" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel3">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="上传文件" :visible.sync="dialogVisible5" :before-close="clickCancel5">
      <el-upload class="upload-demo" drag :action="uploadFileUrl" :data="uploadData">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel5">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {
      classList: [],
      pageNo: 0,
      total: 100,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogImageUrl: "",
      formData: {
        id: "",
        userId: "",
        classUsername: "",
        classPassword: "",
        className: "",
        classMemberCount: 1,
        classPeriodStart: "",
        classPeriodEnd: "",
        classInfo: "",
        classWelInfo: "",
        classLocation: ""
      },
      uploadData: {
        classInfoId: ""
      },
      uploadImgUrl: rootPath + "/chuangyou-crm/classInfo/crm/uploadImg",
      uploadFileUrl: rootPath + "/chuangyou-crm/classInfo/crm/uploadResource"
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    submitClass() {
      var that = this;
      that
        .axios({
          method: "POST",
          url: rootPath + "/chuangyou-crm/classInfo/crm/save",
          data: that.formData,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.data.retCode == "00000") {
            that.$message({
              type: "success",
              message: "添加成功!"
            });
            that.dialogVisible = false;
            that.refreshData();
          } else {
            that.$message({
              message: response.data.retInfo,
              type: "error"
            });
          }
        });
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible4 = true;
    // },
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
    clickCancel3() {
      this.dialogVisible3 = false;
    },

    clickCancel5() {
      this.dialogVisible5 = false;
    },
    uploadImgDia(id) {
      this.dialogVisible3 = true;
      this.uploadData.classInfoId = id;
    },
    uploadFile(id) {
      this.dialogVisible5 = true;
      this.uploadData.classInfoId = id;
    },
    deleteClass(id) {
      var that = this;
      this.$confirm("该操作无法撤销，请确认?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .axios({
              method: "POST",
              url: rootPath + "/chuangyou-crm/classInfo/crm/delClassInfo",
              params: {
                classInfoId: id
              }
            })
            .then(response => {
              if (response.data.retCode == "00000") {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.refreshData();
              } else {
                that.$message({
                  message: response.data.retInfo,
                  type: "error"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    submitEditClass() {
      var that = this;
      that
        .axios({
          method: "POST",
          url: rootPath + "/chuangyou-crm/classInfo/crm/editClassInfo",
          data: that.formData,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.data.retCode == "00000") {
            that.$message({
              type: "success",
              message: "编辑成功!"
            });
            that.dialogVisible2 = false;
            that.refreshData();
          } else {
            that.$message({
              message: response.data.retInfo,
              type: "error"
            });
          }
        });
    },
    addClass() {
      this.dialogVisible = true;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    withdrawFinish(orderId) {
      var that = this;
      var orderIdList = [orderId.toString()];
      this.$confirm("该操作无法撤销，请确认?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .axios({
              method: "POST",
              url: rootPath + "/cms/sendOrders",
              data: {
                orderIds: orderIdList
              }
            })
            .then(response => {
              if (response.data && response.data.retCode == "00000") {
                that.$message({
                  type: "success",
                  message: "已确认发货!"
                });
                this.refreshData();
              } else if (response.data == undefined) {
                that.$message({
                  message: "系统请求发生错误",
                  type: "error"
                });
              } else if (response.data.isSucceed == false) {
                that.$message({
                  message: response.data.returnMessage,
                  type: "error"
                });
              } else {
                that.$message({
                  message: response.data.returnData.bizReturnMessage,
                  type: "error"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    refreshData() {
      var that = this;
      this.axios({
        method: "get",
        url: rootPath + "/chuangyou-crm/classInfo/crm/classInfos",
        params: {
          pageNo: that.pageNo,
          pageSize: 20
        }
      }).then(response => {
        if (response.data) {
          that.total = response.data.count;
          that.classList = response.data.classInfoList;
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
    handleCurrentChange(val) {
      this.pageNo = val - 1;
      this.refreshData(this.status);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: 'Microsoft YaHei';
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

.clearfix:before, .clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.dkdia .el-dialog--small {
  width: 40%;
}
</style>
