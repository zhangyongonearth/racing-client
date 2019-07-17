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
        <svg-icon icon-class="file"></svg-icon>题目:{{currentNumber}}
      </el-row>
      <el-row :span="18" id="question-sizeof" class="border opacity question"><div v-html="question"></div></el-row>
      <el-row :span="2" class="border opacity correct-answer">
        <el-col :span="7" class="answer-icon"><svg-icon icon-class="showanswer"></svg-icon>正确答案：</el-col>
        <el-col :span="10" v-show="showAnswer">

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
            <span>{{scope.row.teamName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="teamScore"
          label="分数"
          align="center">
        </el-table-column>
        <el-table-column
          label="答案"
          align="center">
          <template slot-scope="scope">
            <div id="all-answer" class="all-answer">{{scope.row.teamAnswer}}</div>
          </template>
        </el-table-column>
        </el-table>
      </el-row>
    </div></el-col>
  </el-main>
</el-container>
</template>

<script>
import { setInterval } from 'timers'
import { Screen } from '../client'
export default {
  name: 'screen',
  data() {
    return {
      apartment: '网络软件研发部党支部',
      currentDate: '2019-07-15',
      useTime: {
        minute: '00',
        second: '00'
      },
      raceName: '践行社会主义核心价值观之知识竞赛',
      beginTime: '', //
      correctAnswer: '',
      teamAnswer: [
        {
          teamToken: '0921',
          teamAnswer: 'A'
        },
        {
          teamToken: '1108',
          teamAnswer: 'AB'
        },
        {
          teamToken: '1128',
          teamAnswer: 'ABC'
        },
        {
          teamToken: '6666',
          teamAnswer: 'ABCD'
        },
        {
          teamToken: '0715',
          teamAnswer: 'ABCDE'
        }
      ],
      currentNumber: null,
      showAnswer: false,
      question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益.',
      tableData: [
        {
          teamToken: '0921',
          teamName: '小分队',
          teamScore: '53',
          teamAnswer: ''
        },
        {
          teamToken: '1108',
          teamName: '加油队123',
          teamScore: '45',
          teamAnswer: ''
        },
        {
          teamToken: '1128',
          teamName: '强强联盟',
          teamScore: '20',
          teamAnswer: ''
        },
        {
          teamToken: '6666',
          teamName: '薛定谔的猫',
          teamScore: '45',
          teamAnswer: ''
        },
        {
          teamToken: '0715',
          teamName: '@未来可期 事无蹉跎',
          teamScore: '20',
          teamAnswer: ''
        }
      ]
    }
  },
  methods: {
    computeTime() {
      const newTime = new Date().getTime()
      var mss = newTime - this.beginTime
      const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
      const s = (mss % (1000 * 60)) / 1000 // 得到秒数
      const minutes = Math.floor(m)
      const seconds = Math.floor(s)
      this.useTime.minute = minutes < 10 ? ('0' + minutes) : minutes
      this.useTime.second = seconds < 10 ? ('0' + seconds) : seconds
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    onConnect(data) {
      const {enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
    },
    onInitRace(data) {
      const {raceName, raceMode, teamCount, beginTime, enableAnswer} = data
    },
    onBeginRace(data) {
      const { enableAnswer, beginTime, questionIndex } = data
    },
    onNextQuestion(data) {
      const { questionIndex, question, score, updateTime, enableAnswer } = data
    },
    onShowAnswer(data) {
      const { answer, answers, enableAnswer } = data
    },
    onChangeScore(data) {
      const { teams } = data
    },
    onEndRace(data) {
      const { enableAnswer, closed } = data
    },
    onRename(data) {
      const { teams } = data
    },
    onAnswer(data) {
      const { teamToken, activeTeam, enableAnswer } = data
    }
  },
  mounted() {
    this.screen = new Screen()
    this.screen.login()
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
  },
  watch: {
    beginTime: function(beginTime) {
      setInterval(this.computeTime, 1000)
    }
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
