<template>
<div class="main-xuanshou">
  <!-- 选手口令界面 -->
  <div v-if="type==='zero'" class="xuanshou-one">
      <van-row :span="4" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="5" type="flex" justify="center" class="row-name">
        <van-col :span="5">
          <van-tag
          color="#cd2323"
          class="left teamToken-left">战队口令</van-tag>
        </van-col>
        <van-col :span="15">
        <van-field
          v-model="teamToken"
          border
          type="number"
          placeholder="点击输入文本"
          class="right teamToken-right"></van-field>
        </van-col>
      </van-row>
      <van-row :span="4" class="row-start">
        <van-button round class="one-start" @click="tokenLogin">登录</van-button>
      </van-row>
  </div>
  <!-- 选手名字界面 -->
  <div v-else-if="type==='one'" class="xuanshou-one">
      <van-row :span="4" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="5" type="flex" justify="center" class="row-name">
        <van-col :span="5">
          <van-tag
          color="#cd2323"
          class="left teamname-left">战队名称</van-tag>
        </van-col>
        <van-col :span="15">
          <van-field
            v-model="teamName"
            border
            type="string"
            placeholder="点击输入文本"
            class="right teamname-right">{{teamName}}</van-field>
        </van-col>
      </van-row>
      <van-row :span="4" class="row-start">
        <van-button round class="one-start" @click="start">开始答题</van-button>
      </van-row>
  </div>
  <!-- 选项界面 -->
  <div v-else-if="type==='two'" class="xuanshou-two">
    <van-row class="row-number">
      <span>
        第<span class="two-currentNumber">{{currentNumber}}</span>题
      </span>
    </van-row>
    <van-row type="flex" justify="space-between" class="row-options">
      <van-col class="col-options">
        <van-button id="btnA" :disable="notClickA" @click="clickA" class="option-button">A</van-button>
        <van-button id="btnB" :disable="notClickB" @click="clickB" class="option-button">B</van-button>
        <van-button id="btnC" :disable="notClickC" @click="clickC" class="option-button">C</van-button>
        <van-button id="btnD" :disable="notClickD" @click="clickD" class="option-button">D</van-button>
        <van-button id="btnE" :disable="notClickE" @click="clickE" class="option-button">E</van-button>
      </van-col>
    </van-row>
    <van-row :span="4" class="row-start">
        <van-button round :disabled="isSubmit" class="two-start" @click="submit">提交</van-button>
    </van-row>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      type: 'zero',
      // showOne: true, // true为登录界面，false为选项界面
      raceName: '党建知识竞赛',
      teamName: '',
      teamToken: '',
      currentNumber: 15,
      teamAnswer: [], // 存放选手选择的答案
      notClickA: false, // true不可点击
      notClickB: false, // true不可点击
      notClickC: false, // true不可点击
      notClickD: false, // true不可点击
      notClickE: false, // true不可点击
      isSubmit: false // true不可点击
    }
  },
  methods: {
    clickA() {
      this.teamAnswer.push('A')
      document.getElementById('btnA').style.backgroundColor = '#f9ab00'
      document.getElementById('btnA').style.color = '#fff'
      if (this.notClickA === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'A') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnA').style.backgroundColor = '#fff'
            document.getElementById('btnA').style.color = '#000'
          }
        }
      }
      this.notClickA = !this.notClickA
      console.log('1111' + this.teamAnswer)
    },
    clickB() {
      this.teamAnswer.push('B')
      document.getElementById('btnB').style.backgroundColor = '#f9ab00'
      document.getElementById('btnB').style.color = '#fff'
      if (this.notClickB === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'B') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnB').style.backgroundColor = '#fff'
            document.getElementById('btnB').style.color = '#000'
          }
        }
      }
      this.notClickB = !this.notClickB
      console.log('1111' + this.teamAnswer)
    },
    clickC() {
      this.teamAnswer.push('C')
      document.getElementById('btnC').style.backgroundColor = '#f9ab00'
      document.getElementById('btnC').style.color = '#fff'
      if (this.notClickC === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'C') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnC').style.backgroundColor = '#fff'
            document.getElementById('btnC').style.color = '#000'
          }
        }
      }
      this.notClickC = !this.notClickC
      console.log('1111' + this.teamAnswer)
    },
    clickD() {
      this.teamAnswer.push('D')
      document.getElementById('btnD').style.backgroundColor = '#f9ab00'
      document.getElementById('btnD').style.color = '#fff'
      if (this.notClickD === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'D') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnD').style.backgroundColor = '#fff'
            document.getElementById('btnD').style.color = '#000'
          }
        }
      }
      this.notClickD = !this.notClickD
      console.log('1111' + this.teamAnswer)
    },
    clickE() {
      this.teamAnswer.push('E')
      document.getElementById('btnE').style.backgroundColor = '#f9ab00'
      document.getElementById('btnE').style.color = '#fff'
      if (this.notClickE === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'E') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnE').style.backgroundColor = '#fff'
            document.getElementById('btnE').style.color = '#000'
          }
        }
      }
      this.notClickE = !this.notClickE
      console.log('1111' + this.teamAnswer)
    },
    tokenLogin() {
      if (this.teamToken !== '') {
        const teamToken = this.teamToken
        localStorage.setItem('战队口令', teamToken)
        this.type = 'one'
      } else {
        return false
      }
    },
    start() {
      // var existToken = false
      // var data = this.getdata().config
      // // 判断输入token是否存在于tokens
      // for (var i = 0; i < data.tokens.length; i++) {
      //   if (data.tokens[i] === this.teamToken) {
      //     existToken = true
      //   }
      // }
      if (this.teamName !== '') {
        const teamName = this.teamName
        localStorage.setItem('战队名字', teamName)
        this.type = 'two'
      } else {
        return false
      }
    },
    submit() {
      // 提交 所选答案+战队口令（口令从localStorage中获取）传给后台。后台再发送到screen界面
      // ???有点小问题 选项界面刷新出点问题
      var data1 = localStorage.getItem('战队口令')
      this.teamToken = data1.teamToken
      const answerInfo = {
        'teamToken': this.teamToken,
        'teamAnswer': this.teamAnswer
      }
      localStorage.setItem('战队答案', JSON.stringify(answerInfo))
      this.isSubmit = true// 提交答案后，按钮不可点击，当题号变化时才可
      const str = true
      localStorage.setItem('按钮状态', str)
    },
    login() {
      var data = this.getdata().config
      var data1 = localStorage.getItem('战队口令')
      var data2 = localStorage.getItem('战队名字')
      if (!data1 && data1.teamToken === '') {
        this.type = 'zero'
      } else if (!data2 && data2.teamName === '') {
        this.type = 'one'
      } else {
        this.type = 'two'
        this.currentNumber = data.currentNumber
      }
    },
    getdata() {
      /**
       * 要传到后台数据:
       * teamName+teamToken
       * teamToken+teamAnswer
       */
      // 从后台得到的数据如下
      return {
        config: {
          tokens: ['0921', '1108', '1128', '6666', '0715'],
          currentNumber: 22
        }
      }
    }
  },
  mounted() {
    this.login()
  },
  watch: {
    'currentNumber': function(newVal) {
      this.currentNumber = newVal
      this.isSubmit = false
    }
  }
}
</script>

<style>
.svg-icon{
  font-size: 180px;
}
.row-icon{
  text-align: center;
  padding-top: 12vh;
}
.one-racename{
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
.row-number{
  background:#cd2323;
  font-size: 30px;
  color:#fff;
  padding: 8vh;
  margin-bottom: 8vh;
}
.two-currentNumber{
  color: #cd2323;
  background: #fff;
  padding: 0 15px;
  margin: 0 25px;
}
.two-start{
  height: 7vh!important;
  font-size: 18px!important;
  width: 40vh!important;
  background: #cd2323!important;
  color: #fff!important;
}
.option-button{
  font-size: 35px!important;
  width: 40vh;
  background: lightcoral;
  border: 1px solid #000!important;
  margin: 1.5vh!important;
}
/* .button-option:focus{
  color:#fff;
  background: #f9ab00;
} */
</style>
