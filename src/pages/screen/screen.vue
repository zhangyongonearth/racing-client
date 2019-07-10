<template>
<div class="main-zhuchi" :style="backImage">
  <!-- 还有4个小时。标题栏 -->
  <el-row :span="6" class="header">
    <div class="header-main">
      <el-col :span="1" >
        <img class="header-img" src="./images/logo1.png">
      </el-col>
      <el-col :span="15" class="header-left">
        <div class="header-text">{{raceName}}</div>
      </el-col>
      <el-col :span="6" class="header-right">
        <el-row class="header-right-top">
          <el-col :span="12">{{apartment}}</el-col>
          <el-col :span="12">
            <el-date-picker
              class = "data-picker"
              v-model="value1"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row class="header-right-bottom">
          <el-col :span="12">{{useTime}}</el-col>
          <el-col :span="12" id="showtime">{{time}}</el-col>
        </el-row>
      </el-col>
  </div>
  </el-row>
  <!-- 主要内容 -->
  <el-row :span="18">
    <!-- 题目问题 答案 -->
    <el-col :span="12"><div class="grid-content grid-content-left">
      <el-row :span="4" class="border title title-question">
        <svg-icon icon-class="file"></svg-icon>题目:{{currentNum}}
      </el-row>
      <el-row :span="18" class="border opacity question"><div v-html="question"></div></el-row>
      <el-row :span="2" class="border opacity correct-answer">
        <svg-icon icon-class="showanswer"></svg-icon>正确答案：<span v-show="showAnswer">{{correctAnswer}}</span></el-row>
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
        :default-sort = "{prop: 'score', order: 'descending'}">
        <el-table-column
          type="index"
          label="排名"
          width="120px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="组名"
          align="center">
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
          <template>

          </template>
        </el-table-column>
        </el-table>
      </el-row>
    </div></el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'screen',
  data() {
    return {
      apartment: '网络软件研发部',
      data: '2019-07-10',
      useTime: '比赛用时',
      time: '30:12',
      activedRace: '',
      activedTeamToken: '8719', // 哪个组号抢到了答题权
      raceName: '党建知识竞赛',
      isLight: true,
      correctAnswer: 'AB',
      answer: '',
      currentNum: 0,
      showAnswer: true,
      question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
      tableData: [
        {
          teamToken: '8917',
          name: 'karroy1',
          score: '53',
          answer: 'ABCDE'
        },
        {
          teamToken: '6634',
          name: 'karroy2',
          score: '45',
          answer: 'ABCD'
        },
        {
          teamToken: '6634',
          name: 'karroy3',
          score: '20',
          answer: 'ABC'
        }],
      backImage: {
        backgroundImage: 'url(' + require('./images/back.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: '',
      value2: ''
    }
  },
  methods: {
    // 从后台传过来的数据
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    computeTime() {
      const date1 = new Date()
      var hour = date1.getHours()
      var minute = date1.getMinutes()
      var second = date1.getSeconds()
      //  第一种方法：与返回得到的begintime相减得到用时
      // 第2种方法：打开页面直接从0：0位置增加
      this.time = hour + ':' + minute + ':' + second
    },
    login() {
      var data = this.getdata()
      this.tableData.name = data.config.tableData.name
      this.correctAnswer = data.config.correctAnswer
      this.raceName = data.config.info.raceName
      this.apartment = data.config.info.apartment
      this.currentNum = data.config.currentNum
      this.question = data.config.question
      // 什么时候显示答案
      // 在显示答案前，只显示第一个抢答这的答案。显示答案后，获取所有人的答案
      if (this.showAnswer === false) {
        if (this.tableData.teamToken === data.config.firstAnswer.teamToken) {
          this.tableData.answer = data.config.firstAnswer.answer
        }
      } else {
        this.tableData = data.config.allAnswer
      }
    },
    getdata() {
      // 需要从后台获取的数据
      return {
        config: {
          info: [
            {raceName: '践行社会主核心价值观你追我赶之知识竞赛',
              apartment: ''}
          ],
          beginTime: Date.now(), // 时间戳，后台返回的
          currentNum: 0,
          question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
          correctAnswer: 'ABCE',
          firstAnswer: [{teamToken: '', answer: ''}],
          allAnswer: [{teamToken: '', answer: ''}],
          tableData: [
            // {teamToken: '', name: '', score: 0, answer: ''}
            {
              teamToken: '8917',
              name: 'karroy1',
              score: '53',
              answer: 'ABCDE'
            },
            {
              teamToken: '6634',
              name: 'karroy2',
              score: '45',
              answer: 'ABCD'
            },
            {
              teamToken: '6634',
              name: 'karroy3',
              score: '20',
              answer: 'ABC'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.login()
    this.computeTime()
  },
  watch: {
    // 作用：监听比赛名称和队伍数量的变化
    'currentNum': function(newVal) {
      this.currentNum = newVal
    }
  }
}
</script>

<style>
.main-zhuchi{
  height: 100vh;
  color: #fff;
}
.header{
  margin: 0px;
  background:rgba(255,255,255,0.1);
}
.header-main{
  height: 15vh;
  margin: 50px 0px 50px 100px;
}
.header-left{
  font-size: 100px;
  padding: 0px;
}
.header-right{
  font-size: 60px;
  padding: 50px 50px;
}
.header-img{
  width: 300px;
  margin: 50px auto auto 0px;
}
.header-text{
  margin-left: 120px;
  display: inline;
  line-height: 15vh;
}
.el-date-editor.el-input{
  width: 250px!important;
}
.grid-content{
  margin: 20px 40px auto 40px;
}
.border{
  border:1px solid #CD2323;
}
.title{
  border-top-right-radius:25px;
  border-top-left-radius:25px;
  background: #CD2323;
  height: 6vh;
  padding-top:30px;
  font-size: 50px;
}
.opacity{
  border-bottom-right-radius:25px;
  border-bottom-left-radius:25px;
  padding: 50px 100px;
  background:rgba(255,255,255,0.1);
}
.question{
  font-size: 50px;
  height: 50vh;
  line-height: 100px;
  padding: 80px 100px;
  margin-bottom: 3vh;
}
.svg-icon{
  margin-right: 20px;
  margin-left:20px;
  font-size: 80px;
}
.correct-answer{
  border-radius: 25px;
  height: 10vh;
  font-size: 70px;
}
.right-bottom{
  padding: 50px 80px;
  border-bottom-right-radius:25px;
  border-bottom-left-radius:25px;
  height: 63vh;
  background:rgba(255,255,255,0.1);
}
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.table{
  border-radius: 0px;
  /* margin: 30px 50px auto 50px; */
  padding: 0;
}
tr{
  height: 100px;
}
.cell{
  height: 80px;
  line-height: 80px;
}
</style>
