<template>
  <el-row class="content">
    <el-col>
      <div class = find_container>
        <el-row class="header_row">
          <el-col>
            <a href="#">
              <!-- <span class="index_logo"></span> -->
            </a>
          </el-col>
        </el-row>
        <el-row class="find_panel_row vertical">
          <el-col class="find_panel_col">
            <el-tabs class="tabview" v-model="activeTab" >
              <el-tab-pane label="登录密码找回" name="find">
                <el-form ref="findform" :model="findform" label-width="100px" @submit.prevent="onSubmit" >
                  <el-form-item label="登录名">
                    <el-input v-model="findform.uername" placeholder="用户名 / 手机号" type="text"></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="findform.password" placeholder="密码" type="password"></el-input>
                  </el-form-item>
                </el-form>
                <router-link to="/login"><el-button :plain="true" type="success">返回登录</el-button></router-link>
                <el-button type="success" @click="find">下一步</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row class="footer_row">
          <el-col>
            版权所有 © 2017 金夫人 鲁ICP备0000000号
          </el-col>
        </el-row>
      </div>

    </el-col>
  </el-row>
</template>
<script>
  import {rootPath} from '../../config/apiConfig'
  export default {
    data () {
      return {
        activeTab: 'find',
        findform:{
          username:'',
        },
        regform:{
          username:'',
        }
      }
    },
    watch: {

    },
    methods: {
      find() {
        this.$message({
          message: `欢迎${this.findform.username}同学`,
          type: 'success'
        })
      },
      register() {
        this.$message({
          message: `新同学${this.regform.username}注册成功`,
          type: 'success'
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .el-row.content
    position fixed
    background: url(../../assets/login_index.jpg) center no-repeat fixed;
    background-size: cover;
    overflow-y auto
  .find_container
    position relative
    min-height 450px
    height 100vh
  .index_logo
    display: inline-block;
    height: 300px;
    width: 320px
    background: url(../../assets/qs_indexlog.png) no-repeat;
  .remember
    margin-left 100px
    margin-right 150px
  .el-button
    width 20%
    float right
    margin 15px 0 15px 15px
  #find
    float right
    margin-right 10px
    font-size 13px
    color #5e7382

  .find_panel_row
    height 64vh
    width 100%
    display flex
  .find_panel_col
    /*position: relative;*/
    width: 685px;
    margin: auto;
    padding: 16px;
    background #fff
    border-radius 4px
    border 1px solid #eaeefb;
    box-shadow: 0 0 25px #767676;
    -webkit-box-shadow: 0 0 25px #767676;
    box-sizing: border-box;
  .footer_row
    font-size: .875rem;
    line-height: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 5.5vh 0;
    text-align: center;
    color: #aaa;
  .vertical
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-grid-row-align: center;
    -ms-flex-align: center;
    align-items: center;


</style>
