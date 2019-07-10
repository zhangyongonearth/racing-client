<template>
  <div class="main-xuanshou">
    <!-- 登录成功后显示的界面 -->
    <div v-if="isExist" class="success">
      <el-row :span="4" class="header-title">
        <svg-icon icon-class="emblem"></svg-icon>{{raceName}}</el-row>
      <el-row :span="20"><el-card class="box-card">
        <div slot="header" class="clearfix">
            <span><span id = "group-name">{{teamName}}</span>:<span id= "group-score">{{teamScore}}</span></span>
            <span style="float:right" class="titleNum">第 <span id = "current-number">{{currentNumber}}</span> 题</span>
        </div>
        <div>
          <el-row class ="option">
            <el-checkbox-group v-model="checkedData">
              <el-checkbox-button class="checkbox-option" v-for="option in options" :label="option" :key="option">{{option}}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-row>
        </div>
        <div class="button-ok"><el-button class="button-submit" type="danger" :disabled="isOk" @click="submitAnswer">确定</el-button></div>
        <div>提交的答案：<span>{{checkedAnswer}}</span></div>
      </el-card></el-row>
    </div>

    <!-- 进行登录 -->
    <div v-else>
      <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
        <h3 class="login-title"><svg-icon class="icon-login" icon-class="welcome"></svg-icon>欢迎登录</h3>
        <el-form-item label="队名" prop="teamName">
          <el-input type="text" placeholder="请输入队名" v-model="form.teamName"/>
        </el-form-item>
        <el-form-item label="口令" prop="teamToken">
          <el-input type="teamToken" placeholder="请输入口令" v-model="form.teamToken"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isLogin" v-on:click="onSubmit('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <span>请输入账号和口令</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player',
  data() {
    return {
      raceToken: '', // 开始比赛的
      teamName: '队名',
      teamToken: '8719', // 队伍的口令
      raceName: '',
      // isLogin: true,
      isOk: false,
      dialogVisible: false, // 对话框显示和隐藏
      isExist: false, // 判定输入的teamToken是否存在于localstorage
      teamScore: '分数',
      currentNumber: '5',
      checkedData: [],
      checkedAnswer: null,
      options: ['A', 'B', 'C', 'D', 'E'],
      activedToken: '', // 已经抢到答题权的队伍
      form: {
        teamName: '',
        teamToken: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        teamName: [
          { required: true, message: '账号不可为空', trigger: 'blur' }
        ],
        teamToken: [
          { required: true, message: '口令不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const teamInfo = {
            'teamName': this.form.teamName,
            'teamToken': this.form.teamToken
          }
          localStorage.setItem('各队信息', JSON.stringify(teamInfo))
          this.isExist = true
        } else {
          this.dialogVisible = true
          return false
        }
      })
    },
    submitAnswer() {
      this.checkedAnswer = this.checkedData.join(' ')
      console.log(this.checkedData.join(' '))
      const scoreInfo = {
        'teamName': this.form.teamName,
        'teamToken': this.form.teamToken,
        'answer': this.checkedAnswer
      }
      localStorage.setItem('答案信息', JSON.stringify(scoreInfo))
      this.isOk = true
    },
    login(teamName, teamToken) {
      var data = JSON.parse(localStorage.getItem('各队信息'))
      var data1 = JSON.parse(localStorage.getItem('答案信息'))
      var data2 = this.getState()
      // 若获取到后台传过来的raceToken，则保存。下次刷新页面的时候判断如果有racetoken，说明有正在进行比赛
      localStorage.setItem('raceToken', data2.config.raceToken)
      console.log(data)
      if (data.teamName && data.teamToken) {
        if (localStorage.getItem('raceToken')) {
          // 如有正在进行的比赛，则为比赛的界面
          console.log(localStorage.getItem('raceToken'))
          this.teamName = data.teamName
          this.isExist = true
          this.raceName = data2.config.raceNmae
          this.teamScore = data2.config.teamScore
          this.currentNumber = data2.config.currentNumber
          this.checkedAnswer = data1.answer
          this.isOk = true
        } else {
          // 若没有正在进行的比赛 则只可留在登录界面
          this.isExist = false
          this.isLogin = true
          alert('当前比赛还未开始！')
        }
      } else {
        this.isExist = false
      }
    },
    getState() {
      // 从后台获取数据
      return {
        config: {
          raceNmae: '比赛名称1234567',
          teamScore: '45',
          currentNumber: '5',
          raceToken: '1234'
        }
      }
    }
  },
  mounted() {
    this.login('队伍名称', '1234')
    // 从localstorage中插叙是否有token，teamName，如果没有，就显示填写密令和起名的功能。如果有token，进入答题界面
    // 答题界面显示出来之后，仍然是有可能禁用
  },
  watch: {
    'currentNumber': function(newVal) {
      this.currentNumber = newVal
      this.Ok = false
      localStorage.removeItem('答案信息')
    }
  }
}
</script>

<style>
.login-box {
  border: 1px solid #DCDFE6;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  /* box-shadow: 0 0 5px #909399; */
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #000;
}
.success{
  border-radius: 5px;
  height: 100vh;
}
.header-title{
  font-size: 30px;
  text-align: center;
  padding-top: 90px;
  padding-bottom: 40px;
}
.option{
  padding-top:30px;
  padding-bottom: 40px;
  text-align: center;
}
.button-ok{
  text-align: center;
  margin-bottom: 40px;
}
.button-submit{
  width: 180px;
  height: 50px;
}
.icon-login{
  font-size: 40px;
}
</style>
