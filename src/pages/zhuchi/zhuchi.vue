<template>
<div>
  <!-- 主持口令登录界面 -->
  <van-row style="height:50vh;line-height:50vh;">
    <svg-icon icon-class="cup" style="vertical-align: middle;font-size:15rem;"></svg-icon>
  </van-row>
  <van-row  v-show="false"  style="height:15vh"></van-row>
  <van-row  class="platform" style="height:10vh">
    <span> 网络软件研发部抢答系统</span>
  </van-row>
  <van-row  v-show="false"  style="height:15vh"></van-row>
  <van-row  v-show="false"  type="flex" justify="center" style="margin-top:10vh; height:10vh" >
    <van-col :span="5">
      <van-tag
      color="#cd2323"
      class="left racename-left">主持口令</van-tag>
    </van-col>
    <van-col :span="15">
      <van-field
        v-model="zhuchiToken"
        border
        placeholder="点击输入文本"
        class="right racename-right">
      </van-field>
      </van-col>
  </van-row>
  <van-row  v-show="false"  style="margin-top:10vh; height:10vh;" >
    <van-button round class="one-start" @click="handleLogin">登录</van-button>
  </van-row>
  <van-row  style="height:10vh" type="flex" justify="center" >
    <van-col span="5">
      <van-tag
      color="#cd2323"
      class="left racename-left">竞赛名称</van-tag>
    </van-col>
    <van-col span="15">
      <van-field
        v-model="raceName"
        border
        type="string"
        placeholder="点击输入文本"
        class="right racename-right">{{raceName}}</van-field>
    </van-col>
  </van-row>
  <van-row  style="height:10vh" type="flex" justify="center"  >
    <van-col span="5">
      <van-tag
      color="#cd2323"
      class="left racename-left">主办方</van-tag>
    </van-col>
    <van-col span="15">
      <van-field
        v-model="holder"
        border
        type="string"
        placeholder="点击输入文本"
        class="right racename-right">{{holder}}</van-field>
    </van-col>
  </van-row>
  <van-row  style="height:10vh" type="flex" justify="center" class1="row-input team-number">
    <van-col span="5">
      <van-tag
      color="#cd2323"
      class="left teamNumber-left">战队个数</van-tag>
    </van-col>
    <van-col span="15">
      <van-stepper
        integer
        v-model="teamNumber"
        input-width="60px"
        button-size="50px"
        class="teamNumber-right"
      />
    </van-col>
  </van-row>
  <!-- <van-row  style="height:10vh"  class1="row-gettoken">
    <van-col offset="12" span="12">
      <van-button :disabled="isCreate" class="gettoken-button" @click="handleGetTokens">生成口令</van-button>
    </van-col>
  </van-row>
  <van-row  style="height:10vh" class1="row-tokens" gutter="20" type="flex" justify="center">
    <van-col class="random-value" v-for="(random) in tokens" :key="random"><u>{{random}}</u></van-col>
  </van-row> -->
  <van-row  style="height:10vh" class1="row-button">
    <van-button round class="one-start" :disabled="isSet" @click="handleInitRace">生成竞赛</van-button>
  </van-row>
  <van-row  style="height:10vh; line-height:10vh;" class="row-number" >
    <span>
      第<span class="two-currentNumber">{{questionIndex}}</span>题
    </span>
  </van-row>
  <van-row v-show="true" style="height:10vh; line-height:10vh;" type="flex" justify="space-around" >
      <van-col span="9">
        <van-button plain class="btn" :disabled="isBtn" @click="handleShowAnswer">显示答案</van-button>
      </van-col>
      <van-col span="9">
        <van-button plain class="btn" :disabled="!isBtn" @click="handleNextQuestion">下一题</van-button>
      </van-col>
  </van-row>
  <van-row style="height:10vh; line-height:10vh; padding-left:4vh" class="row-title">
      <span style="vertical-align: bottom;">
        <svg-icon class="compute-icon" icon-class="compute"></svg-icon>
        战队计分
      </span>
  </van-row>
  <van-row style="height:70vh" >
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
  <van-row style="height:10vh;line-height:10vh;"  >
      <van-button style="vertical-align: middle;" class="two-start" @click="handleBeginRace">开始竞赛</van-button>
  </van-row>
  <van-row style="height:10vh;margin-top:10vh;" >
      <van-button :disabled="isEnd" class="two-start" @click="handleEndRace">结束竞赛</van-button>
  </van-row>
</div>
</template>

<script>
import {Judge} from '../client'
export default {
  name: 'Judge',
  data() {
    return {
      step: '', // nologin, init,
      type: 'viewToken',
      zhuchiToken: '',
      raceName: '',
      holder: '',
      teamNumber: 4,
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
      } else {
        return false
      }
    },
    // 显示得到的随机数口令
    handleInitRace() {
      if (this.raceName !== '' && this.holder !== '') {
        this.judge.initRace(this.raceName, this.holder, this.teamNumber)
      } else {
        return false
      }
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
      const {raceName, holder, raceMode, beginTime, enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
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
.row-number{
  background:#cd2323;
  font-size: 30px;
  color:#fff;
  vertical-align: middle;
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
  font-size: 20px;
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
.row-icon{
  text-align: center;
  padding-top: 6vh;
}
.platform{
  font-size: 1.5rem;
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
.row-input{
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
.row-button{
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
