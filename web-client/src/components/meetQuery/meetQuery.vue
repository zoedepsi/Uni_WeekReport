<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="5">
        <div class="page-title" id="vip-title">会议纪要查询</div>
      </el-col>
      <el-col :span="18">
            <el-button type="primary" style="float:right;margin:0 5px;" @click="refreshData">检索</el-button>
            <el-input v-model="title" placeholder="输入会议主题" style="width:200px;float:right;margin:0 5px;"></el-input>
            <el-select style="float:right;" v-model="meettype" placeholder="会议类别" @change="refreshData">
              <el-option label="全部类别" value="0"></el-option>
              <el-option label="部门周例会" value="部门周例会"></el-option>
              <el-option label="团队周例会" value="团队周例会"></el-option>
              <el-option label="需求讨论会" value="需求讨论会"></el-option>
              <el-option label="研发讨论会" value="研发讨论会"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%;">
        <!-- <el-table-column prop="id" label="ID" width="80"></el-table-column> -->
        <el-table-column prop="title" label="会议主题"></el-table-column>
        <el-table-column prop="meettype" label="会议类别" width="150"></el-table-column>
        <el-table-column prop="hostmemberid" label="主持人" width="120"></el-table-column>
        <el-table-column prop="recordmemberid" label="记录人" width="120"></el-table-column>
        <el-table-column prop="createtime" label="会议时间" width="200">
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.createtime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="lookDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="纪要详情" :visible.sync="dialogVisible" custom-class='detail_dialog' top="1%">
      <el-form class="meetForm" :model="dialogData" label-width="100px">
        <el-form-item label="会议主题:" prop="title">
          <span>{{dialogData.title}}</span>
        </el-form-item>
                <el-form-item label="会议类别:" prop="title">
          <span>{{dialogData.meettype}}</span>
        </el-form-item>
        <el-form-item label="主持人:" prop="hoster">
          <span>{{dialogData.hostmemberid}}</span>
        </el-form-item>
        <el-form-item label="记录人:" prop="recorder">
          <span>{{dialogData.recordmemberid}}</span>
        </el-form-item>
        <el-form-item label="参会人:" prop="persons">
          <p>{{dialogData.members}}</p>
        </el-form-item>
        <el-form-item label="会议时间:" prop="time">
          <span>{{formatDate(dialogData.createtime)}}</span>
        </el-form-item>
        <el-form-item label="会议内容:" prop="content">
          <div v-html='dialogData.content'></div>
        </el-form-item>
      </el-form>
      <div style="display:flex;align-items:flex-end;margin-bottom:10px;">
      <el-input v-model="discuss" placeholder="" type="textarea" :rows='2'></el-input>
<el-button size="small" style="margin-left:10px;" type="primary" @click="addDiscuss">评论</el-button>
      </div>

      <div class="discussList" v-for="(item,index) in discussList" :key="index">
        <p><span>{{item.truename}}:</span><span>{{formatDate(item.createtime)}}</span></p>
        <div class="item">{{item.content}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type='text/ecmascript-6'>
import Vue from "vue";
import { rootPath } from "../../config/apiConfig";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogData: "",
      meettype: "",
      title: "",
      discuss: "",
      rightId: "",
      discussList: []
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    formatDate: function(date) {
      return (
        new Date(date).toLocaleDateString() +
        " " +
        new Date(date).toTimeString().slice(0, 8)
      );
    },
    refreshData(val) {
      var that = this;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/meet/query",
          params: {
            userId: window.sessionStorage.getItem("userId"),
            meettype: that.meettype,
            title: that.title
          }
        })
        .then(response => {
          that.tableData = response.data.data;
        })
        .catch(res => {
          that.$message({
            message: response.data.msg,
            type: "warrning"
          });
        });
    },
    lookDetail(row) {
      this.dialogData = row;
      this.dialogVisible = true;
      this.rightId = row.id;
      this.queryDiscuss();
    },
    addDiscuss() {
      var that = this;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/meet/addMeetDiscuss",
          params: {
            createdby: window.sessionStorage.getItem("userId"),
            content: that.discuss,
            relateid: that.rightId
          }
        })
        .then(response => {
          that.$message({
            message: "添加成功",
            type: "success"
          });
          that.queryDiscuss();
          that.discuss="";
        })
        .catch(res => {
          that.$message({
            message: response.data.msg,
            type: "warrning"
          });
        });
    },
    queryDiscuss() {
      var that = this;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/meet/queryDiscuss",
          params: {
            relateid: that.rightId
          }
        })
        .then(response => {
          that.discussList = response.data.data;
        })
        .catch(res => {
          that.$message({
            message: response.data.msg,
            type: "warrning"
          });
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
  margin-top: 9px;
}

.el-dialog--small {
  width: 400px !important;
}

#vip-title {
  margin-bottom: 0;
}

.bills-wrapper {
  float: left;
  width: 99%;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  min-height: 30px;
  margin-top: 20px;
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

.detail_dialog {
  height: 400px;
  overflow-y: scroll;
}
.discussList p {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #ccc;
  margin: 5px 0;
}
.discussList .item {
  margin: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
</style>
