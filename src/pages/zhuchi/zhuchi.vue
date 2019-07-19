<template>
<div class="main-zhuchi">
  <!-- 主持口令登录界面 -->
  <div v-if="type==='viewToken'" class="zhuchi-one">
    <van-row :span="4" class="row-icon">
      <svg-icon icon-class="cup"></svg-icon>
      <div class="one-platform">主持人口令登录</div>
    </van-row>
    <van-row :span="5" type="flex" justify="center" class="row-name">
      <van-col :span="5">
        <van-tag
        color="#cd2323"
        class="left racename-left">主持口令</van-tag>
      </van-col>
      <van-col :span="15">
        <van-field
          v-model="zhuchiToken"
          border
          type="number"
          placeholder="点击输入文本"
          class="right racename-right">
        </van-field>
       </van-col>
    </van-row>
    <van-row :span="4" class="row-start">
      <van-button round class="one-start" @click="handleLogin">登录</van-button>
    </van-row>
  </div>
  <!-- 主持比赛名称+队伍数量界面 -->
  <div v-else-if="type==='viewRename'" class="zhuchi-one">
    <van-row :span="4" class="row-icon">
      <svg-icon icon-class="cup"></svg-icon>
      <div class="one-platform">网络软件研发部知识竞赛系统</div>
    </van-row>
    <van-row :span="5" type="flex" justify="center" class="row-name">
      <van-col :span="5">
        <van-tag
        color="#cd2323"
        class="left racename-left">竞赛名称</van-tag>
      </van-col>
      <van-col :span="15">
        <van-field
          v-model="raceName"
          border
          type="string"
          placeholder="点击输入文本"
          class="right racename-right">{{raceName}}</van-field>
      </van-col>
    </van-row>
    <van-row :span="5" type="flex" justify="center" class="row-name">
      <van-col :span="5">
        <van-tag
        color="#cd2323"
        class="left racename-left">主办方</van-tag>
      </van-col>
      <van-col :span="15">
        <van-field
          v-model="holdName"
          border
          type="string"
          placeholder="点击输入文本"
          class="right racename-right">{{holdName}}</van-field>
      </van-col>
    </van-row>
    <van-row :span="5" type="flex" justify="center" class="row-name team-number">
      <van-col :span="5">
        <van-tag
        color="#cd2323"
        class="left teamNumber-left">战队个数</van-tag>
      </van-col>
      <van-col :span="15">
        <van-stepper
          integer
          v-model="setNumber"
          @change="handleSetNumber"
          input-width="60px"
          button-size="50px"
          class="teamNumber-right"
        />
      </van-col>
    </van-row>
    <van-row :span="2" class="row-gettoken">
      <van-col offset="12" span="12"><van-button :disabled="isCreate" class="gettoken-button" @click="handleGetTokens">生成口令</van-button></van-col>
    </van-row>
    <van-row :span="4" class="row-tokens" gutter="20" type="flex" justify="center">
      <van-col class="random-value" v-for="(random) in tokens" v-bind:key="random"><u>{{random}}</u></van-col>
    </van-row>
    <van-row :span="4" class="row-start">
      <van-button round class="one-start" :disabled="isSet" @click="handleSetRace">生成竞赛</van-button>
    </van-row>
  </div>
  <!-- 主持人操作-开始界面 -->
    <!-- 主持人操作 -->
  <div v-else-if="type==='viewStart'" class="zhuchi-two">
    <van-row :span="4" class="row-number" v-show="!show_btn">
      <span>
        第<span class="two-currentNumber">{{questionIndex}}</span>题
      </span>
    </van-row>
    <van-row :span="2" type="flex" justify="space-around" class="row-btn" v-show="!show_btn">
        <van-col span="9">
          <van-button plain class="btn" :disabled="isBtn" @click="handleShowAnswer">显示答案</van-button>
        </van-col>
        <van-col span="9">
          <van-button plain class="btn" :disabled="!isBtn" @click="handleNextQuestion">下一题</van-button>
        </van-col>
    </van-row>
    <van-row :span="2" class="row-title">
      <el-col :span="12">
        <svg-icon class="compute-icon" icon-class="compute"></svg-icon>战队计分
      </el-col>
    </van-row>
    <van-row :span="10">
      <el-table
        highlight-current-row
        :data="scoreData">
        <el-table-column
          prop="name"
          label="战队名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="分数"
          align="center">
          <template slot-scope="scope">
            <van-stepper
              integer
              v-model="scope.row.score"
              @change="handleChangeScore(scope.row)"
              input-width="40px"
              button-size="40px"
              class="teamNumber-right"
              />
          </template>
        </el-table-column>
        </el-table>
    </van-row>
    <van-row :span="4" class="row-end" v-show="show_btn">
        <van-button class="two-start" @click="handleBeginRace">开始竞赛</van-button>
    </van-row>
    <van-row :span="4" class="row-end" v-show="!show_btn">
        <van-button :disabled="isEnd" class="two-start" @click="handleEndRace">结束竞赛</van-button>
    </van-row>
  </div>
</div>
</template>

<script>
import {Judge} from '../client'
export default {
  data() {
    return {
      type: 'viewToken',
      zhuchiToken: '',
      raceName: '',
      holdName: '',
      setNumber: 0,
      teamNumber: 0,
      isCreate: false, // 生成口令按钮 false可点击
      isSet: true, // 生成比赛按钮 false可点击
      tokens: [],
      show_btn: true, // true是开始竞赛界面。false是结束竞赛界面
      questionIndex: 0,
      isBtn: true, // 为true时“下一题”按钮可点击，为false时“显示答案”按钮可点击
      isEnd: false, // 为false时结束竞赛”按钮可点击，为true不可点击
      scoreData: []
    }
  },
  methods: {
    // 主持人口令登录按钮
    handleLogin() {
      if (this.zhuchiToken !== '') {
        localStorage.setItem('主持口令', this.zhuchiToken)
        this.judge.login(this.zhuchiToken)
        // if (localStorage.getItem('当前界面') && localStorage.getItem('当前界面') === 'viewStart') {
        //   this.type = 'viewStart'
        // } else {
        //   this.type = 'viewRename'
        //   localStorage.setItem('当前界面', this.type)
        // }
      } else {
        return false
      }
    },
    // 改变队伍数量按钮
    handleSetNumber(value) {
      this.teamNumber = value
    },
    // 显示得到的随机数口令
    handleGetTokens() {
      if (this.raceName !== '' && this.holdName !== '') {
        // this.judge.initRace(this.raceName, this.holdName, this.teamNumber)
        this.judge.initRace(this.raceName, this.teamNumber)
      } else {
        return false
      }
    },
    // 生成竞赛按钮
    handleSetRace() {
      this.type = 'viewStart'
      localStorage.setItem('当前界面', this.type)
    },
    // 开始比赛按钮
    handleBeginRace() {
      this.judge.beginRace()
      this.show_btn = false
    },
    // 显示答案按钮
    handleShowAnswer() {
      this.judge.showAnswer(this.questionIndex)
      this.isBtn = !this.isBtn
    },
    // 下一题按钮
    handleNextQuestion() {
      this.judge.nextQuestion()
      this.isBtn = !this.isBtn
    },
    // 改变分数按钮
    handleChangeScore(value) {
      this.judge.changeScore(value.teamToken, value.score)
    },
    // 结束竞赛按钮
    handleEndRace() {
      this.judge.endRace()
    },
    onConnect(data) {
      const {raceName, enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
      // if(raceName==='' &&holdName==='') 服务端添加holdName后，该这么写。
      if (raceName === '') {
        this.type = 'viewRename'
        // ？？？缺少口令生成后如何中断恢复
      } else {
        this.type = 'viewStart'
      }
      if (enableAnswer) this.enableAnswer = enableAnswer
      if (questionIndex > 0) {
        // 若questionIndex大于0，显示有结束竞赛按钮的界面。
        this.questionIndex = questionIndex
        this.show_btn = false
      } else {
        this.show_btn = true
      }
      if (updateTime) this.updateTime = updateTime
      if (activeTeam) this.activeTeam = activeTeam
      if (teams) {
        for (var j in teams) {
          this.scoreData.push({name: teams[j]['name'], score: teams[j]['score'], teamToken: j, answer: ''})
        }
        // 答案为空，当前状态为下一题按钮。若不为空，当前状态为显示答案按钮isBtn=false
        this.isBtn = true
        for (var m in teams) {
          for (var n in teams[m]) {
            if (teams[m][n]['answer'] !== '') {
              this.isBtn = false
              break
            }
          }
        }
      }
    },
    onInitRace(data) {
      const {teamTokens} = data
      this.tokens = teamTokens
      this.isCreate = true
      this.isSet = false
    },
    onBeginRace(data) {
      const { enableAnswer, beginTime, questionIndex } = data
      this.enableAnswe = enableAnswer
      this.beginTime = beginTime
      this.questionIndex = questionIndex
    },
    onNextQuestion(data) {
      const { questionIndex, question, score, updateTime, enableAnswer } = data
      this.questionIndex = questionIndex
      this.question = question
      this.score = score
      this.updateTime = updateTime
      this.enableAnswer = enableAnswer
    },
    onShowAnswer(data) {
      const { answer, answers, enableAnswer } = data
      this.answer = answer
      this.answers = answers
      this.enableAnswer = enableAnswer
    },
    onChangeScore(data) {
      const { teams } = data
      for (var i in teams) {
        this.scoreData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: ''})
      }
    },
    onEndRace(data) {
      const { enableAnswer, closed } = data
      this.enableAnswer = enableAnswer
      this.closed = closed
    },
    onRename(data) {
      const { teams} = data
      this.scoreData = []
      for (var i in teams) {
        this.scoreData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: ''})
      }
    }
    // onAnswer(data) {
    //   const { teamToken, activeTeam, enableAnswer } = data
    //   this.teamToken = teamToken
    //   this.activeTeam = activeTeam
    //   this.enableAnswer = enableAnswer
    // }
  },
  mounted() {
    this.judge = new Judge()
    const self = this
    this.judge.onmessage = function(resp) {
      console.log('this is judge onmessage')
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
  }
}
</script>

<style>
/* html {
  font-size : 10px;
}
@media only screen and (min-width: 720px){
  html {
    font-size: 11.25px !important;
  }
}
@media only screen and (min-width: 960px){
  html {
    font-size: 15px !important;
  }
} */
.row-number{
  background:#cd2323;
  font-size: 30px;
  color:#fff;
  padding: 3vh;
  margin-bottom: 2vh;
}
.two-currentNumber{
  color: #cd2323;
  background: #fff;
  padding: 0 15px;
  margin: 0 25px;
}
.btn{
  width: 18vh;
  border:1px solid #cd2323!important;
  color:#cd2323!important;
}
.btn:focus{
  background: #cd2323;
  color:#fff!important;
}
.zhuchi-c{
  margin-top: 5vh;
}
.row-title{
  text-align: left!important;
  color: #cd2323;
  float: left;
  font-size: 20px;
  margin: 2vh auto 0 4vh;
  width: 30vh;
}
.compute-icon{
  font-size: 30px!important;
  margin-right: 10px;
}
.two-start{
  height: 7vh!important;
  font-size: 18px!important;
  width: 40vh!important;
  background: #cd2323!important;
  color: #fff!important;
}
.row-end{
  padding-top:3vh;
}
.svg-icon{
  font-size: 15rem;
}
.row-icon{
  text-align: center;
  padding-top: 6vh;
}
.one-platform{
  font-size: 2rem;
  color: #cd2323;
}
.van-row{
  text-align: center;
}
.van-col--5{
  width: auto!important;
}
.van-tag{
  background-color: rgb(205, 35, 35)!important;
  line-height: 24px!important;
  font-size: 12px!important;
  padding: 10px 15px!important;
  border-radius: 0em!important;
  border: 1px solid #cd2323;
}
.right{
  border: 1px solid #cca;
}
.row-name{
  padding: 3rem 0 2rem 0;
}
.team-number{
  padding: 0;
}
.row-gettoken{
  margin: 2vh 0;
}
.gettoken-button{
  color: #cd2323!important;
  border: none!important;
}
.row-start{
  padding-top:8vh;
}
.one-start{
  height: 7vh!important;
  font-size: 18px!important;
  width: 40vh!important;
  background: #cd2323!important;
  color: #fff!important;
}
.el-table{
  table-layout:fixed;
}
</style>
