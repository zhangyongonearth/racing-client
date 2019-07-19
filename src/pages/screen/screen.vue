<template>
<el-container class="container">
  <!-- 20vh -->
  <el-header height="18vh" style="margin-bottom:2vh;" class="opacity" >
      <el-col :span="19" style="font-size: 9vh; line-height: 18vh;">
        <!-- <img src="./images/logo.png" style="vertical-align: middle; height:10vh" /> -->
        {{raceName}}
      </el-col>
      <el-col :span="2" >
        <el-row style="height:9vh; padding-top:4vh; font-size:2vh;">比赛用时</el-row>
        <el-row style="height:9vh; padding-bottom:4vh; font-size:2.5vh;">
          <span class="ues-time">{{useTime.minute}}</span>分<span class="ues-time">{{useTime.second}}</span>秒
        </el-row>
      </el-col>
      <el-col :span="3" >
        <el-row style="height:9vh; padding-top:4vh; font-size:2vh;">{{holder}}</el-row>
        <el-row style="height:9vh; padding-bottom:4vh; font-size:2.5vh;">{{currentDate}}</el-row>
      </el-col>
  </el-header>
  <el-main style="padding:0 1vw 0 1vw">
    <el-col :span="12">
      <!-- 6vh -->
      <el-row class="border title border-top-radius">
        <svg-icon icon-class="file" style="font-size:3vh;"></svg-icon>题目:{{questionIndex}}
      </el-row>
      <!-- 60vh -->
      <el-row style="height:60vh; line-height:6vh; padding:20px;" class="border opacity border-bottom-radius">
        <div v-html="question"></div>
      </el-row>
      <!-- 14vh -->
      <el-row style="height:8vh; line-height:8vh; margin-top:3vh; margin-bottom:3vh; font-size:3vh" class="border opacity border-bottom-radius border-top-radius">
        <svg-icon icon-class="showanswer"></svg-icon>正确答案：&nbsp;&nbsp;&nbsp;&nbsp;
        {{correctAnswer}}
      </el-row>
    </el-col>
    <el-col :span="11" :offset="1">
      <!-- 6vh -->
      <el-row class="border title border-top-radius">
        <svg-icon icon-class="group"></svg-icon>各组战况
      </el-row>

      <el-row style="height:71vh;" class="border opacity border-bottom-radius">
        <table class="table table-striped table-inverse table-bordered">
            <thead class="thead-inverse">
                <tr>
                    <th>排名</th>
                    <th>组名</th>
                    <th>分数</th>
                    <th>答案</th>
                </tr>
            </thead>
            <transition-group name="flip-list" tag="tbody">
                <tr :class="{'is-active':(item.teamToken === activeTeam)}" v-for="(item,index) in tableData" :key="item.teamToken">
                    <td>{{index + 1}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.score}}</td>
                    <td>{{item.answer}}</td>
                </tr>
            </transition-group>
        </table>
      </el-row>
    </el-col>
  </el-main>
</el-container>
</template>

<script>
import { setInterval, clearInterval} from 'timers'
import {Screen} from '../client'
export default {
  name: 'Screen',
  data() {
    return {
      holder: '等待主持人输入主办方',
      currentDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      useTime: {
        minute: '00',
        second: '00'
      },
      raceName: '等待主持人输入比赛名称',
      beginTime: '', //
      correctAnswer: '',
      questionIndex: '',
      question: '',

      timer: '',
      activeTeam: '',
      tableData: [], // watch serverTeams 生成table数据
      serverTeams: {}
    }
  },
  watch: {
    serverTeams: {
      deep: true,
      handler() {
        this.tableData = []
        for (var i in this.serverTeams) {
          this.tableData.push({name: this.serverTeams[i]['name'], score: this.serverTeams[i]['score'], teamToken: i, answer: ''})
        }
        this.tableData.sort((x, y) => {
          return y['score'] - x['score']
        })
      }
    }
  },
  methods: {
    computeUsedTime(newTime) {
      if (!newTime) { newTime = new Date().getTime() }
      const mss = newTime - this.beginTime
      const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
      const s = (mss % (1000 * 60)) / 1000 // 得到秒数
      const minutes = Math.floor(m)
      const seconds = Math.floor(s)
      this.useTime.minute = minutes < 10 ? ('0' + minutes) : minutes
      this.useTime.second = seconds < 10 ? ('0' + seconds) : seconds
    },
    setTimer() {
      var self = this
      this.timer = setInterval(() => {
        self.computeUsedTime()
      }, 1000)
    },
    tableRowClassName({row, rowIndex}) {
      if (row.index && row.index === 1) {
        return 'warning-row'
      }
    },
    onConnect(data) {
      const {raceName, holder, beginTime, endTime, questionIndex, question, activeTeam, teams} = data
      if (raceName) this.raceName = raceName
      if (holder) this.holder = holder
      if (endTime) {
        this.beginTime = beginTime
        this.endTime = endTime
        this.computeUsedTime(endTime)
      } else {
        if (beginTime) {
          this.beginTime = beginTime
          this.setTimer()
        }
      }
      if (questionIndex) this.questionIndex = questionIndex
      if (question) this.question = question
      if (activeTeam) this.activeTeam = activeTeam
      if (teams) {
        this.serverTeams = teams
      }
      console.log(data)
    },
    onInitRace(data) {
      const {raceName, holder} = data
      this.raceName = raceName
      this.holder = holder
    },
    onBeginRace(data) {
      const { beginTime} = data
      this.beginTime = beginTime
      this.setTimer()
    },
    onNextQuestion(data) {
      const { questionIndex, question } = data
      this.questionIndex = questionIndex
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
      this.tableData.forEach((v, i) => {
        if (v.teamToken === teamToken) {
          this.tableData[i]['score'] = newValue
          return false
        }
      })
      this.tableData.sort((x, y) => {
        return y['score'] - x['score']
      })
    },
    onEndRace(data) {
      this.screen.quit()
      clearInterval(this.timer)
    },
    onRename(data) {
      // const {token, name} = data
      // this.tableData.forEach((v, i) => {
      //   if (v.teamToken === token) {
      //     this.tableData[i]['name'] = name
      //   }
      // })
      const { teams} = data
      this.serverTeams = teams
      // this.tableData = []
      // for (var i in teams) {
      //   this.tableData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: ''})
      // }
    },
    onAnswer(data) {
      const { activeTeam, teamToken, answer } = data
      this.activeTeam = activeTeam
      this.tableData.forEach((v, i) => {
        if (v.teamToken === teamToken) {
          this.tableData[i]['answer'] = answer || '****'
          return false
        }
      })
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
  }
}
</script>

<style>
body{
  margin:0;
  padding:0px;
  min-width: 1280px;
  min-height: 640px;
  box-sizing: border-box;

}
.container{
  background: url('./images/back.png');
  background-size: 100% 100%;
  color: #fff;
}
.ues-time{
  color: #ff0000;
  background:#fff;
  margin-top: 0;
}
.border{
  border:1px solid #CD2323;
}
.title{
  height:6vh;
  line-height:6vh;
  font-size:3vh;
  background: #CD2323;
}
.opacity{
  background:rgba(255,255,255,0.1);
}
.border-top-radius{
  border-top-right-radius:5px;
  border-top-left-radius:5px;
}
.border-bottom-radius{
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
}
.svg-icon{
  margin-right: 10px;
  margin-left: 10px;
}
.el-table .warning-row {
  background: #F9AB00;
}
.el-table .success-row {
  background:rgba(255,255,255,0.1);
}
.table{
  width: 100%;
  border-radius: 0px;
  padding: 0;
}
.el-table__row{
  height: 10vh;
}
th{
  height: 10vh;
}
.answer-icon{
 padding: 20px;
 font-size: 15px;
}
/* .flip-list-move,.flip-list-enter-active, .flip-list-leave-active {transition: 1s;}
.flip-list-leave-active{position:absolute;}
.flip-list-enter, .flip-list-leave-to{opacity: 0;transform: translateY(30px);} */
td{
  text-align: center;
}
table tr {
    font-size: 20px;
    height: 10vh;
}
.flip-list-move{
  transition: transform 1s;
}
.is-active{
  background:rgba(0,0,0,.1);
}
</style>
