
<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="product-title">商品管理</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right" @click="addProduct">添加商品</el-button>
      </el-col>
    </el-row>

    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%;">
        <el-table-column prop="pluid" label="商品ID">
        </el-table-column>
        <el-table-column prop="pluname" label="商品名称">
        </el-table-column>
        <el-table-column prop="price" label="单价">
        </el-table-column>
        <el-table-column prop="firstratePer" label="直接会员分红">
        </el-table-column>
        <el-table-column prop="secondratePer" label="邀请会员分红">
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" prop="status">
          <template slot-scope="scope">
            <el-button @click="editProduct(scope.row)" type="text" size="small">编辑</el-button>
            <!--<el-button @click="changeActive(scope.row,'0')" type="text" size="small" v-if="scope.row.isactive == '1'">停用</el-button>-->
            <!--<el-button @click="changeActive(scope.row,'1')" type="text" size="small" v-else>启用</el-button>-->
            <!--<el-button type="text" size="small" @click="resetPassword(scope.row)">重置密码</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="productDialogTitle" v-model="productDialog" size="small" @close="resetForm('productForm')">
        <el-form ref="productForm" :model="productForm" :rules="productFormRules"  label-width="120px">
          <el-form-item label="商品ID" prop="pluid" style="width:90%" v-if="productDialogMode=='edit'">
            <el-input v-model="productForm.pluid" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="pluname" style="width:90%">
            <el-input v-model="productForm.pluname"></el-input>
          </el-form-item>
          <el-form-item type="number" label="单价" prop="price" style="width:90%">
            <el-input v-model="productForm.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="直接会员分红" prop="firstrate" style="width:90%" >
            <el-input  v-model="productForm.firstrate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="邀请会员分红" prop="secondrate" style="width:90%">
            <el-input v-model="productForm.secondrate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark" style="width:90%">
            <el-input v-model="productForm.remark" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productDialog = false">取 消</el-button>
          <el-button type="primary" @click="doAddProduct" v-if="productDialogMode=='create'">添 加</el-button>
          <el-button type="primary" @click="doEditProduct"  v-if="productDialogMode=='edit'">确 定</el-button>
        </div>
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
        productForm:{
          pluname: "",
          price:"",
          firstrate:"",
          secondrate:"",
          remark:''
        },
        productDialogTitle:"",
        productDialogMode:"",
        productFormRules:{
          pluname:[
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 20, message: '商品名称长度应为2-20字符', trigger: 'blur'}
          ],
          price:[
            {required: true, message: '请输入商品单价'},
            {validator(r,v,b){console.log(v);(/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v)?b():b(new Error('请填写数字'))}}
          ],
          firstrate:[
            {required: true, message: '请输入直接会员分红比例'},
            {validator(r,v,b){console.log(v);(/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v)?b():b(new Error('请填写数字'))}}
          ],
          secondrate:[
            {required: true, message: '请输入邀请会员分红比例'},
            {validator(r,v,b){console.log(v);(/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v)?b():b(new Error('请填写数字'))}}
          ],
          remark:[
            {max: 200, message: '备注内容长度应不超过200字符', trigger: 'blur'}
          ]
        },
        productDialog: false,
      }
    },
    created() {
      this.refreshData();
    },
    methods: {
      addProduct(){
        this.productDialogMode = "create";
        this.productDialogTitle = "新增商品";
        this.productForm = {
          pluname: "",
          price:"",
          firstrate:"",
          secondrate:"",
          remark:''
        },
          this.productDialog = true;
      },
      editProduct(data){
        this.productDialogMode = "edit";
        this.productDialogTitle = "商品编辑";
        this.productDialog = true;
        this.productForm = deepCopy(data);
      },
      doAddProduct(){
        var that = this;
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/product/add',
              params: {
                userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                pluName: that.productForm.pluname,
                price: that.productForm.price,
                firstRate: that.productForm.firstrate,
                secondRate: that.productForm.secondrate,
                remark: that.productForm.remark,
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.$message({
                  message: "商品添加成功",
                  type: 'success'
                });
                that.productDialog = false;
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
      doEditProduct(){
        var that = this;
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            this.axios({
              method: 'post',
              url: rootPath + '/gold/product/change',
              params: {
                userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
                pluId: that.productForm.pluid,
                pluName: that.productForm.pluname,
                price: that.productForm.price,
                firstRate: that.productForm.firstrate,
                secondRate: that.productForm.secondrate,
                remark: that.productForm.remark,
              }
            }).then((response) => {
              if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
                that.$message({
                  message: "商品信息修改成功",
                  type: 'success'
                });
                that.productDialog = false;
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
//      changeActive(data,to){
//        var toname = to=="0"?"禁用":"启用";
//        var that = this;
//        this.axios({
//          method: 'post',
//          url: rootPath + '/gold/user/changeadminuseractive',
//          params: {
//            thisUserId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
//            userId: data.userid,
//            isActive:to
//          }
//        }).then((response) => {
//          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
//            that.$message({
//              message: "用户"+toname+"成功",
//              type: 'success'
//            });
//            this.refreshData();
//          }
//          else if (response.data == undefined) {
//            this.$message({
//              message: "系统请求发生错误",
//              type: 'error'
//            });
//          } else if (response.data.isSucceed == false) {
//            this.$message({
//              message: response.data.returnMessage,
//              type: 'error'
//            });
//          } else {
//            this.$message({
//              message: response.data.returnData.bizReturnMessage,
//              type: 'error'
//            });
//          }
//        });
//      },
      refreshData() {
        var that = this;
        this.axios({
          method: 'post',
          url: rootPath + '/gold/product/getall',
          params: {
            userId: JSON.parse(window.sessionStorage.getItem("userInfo")).userid,
          }
        }).then((response) => {
          if (response.data && response.data.isSucceed && response.data.returnData.bizIsSucceed) {
            var data = response.data.returnData.bizReturnData.list;
            for(var i = 0 ; i < data.length ; i++){
              data[i].firstratePer = data[i].firstrate + "%";
              data[i].secondratePer = data[i].secondrate + '%';
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
  function deepCopy(source){
    var result={};
    for (var key in source) {
      result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
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
    margin-top 9px

  }
  #product-title{
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
