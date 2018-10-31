<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">新建会议纪要</div>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-form class="meetForm" ref="formData" :rules="rules" :model="formData" label-width="100px">
        <el-form-item label="会议主题" prop="title">
          <el-input v-model="formData.title"  style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="会议类别" prop="meettype">
            <el-select v-model="formData.meettype" placeholder="请选择会议类别">
              <el-option label="部门周例会" value="部门周例会"></el-option>
              <el-option label="团队周例会" value="团队周例会"></el-option>
              <el-option label="需求讨论会" value="需求讨论会"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主持人" prop="hoster">
          <el-input v-model="formData.hoster" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="记录人" prop="recorder">
          <el-input v-model="formData.recorder"  style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="参会人" prop="persons">
          <el-tag :key="index" v-for="(item,index) in formData.persons" closable :disable-transitions="false" @close="handleClose(item)"
            type='primary' size='medium'>
            {{item}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
        </el-form-item>
        <el-form-item label="会议时间" prop="time">
          <el-date-picker v-model="formData.time" type="datetime" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议内容" prop="content">
          <div class="edit_container"  style="width:500px">
            <editor class="editor" :value="formData.content" :setting="editorSetting" @input="(content)=> formData.content = content"></editor>
          </div>
        </el-form-item>
        <el-form-item label="可见范围">
            <el-radio v-model="formData.visiable" label="0">所有人可见</el-radio>
  <el-radio v-model="formData.visiable" label="1">仅自己可见</el-radio>
  <el-radio v-model="formData.visiable" label="2" disabled>仅参会人可见</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formData')">提交</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";
import editor from "../editor.vue";
export default {
  data() {
    var validatetime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择时间"));
      } else {
        callback();
      }
    };
    var validatepersons = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写参会人员"));
      } else {
        callback();
      }
    };
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写会议内容"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        title: "",
        hoster: "",
        recorder: "",
        time: "",
        persons: [],
        content:
          "1. 会议摘要<br><br><br><br><br><br>2. 会议决议<br><br><br><br><br><br>3. 待解决问题<br><br><br><br> ",
        userid: "",
        meettype: "",
        visiable:'0'
      },
      rules: {
        title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
        meettype: [{ required: true, message: "请选择会议类别", trigger: "blur" }],
        hoster: [
          { required: true, message: "请输入会议主持人", trigger: "blur" }
        ],
        recorder: [
          { required: true, message: "请输入会议记录人", trigger: "blur" }
        ],
        time: [{ validator: validatetime, trigger: "blur" }],
        persons: [{ validator: validatepersons, trigger: "blur" }],
        content: [{ validator: validatecontent, trigger: "blur" }]
      },
      inputVisible: false,
      inputValue: "",
      editorSetting: {
        height: 400
      }
    };
  },

  mounted() {},

  methods: {
    handleClose(tag) {
      this.formData.persons.splice(this.formData.persons.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formData.persons.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    onSubmit(formname) {
      var that = this;
      that.formData.userid = window.sessionStorage.getItem("userId");
      that.$refs[formname].validate(valid => {
        if (valid) {
          that
            .axios({
              method: "post",
              url: rootPath + "/weeklyserver/meet/add",
              params: {
                formData: JSON.stringify(that.formData)
              }
            })
            .then(response => {
              that.$message({
                message: response.data.msg,
                type: "success"
              });
              that.formData = {
                title: "",
                hoster: "",
                recorder: "",
                time: "",
                persons: [],
                content:
                  "1. 会议摘要<br><br><br><br><br><br>2. 会议决议<br><br><br><br><br><br>3. 待解决问题<br><br><br><br> ",
                userid: "",
                meettype: "",
        visiable:'0'

              };
            })
            .catch(res => {
              that.$message({
                message: response.data.msg,
                type: "warrning"
              });
            });
        } else {
          return false;
        }
      });
    },
    cancelSubmit() {
      this.formData = {
        title: "",
        hoster: "",
        recorder: "",
        time: "",
        persons: [],
        content:
          "1. 会议摘要<br><br><br><br><br><br>2. 会议决议<br><br><br><br><br><br>3. 待解决问题<br><br><br><br> ",
        userid: "",
                meettype: "",

        visiable:'0'

      };
    }
  },
  computed: {},
  components: {
    editor: editor
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

.meetForm {
  width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 20px;
}

.page-wrapper .el-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 29px;
}

.page-wrapper .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.page-wrapper .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
