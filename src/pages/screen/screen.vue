<template>
<el-container class="container">
  <!-- 标题栏 -->
  <el-header height="100px" style="background:rgba(255,255,255,0.1);" >
      <el-col :span="17"  style="font-size: 45px; line-height: 100px;">
        <img src="./images/logo.png" style="width: 60px; vertical-align: middle;">
        {{raceName}}
      </el-col>
      <el-col :span="3" >
        <p>比赛用时</p>
        <p><span class="ues-time">{{useTime.minute}}</span>:<span class="ues-time">{{useTime.second}}</span></p>
      </el-col>
      <el-col :span="4" >
        <p>{{apartment}}</p>
        <p>{{currentDate}}</p>
      </el-col>
  </el-header>
  <!-- 主要内容 -->
  <el-main style="padding:20px 20px 15px 20px;">
    <!-- 题目问题 答案 -->
    <el-col :span="12">
      <div class="grid-content grid-content-left">
      <el-row :span="4" class="border title title-question">
        <svg-icon icon-class="file"></svg-icon>题目:{{questionIndex}}
      </el-row>
      <el-row :span="18" id="question-sizeof" class="border opacity question"><div v-html="question"></div></el-row>
      <el-row :span="2" class="border opacity correct-answer">
        <el-col :span="7" class="answer-icon"><svg-icon icon-class="showanswer"></svg-icon>正确答案：</el-col>
        <el-col :span="10" class="answer-icon">
          {{correctAnswer}}
        </el-col>
      </el-row>
    </div>
    </el-col>
    <!-- 各组亮灯 组名 答案 时间 超时 分数情况 -->
    <el-col :span="11" :offset="1"><div class="grid-content grid-content-right">
      <el-row :span="4" class="border title title-group">
        <svg-icon icon-class="group"></svg-icon>各组战况</el-row>
      <el-row class="right-bottom">
        <el-table
        class="table opacity"
        :data="tableData"
        :row-class-name="tableRowClassName"
        >
        <el-table-column
          type="index"
          label="排名"
          align="center">
        </el-table-column>
        <el-table-column
          label="组名"
          align="center">
          <template slot-scope="scope">
            <svg-icon style="float:left" icon-class="img"></svg-icon>
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="分数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="answer"
          label="答案"
          align="center">
        </el-table-column>
        </el-table>
      </el-row>
    </div></el-col>
  </el-main>
</el-container>
</template>

<script>
import { setInterval, clearInterval} from 'timers'
import {Screen} from '../client'
export default {
  name: 'screen',
  data() {
    return {
      apartment: '网络软件研发部党支部',
      currentDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      useTime: {
        minute: '00',
        second: '00'
      },
      raceName: '践行社会主义核心价值观之知识竞赛',
      beginTime: '', //
      correctAnswer: '',
      teamAnswer: '',
      questionIndex: '',
      question: '',
      tableData: [],
      timer: '',
      activeTeam: ''
    }
  },
  methods: {
    computeTime() {
      var self = this
      this.timer = setInterval(() => {
        const newTime = new Date().getTime()
        var mss = newTime - self.beginTime
        const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
        const s = (mss % (1000 * 60)) / 1000 // 得到秒数
        const minutes = Math.floor(m)
        const seconds = Math.floor(s)
        self.useTime.minute = minutes < 10 ? ('0' + minutes) : minutes
        self.useTime.second = seconds < 10 ? ('0' + seconds) : seconds
      }, 1000)
    },
    tableRowClassName({row, rowIndex}) {
      // if (rowIndex % 2 === 0) {
      //   return 'warning-row'
      // } else {
      //   return 'success-row'
      // }
      if (row.index && row.index === 1) {
        return 'warning-row'
      }
    },
    onConnect(data) {
      // raceName: config.raceName,
      // raceMode: config.raceMode,
      // beginTime: config.beginTime,
      // enableAnswer: state.enableAnswer,
      // questionIndex: state.questionIndex,
      // question: state.question,
      // updateTime: state.updateTime,
      // activeTeam: state.activeTeam,
      // teams: state.teams // 以防该主持人在比赛过程中刷新
      console.log(data)
    },
    onInitRace(data) {
      const {raceName} = data
      this.raceName = raceName
    },
    onBeginRace(data) {
      const { beginTime} = data
      this.beginTime = beginTime
      this.computeTime()
    },
    onNextQuestion(data) {
      const { questionIndex, question } = data
      this.questionIndex = questionIndex + 1
      this.question = question
      this.correctAnswer = ''
      this.activeTeam = undefined
    },
    onShowAnswer(data) {
      const { answer, answers } = data
      this.correctAnswer = answer
      this.tableData.forEach((v, i) => {
        this.tableData[i]['answer'] = answers[v.teamToken]['answer']
      })
    },
    onChangeScore(data) {
      const { teamToken, newValue } = data
      //      const { teams } = data
      this.tableData.forEach((v, i) => {
        if (v.teamToken === teamToken) {
          v.score = newValue
        }
        // this.tableData[i]['score'] = teams[v.teamToken]['score']
      })
      this.tableData.sort((x, y) => {
        return x['score'] - y['score']
      })
    },
    onEndRace(data) {
      this.screen.quit()
      clearInterval(this.timer)
    },
    onRename(data) {
      const { teams} = data
      this.tableData = []
      for (var i in teams) {
        this.tableData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: '1'})
      }
    },
    onAnswer(data) {
      const { activeTeam } = data
      this.activeTeam = activeTeam
    }
  },
  mounted() {
    this.screen = new Screen()
    const self = this
    this.screen.onmessage = function(resp) {
      console.log('this is screen onmessage')
      console.log(resp)
      const { action, data} = JSON.parse(resp)
      switch (action) {
        case 'connect':
          self.onConnect(data)
          break
        case 'initRace':
          self.onInitRace(data)
          break
        case 'beginRace':
          self.onBeginRace(data)
          break
        case 'nextQuestion':
          self.onNextQuestion(data)
          break
        case 'showAnswer':
          self.onShowAnswer(data)
          break
        case 'changeScore':
          self.onChangeScore(data)
          break
        case 'endRace':
          self.onEndRace(data)
          break
        case 'rename':
          self.onRename(data)
          break
        case 'answer':
          self.onAnswer(data)
          break
      }
    }
    this.screen.login()
  },
  watch: {
  }
}
</script>

<style>
body{
  margin:0;
  width: 1280px;
  height: 720px;
}
.container{
  background: url('./images/back.png');
  background-size: 100% 100%;
  color: #fff;
}
.ues-time{
  color: #ff0000;
  background:#fff;
  font-size: 24px;
  margin-top: 0;
}
.grid-content{
  /* margin: 20px 20px auto 20px; */
  padding-bottom: 30px;
}
.border{
  border:1px solid #CD2323;
}
.title{
  border-top-right-radius:5px;
  border-top-left-radius:5px;
  background: #CD2323;
  height: 35px;
  padding-top:10px;
}
.opacity{
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
  padding: 20px 20px;
  background:rgba(255,255,255,0.1);
}
.question{
  height: 470px;
  margin-bottom: 20px;
}
.svg-icon{
  margin-right: 5px;
  margin-left:10px;
  font-size: 20px;
}
.correct-answer{
  padding: 0px;
  border-radius: 5px;
  height: 60px;
}
.right-bottom{
  padding: 20px 20px;
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
  height: 550px;
  background:rgba(255,255,255,0.1);
}
.el-table .warning-row {
  background: #F9AB00;
}
.el-table .success-row {
background:rgba(255,255,255,0.1);
}
.table{
  border-radius: 0px;
  padding: 0;
}
.bg-green{
  color: green
}
.el-table__row{
  height: 70px;
}
th{
  height: 50px;
}
.answer-icon{
 padding: 20px;
}
.scratch-card{
  width: 150px!important;
  height: 60px!important;
}
.all-answer{
  text-align: center;
}
.scratch-card-result{
  text-align: center;
  padding: 10px;
  font-size: 30px;
}
</style>
