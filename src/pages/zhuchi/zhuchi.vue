<template>
<div class="main-zhuchi">
  <!-- 主持登录界面 -->
  <div v-if="showOne" class="zhuchi-one">
    <van-row :span="4" class="row-icon">
      <svg-icon icon-class="cup"></svg-icon>
      <div class="one-platform">{{platform}}</div>
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
          input-width="60px"
          button-size="50px"
          class="teamNumber-right"
        />
      </van-col>
    </van-row>
    <van-row :span="2" class="row-gettoken">
      <van-col offset="12" span="12"><van-button :disabled="isCreate" class="gettoken-button" @click="getTokens">生成口令</van-button></van-col>
    </van-row>
    <van-row :span="4" class="row-tokens" gutter="20" type="flex" justify="center">
      <van-col class="random-value" v-for="(random) in tokens" v-bind:key="random"><u>{{random}}</u></van-col>
    </van-row>
    <van-row :span="4" class="row-start">
      <van-button round class="one-start" :disabled="isStart" @click="start">开始竞赛</van-button>
    </van-row>
  </div>
  <!-- 主持人操作界面 -->
  <div v-else class="zhuchi-two">
    <van-row :span="4" class="row-number">
      <span>
        第<span class="two-currentNumber">{{currentNumber}}</span>题
      </span>
    </van-row>
    <van-row :span="2" type="flex" justify="space-around" class="row-btn">
        <van-col span="9">
          <van-button plain class="btn" :disabled="isBtn" @click="showAnswer">显示答案</van-button>
        </van-col>
        <van-col span="9">
          <van-button plain class="btn" :disabled="!isBtn" @click="nextNumber">下一题</van-button>
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
        :data="computeData">
        <el-table-column
          prop="teamName"
          label="战队名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="分数"
          align="center">
          <template slot-scope="scope">
            <van-stepper
              integer
              v-model="scope.row.teamScore"
              @change="changeValue"
              input-width="40px"
              button-size="40px"
              class="teamNumber-right"
              />
          </template>
        </el-table-column>
        </el-table>
    </van-row>
    <van-row :span="4" class="row-end">
        <van-button :disabled="isEnd" class="two-start" @click="endRace">结束竞赛</van-button>
    </van-row>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      showOne: true, // true为登录界面，false为操作界面
      platform: '知识竞赛平台',
      raceName: '',
      setNumber: 5,
      teamNumber: 0,
      isCreate: false, // 生成口令按钮 false可点击
      isStart: true, // 开始比赛按钮 false可点击
      tokens: [],
      currentNumber: 15,
      isBtn: false, // 为true时“下一题”按钮可点击，为false时“显示答案”按钮可点击
      isEnd: false, // 为false时结束竞赛”按钮可点击，为true不可点击
      computeData: [],
      show_answer: false
    }
  },
  methods: {
    getTokens() {
      var data = this.getdata().config
      if (this.raceName !== '' && this.setNumber !== null) {
        const loginInfo = {
          'raceName': this.raceName,
          'setNumber': this.setNumber
        }
        localStorage.setItem('战队个数', JSON.stringify(loginInfo))
        this.tokens = data.tokens
        this.isCreate = true
        this.isStart = false
      }
    },
    start() {
      this.showOne = false
    },
    showAnswer() {
      // 显示答案按钮点击后，传到后台一个布尔类型的值show_answer来控制screen界面的是否显示答案
      this.show_answer = true
      this.isBtn = !this.isBtn
    },
    nextNumber() {
      // ???加数字1而不是字符串1
      this.currentNumber += 1
      this.isBtn = !this.isBtn
    },
    changeValue(value) {
      this.computeData.teamScore = value
      // 将战队分数和口令绑定在一起。发送到后台，后台发到screen界面
      // ？？？如何绑定在一起存储。
      const scoreInfo = {
        'teamToken': this.computeData.teamToken,
        'teamScore': this.computeData.teamScore
      }
      localStorage.setItem('战队分数', JSON.stringify(scoreInfo))
    },
    endRace() {
      this.isEnd = true
    },
    login() {
      var data = this.getdata().config
      var data1 = JSON.parse(localStorage.getItem('战队个数'))
      if (data1.raceName !== '' && data1.setNumber !== '') {
        this.showOne = false
        this.computeData = data.computeData
      }
    },
    getdata() {
      /**
       * 要传到后台数据:
       * raceName
       * show_answer 控制答案显示
       * currentNumber
       * teamToken+teamScore
       */
      // 从后台得到的数据如下
      return {
        config: {
          tokens: ['0921', '1108', '1128', '6666', '0715'],
          computeData: [
            {
              teamToken: '0921',
              teamName: '小分队',
              teamScore: '1'
            },
            {
              teamToken: '1108',
              teamName: '加油队123',
              teamScore: '1'
            },
            {
              teamToken: '1128',
              teamName: '强强联盟',
              teamScore: '1'
            },
            {
              teamToken: '6666',
              teamName: '薛定谔的猫',
              teamScore: '1'
            },
            {
              teamToken: '0715',
              teamName: '@未来可期 事无蹉跎',
              teamScore: '1'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.login()
  }
}
</script>

<style>
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
.row-title{
  text-align: left!important;
  color: #cd2323;
  float: left;
  font-size: 20px;
  margin: 2vh auto 0 4vh;
  width: 100vh;
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
  font-size: 180px;
}
.row-icon{
  text-align: center;
  padding-top: 6vh;
}
.one-platform{
  font-size: 40px;
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
  padding: 8vh 0 4vh 0;
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
</style>
