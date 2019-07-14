<template>
<div class="main-zhuchi">
  <!-- 标题栏 -->
  <el-row :span="6" class="header">
    <div class="header-main">
      <el-col :span="1" >
        <img class="header-img" src="./images/logo.png">
      </el-col>
      <el-col :span="16" class="header-left">
        <div class="header-text">{{raceName}}</div>
      </el-col>
      <el-col :span="7" class="header-right">
        <el-row class="header-right-top">
          <el-col :span="12">{{apartment}}</el-col>
          <el-col :span="12">{{currentDate}}</el-col>
        </el-row>
        <el-row class="header-right-bottom">
          <el-col :span="12" class="race-time">{{useTime}}</el-col>
          <el-col :span="12" class="showtime">
            <span class="ues-time">{{minute}}</span>:<span class="ues-time">{{second}}</span></el-col>
        </el-row>
      </el-col>
  </div>
  </el-row>
  <!-- 主要内容 -->
  <el-row :span="18">
    <!-- 题目问题 答案 -->
    <el-col :span="12"><div class="grid-content grid-content-left">
      <el-row :span="4" class="border title title-question">
        <svg-icon icon-class="file"></svg-icon>题目:{{currentNumber}}
      </el-row>
      <el-row :span="18" id="question-sizeof" class="border opacity question"><div v-html="question"></div></el-row>
      <el-row :span="2" class="border opacity correct-answer">
        <el-col :span="7" class="answer-icon"><svg-icon icon-class="showanswer"></svg-icon>正确答案：</el-col>
        <el-col :span="10" v-show="showAnswer">
          <vue-scratch-card
            class="scratch-card"
            element-id='scratchWrap1'
            :ratio='0.8'
            :move-radius='25'
            :start-callback='startCallback'
            :clear-callback='clearCallback'
            result-img=''
            cover-color='#caa'>
            <div class="scratch-card-result" slot='result'>{{correctAnswer}}</div>
          </vue-scratch-card>
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
        :default-sort = "{prop: 'score', order: 'descending'}">
        <el-table-column
          type="index"
          label="排名"
          width="200px"
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
  </el-row>
</div>
</template>

<script>
export default {
  name: 'screen',
  data() {
    return {
      apartment: '',
      currentDate: '2019-07-15',
      useTime: '比赛用时',
      minute: '',
      second: '',
      raceName: '',
      correctAnswer: '',
      teamAnswer: '',
      currentNumber: null,
      showAnswer: false,
      question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
      tableData: [{}]
    }
  },
  methods: {
    startCallback() {
      console.log('开始刮卡！')
    },
    clearCallback() {
      console.log('清除完毕！')
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    // 把时间转换成分秒
    computeTime() {
      var data = this.getdata()
      const startTime = data.config.beginTime // 得到毫秒
      const endTime = new Date().getTime()
      var mss = endTime - startTime
      const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
      const s = (mss % (1000 * 60)) / 1000 // 得到秒数
      const minutes = Math.floor(m)
      const seconds = Math.floor(s)
      const str1 = minutes < 10 ? ('0' + minutes) : minutes
      const str2 = seconds < 10 ? ('0' + seconds) : seconds
      this.minute = str1
      this.second = str2// 输出结果为00：30
    },
    login() {
      var data = this.getdata()
      this.tableData = data.config.tableData
      this.correctAnswer = data.config.correctAnswer
      this.raceName = data.config.titleData[0].raceName
      this.apartment = data.config.titleData[0].apartment
      this.currentDate = data.config.titleData[0].currentDate
      this.currentNumber = data.config.currentNumber
      this.question = data.config.question
      console.log(this.question.length)
      if (this.question.length < 150) {
        document.getElementById('question-sizeof').style.lineHeight = '200px'
      } else if (this.question.length >= 150 && this.question.length <= 250) {
        document.getElementById('question-sizeof').style.lineHeight = '150px'
      } else if (this.question.length > 250) {
        document.getElementById('question-sizeof').style.lineHeight = '100px'
      }
      this.showAnswer = data.config.showAnswer
      /**
       * 现在实现的效果是：
       * 当主持人没有点击显示答案时，只显示第一个抢答人的答案。
       * 当主持人点击显示答案时，显示所有人的答案以及正确答案。清除刮刮卡，则显示正确答案。
       * */
      if (this.showAnswer === false) {
        // 遍历所有队的teamToken，找到与第一个传过来的teamtoken比较。若相同则把答案放在该teamToken组中
        for (var i = 0, l = data.config.tableData.length; i < l; i++) {
          if (data.config.tableData[i]['teamToken'] === data.config.firstAnswer[0].teamToken) {
            data.config.tableData[i]['teamAnswer'] = data.config.firstAnswer[0].teamAnswer
          }
        }
      } else {
        // 将所有答案都传过来
        for (var j = 0, l1 = data.config.tableData.length; j < l1; j++) {
          for (var k = 0, l2 = data.config.allAnswer.length; k < l2; k++) {
            if (data.config.tableData[j]['teamToken'] === data.config.allAnswer[k]['teamToken']) {
              data.config.tableData[j]['teamAnswer'] = data.config.allAnswer[k].teamAnswer
            }
          }
        }
      }
    },
    getdata() {
      /**
       * 要传到后台数据:无
       */
      // 从后台得到的数据如下
      return {
        config: {
          titleData: [
            {
              raceName: '践行社会主核心价值观知识竞赛',
              apartment: '网络软件研发部部门',
              currentDate: '2019-07-12'
            }
          ],
          beginTime: 0,
          // beginTime: Date.now(), // 时间戳，后台返回的
          currentNumber: 66,
          question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
          correctAnswer: 'ABCDE',
          showAnswer: false, // 主持界面点击显示答案时传过来的值 fasle时只传第一个回答者答案，true所有人答案
          firstAnswer: [{teamToken: '6666', teamAnswer: 'ABC'}],
          allAnswer: [
            // {teamToken: '', teamAnswer: ''}
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
      }
    }
  },
  mounted() {
    this.login()
    this.computeTime() // 这有个问题就是数据不能实时显示。
  },
  watch: {
    // 作用：监听用时变化
    'time': function(newVal) {
      this.time = newVal
    },
    'currentNumber': function(newVal) {
      // 监测到题号发生变化时，正确答案不显示，各组的答案也不显示
      this.currentNumber = newVal
      // this.showAnswer = false
      // for (var i = 0, l = this.tableData.length; i < l; i++) {
      //   this.tableData[i]['teamAnswer'] = ''
      // }
    }
  }
}
</script>

<style>
.main-zhuchi{
  width: 1280;
  height: 720;
  background: url('./images/back.png');
  background-size: 100% 100%;
  min-width:800px;
  color: #fff;
}
.header{
  margin: 0px;
  background:rgba(255,255,255,0.1);
}
.header-main{
  height: 15vh;
  margin: 50px 50px 50px 50px;
}
.header-left{
  font-size: 100px;
  padding: 0px;
}
.header-right{
  font-size: 50px;
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
.race-time{
  margin-top: 2vh;
}
.showtime{
  font-size: 100px;
}
.ues-time{
  color: #ff0000;
  background:#fff;
  font-size: 70px;
}
.grid-content{
  margin: 60px 40px auto 40px;
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
  height: 50vh;
  font-size: 50px;
  padding: 80px 100px;
  margin-bottom: 3vh;
}
.svg-icon{
  margin-right: 20px;
  margin-left:40px;
  font-size: 80px;
}
.correct-answer{
  padding: 0px;
  border-radius: 25px;
  height: 10vh;
  font-size: 50px;
}
.right-bottom{
  /* font-family:sans-serif; */
  padding: 50px 80px;
  border-bottom-right-radius:25px;
  border-bottom-left-radius:25px;
  height: 63vh;
  background:rgba(255,255,255,0.1);
}
.el-table .warning-row {
  background: #F9AB00;
}
.el-table .success-row {
  background: #ffffff;
}
.table{
  border-radius: 0px;
  padding: 0;
}
.el-table .cell{
  line-height: 100px!important;
}
.bg-green{
  color: green
}
.el-table__row{
  height: 8vh;
}
th{
  height: 150px;
}
.answer-icon{
  line-height: 4;
}
.scratch-card{
  width: 500px!important;
  height: 10vh!important;
}
.all-answer{
  text-align: center;
}
.scratch-card-result{
  text-align: center;
  line-height: 2;
  font-size: 100px;
}
</style>
