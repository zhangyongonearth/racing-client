<template>
<div class="main-zhuchi" :style="backImage">
  <!-- 还有4个小时。标题栏 -->
  <el-row :span="6" class="header">
    <div class="header-main">
      <el-col :span="1" >
        <img class="header-img" src="./images/logo.png">
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
          width="250px"
          align="center">
        </el-table-column>
        <el-table-column
          width="120px">
          <template>
            <svg-icon icon-class="img"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="组名"
          align="center">
        </el-table-column>
        <el-table-column
          class="bg-green"
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
      apartment: '',
      useTime: '比赛用时',
      minute: '',
      second: '',
      activedTeamToken: '8719', // 哪个组号抢到了答题权
      raceName: '',
      correctAnswer: '',
      answer: '',
      currentNum: null,
      showAnswer: true,
      question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
      tableData: [{}],
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
      // let days = parseInt(mss / (1000 * 60 * 60 * 24)) // 得到天数
      // let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) // 得到小时
      const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
      const s = (mss % (1000 * 60)) / 1000 // 得到秒数
      // return days + '天' + hours + ':' + minutes + ':' + seconds // 返回值
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
      this.raceName = data.config.info[0].raceName
      this.apartment = data.config.info[0].apartment
      this.currentNum = data.config.currentNum
      this.question = data.config.question
      this.showAnswer = data.config.showAnswer
      if (this.showAnswer === false) {
        // 遍历所有队的teamToken，找到与第一个传过来的teamtoken比较。若相同则把答案放在该teamToken组中
        for (var i = 0, l = data.config.tableData.length; i < l; i++) {
          if (data.config.tableData[i]['teamToken'] === data.config.firstAnswer[0].teamToken) {
            data.config.tableData[i]['answer'] = data.config.firstAnswer[0].answer
          }
        }
      } else {
        // 将所有答案都传过来
        for (var j = 0, l1 = data.config.tableData.length; j < l1; j++) {
          for (var k = 0, l2 = data.config.allAnswer.length; k < l2; k++) {
            if (data.config.tableData[j]['teamToken'] === data.config.allAnswer[k]['teamToken']) {
              data.config.tableData[j]['answer'] = data.config.allAnswer[k].answer
            }
          }
        }
      }
    },
    getdata() {
      // 需要从后台获取的数据
      return {
        config: {
          info: [
            {
              raceName: '践行社会主核心价值观你追我赶之知识竞赛',
              apartment: '网络软件研发部'
            }
          ],
          beginTime: 0,
          // beginTime: Date.now(), // 时间戳，后台返回的
          currentNum: 66,
          question: '中国共产党性质是什么？<br /> A、中国共产党是中国工人阶级的先锋队<br /> B 中国人民和中华民族的先锋队<br /> C 中国特色社会主义事业的领导核心<br /> D 代表中国先进生产力的发展要求，代表中国先进文化的前进方向，代表中国最广大人民的根本利益',
          correctAnswer: 'ABCE',
          showAnswer: true, // 主持界面点击显示答案时传过来的值
          firstAnswer: [{teamToken: '6666', answer: 'ABC'}],
          allAnswer: [{teamToken: '', answer: ''}],
          tableData: [
            // {teamToken: '', name: '', score: 0, answer: ''}
            {
              teamToken: '0921',
              name: '小分队',
              score: '53',
              answer: 'A'
            },
            {
              teamToken: '1108',
              name: '加油队123',
              score: '45',
              answer: 'AB'
            },
            {
              teamToken: '1128',
              name: '强强联盟',
              score: '20',
              answer: 'ABC'
            },
            {
              teamToken: '6666',
              name: '薛定谔的猫',
              score: '45',
              answer: 'ABCD'
            },
            {
              teamToken: '0715',
              name: '@未来可期 事无蹉跎',
              score: '20',
              answer: 'ABCDE'
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
    'currentNum': function(newVal) {
      // 监测到题号发生变化时，正确答案不显示，各组的答案也不显示
      this.currentNum = newVal
      // this.showAnswer = false
      // for (var i = 0, l = this.tableData.length; i < l; i++) {
      //   this.tableData[i]['answer'] = ''
      // }
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
.el-input__inner{
  width: 260px!important;
  height: 80px!important;
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
</style>
