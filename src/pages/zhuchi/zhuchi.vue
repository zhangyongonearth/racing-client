<template>
<div class="main-screen">
  <!-- 主持人输入口令登录界面 -->
  <div v-if="isValid">
    <el-form :model="zhuchiFrom" ref="zhuchiFrom" label-width="100px" class="demo-raceFrom zhuchiLoginForm">
      <h3 class="login-title"><svg-icon class="icon-login" icon-class="welcome"></svg-icon>欢迎登录</h3>
      <el-form-item
        label="口令"
        prop="zhuchiToken"
        :rules="[
            { required: true, message: '口令不能为空'},
            { type: 'number', message: '口令必须为数字值'}
          ]">
        <el-input type="Token" placeholder="请输入口令" v-model.number="zhuchiFrom.zhuchiToken"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="zhuchiForm('zhuchiFrom')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 创建竞赛，包括竞赛名称、队伍数量、随机数 -->
  <div v-else-if="isBuild">
    <el-form :model="raceFrom" :rules="rules" ref="raceFrom" label-width="100px" class="demo-raceFrom">
       <h3 class="login-title"><svg-icon class="icon-login" icon-class="welcome"></svg-icon>随机数生成</h3>
      <el-form-item label="竞赛名称" prop="racename">
        <el-input placeholder="请输入竞赛名称" v-model="raceFrom.racename"></el-input>
      </el-form-item>
      <el-form-item label="队伍数量" prop="racenumber">
        <el-input placeholder="请输入队伍数量" v-model="raceFrom.racenumber"></el-input>
      </el-form-item>
      <div class="button-create">
        <el-button type="primary" :disabled="isChuangjian" @click="submitForm('raceFrom')">创建</el-button>
      </div>
    </el-form>

    <el-row class="random-table">
      <div class="random-value" v-for="(random) in randomData" v-bind:key="random">
        <svg-icon icon-class="flag"></svg-icon><u>{{random}}</u> </div>
      <div class="button-start"><el-button v-show="startEnd" type="primary" :disabled="isAble" @click="start()">开始</el-button></div>
    </el-row>
  </div>
  <!-- 创建比赛后，比分、翻题界面 -->
  <div v-else>
    <el-row :span="10" class="compute compute-top">
      <el-row :span="8" class="title title-subject">
        <el-row>进行时长：<el-button class="button-current" type="success">{{duration}}</el-button></el-row>
        <el-row>当前题号：<el-button class="button-current" type="success">{{currentNum}}</el-button></el-row>
      </el-row>
      <el-row>
        <el-button type="primary" @click="showAnswer()">显示答案</el-button>
        <el-button type="primary" @click="nextQuestion()">下一题</el-button>
        <el-button v-show="startEnd" type="primary" @click="end()">答题结束</el-button>
      </el-row>
    </el-row>
    <el-row :span="10" class="compute compute-bottom">
      <el-row :span="4" class="title title-compute">
        <svg-icon icon-class="compute"></svg-icon>分数</el-row>
      <el-table
        stripe
        highlight-current-row
        :data="teamData">
        <el-table-column
          prop="name"
          label="组名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="add_reduce"
          label="加分/减分"
          width="150px"
          align="center">
          <template slot-scope="scope" >
            <el-input-number class="input-number" size="mini" v-model="scope.row.score" @change="handleChange()" label="分数">
          </el-input-number>
          </template>

        </el-table-column>
      </el-table>
    </el-row>
  </div>
</div>
</template>

<script>
export default {
  /**
   * 创建竞赛：输入队伍数量N、竞赛名称，输出N个随机数
   * 测试：测试各队伍连接
   * 开始：创建完竞赛之后，点击开始才显示题目，以及翻题按钮、结束按钮、
   * 翻题：
   * 结束：与开始按钮互斥显示
   * 改分：点击改分的时候，显示队伍列表和改分
   */
  name: 'zhuchi',
  data() {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        }
        callback()
      }
    }
    return {
      activedRace: '789313', // 从localstorage中获取，如果有该值，
      isValid: true,
      zhuchiToken: '234567',
      zhuchiFrom: {
        zhuchiToken: ''
      },
      raceFrom: {
        racename: '',
        racenumber: ''
      },
      rules: {
        racename: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        racenumber: [
          { required: true, message: '请输入队伍数量', trigger: 'blur'},
          { validator: checkNum, trigger: 'blur' }
        ]
      },
      currentNum: 1,
      duration: '11:23',
      isBuild: true,
      isAble: true,
      isChuangjian: false,
      startEnd: true,
      randomData: [],
      teamData: [
        {
          name: '我是战队1的队号',
          score: '53'
        },
        {
          name: '我是战队1的队号的对号队号',
          score: '53'
        },
        {
          name: '我是战队1的队号',
          score: '53'
        },
        {
          name: '我是战队1的队号的对号队号',
          score: '53'
        }]
    }
  },
  methods: {
    // 主持人输入口令登陆
    zhuchiForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('主持人口令', this.zhuchiFrom.zhuchiToken)
          this.isValid = false
          this.isBuild = true
        } else {
          return false
        }
      })
    },
    // 创建比赛 名称 队伍数量 随机数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // local保存有比赛token 比赛名称 队伍数量
          localStorage.setItem('activedRace', this.activedRace)
          const raceInfo = {
            'racename': this.raceFrom.racename,
            'racenumber': this.raceFrom.racenumber
          }
          localStorage.setItem('创建比赛', JSON.stringify(raceInfo))
          this.randomData = this.getRandom(this.raceFrom.racenumber)
          this.isAble = false
          this.isChuangjian = true
        } else {
          return false
        }
      })
    },
    login(zhuchiToken, activedRace) {
      if (localStorage.getItem('主持人口令') === zhuchiToken) {
        // 验证是否有正在进行的比赛
        if (localStorage.getItem('activedRace') === activedRace) {
          // 若有返回正在比赛的信息，显示比赛界面
          this.isValid = false
          this.isBuild = false
          this.getState()
        } else {
          // 若没有正在进行的比赛，返回到创建比赛的界面
          this.isValid = false
          this.isBuild = true
        }
      } else {
        // 否则主持人登录界面
        this.isValid = true
        this.isBuild = true
      }
    },
    getState() {
      // 获取比赛信息
      return {
        config: {
          raceName: '践行社会主核心价值观你追我赶之知识竞赛',
          teamCount: 5,
          teamTokens: ['1902', '1992', '2893', '8961'],
          beginTime: Date.now(), // 时间戳，后台返回的
          raceMode: 0 // 竞赛模式：0抢答，1
        }, teams: [
          {token: '', name: '', score: 0}
        ]
      }
    },
    // 根据比赛队员数量，生成4位随机数
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    getRandom(i) {
      while (i--) {
        this.randomData.push(this.rand(1000, 9999))
      }
      console.log('随机数' + this.randomData)
      return this.randomData
    },
    // 点击开始，比赛分数界面。点击答题结束，回到创建比赛界面
    start() {
      this.isValid = false
      this.isBuild = false
    },
    end() {
      this.isValid = false
      this.isBuild = true
      this.currentNum = 1
      localStorage.removeItem('创建比赛')
      localStorage.removeItem('activedRace')
    },
    showAnswer() {
      // 把isAnswerShow=true传到主持界面
    },
    nextQuestion() {
      // 把question传到主持界面
      this.currentNum += 1
    },
    handleChange(value) {
      return value
    },
    changeScore(teamToken, newValue) {
      // changeValue = 1 | -1
    }
  },
  mounted() {
    this.login('1234', '789313')
    /**
     * 1、去localstortage中查询是否有zhuchiToken
     * 2、如果有则自动查询该zhuchiToken是否有效（methods：login）
     * 3、如果第二步的自动登陆失败，则显示登陆组件（只需要输入zhuchiToken）
     * 4、登陆（methods：login）
     * 5、查询是否比赛信息（methods：getState）
     * 6、如果第5步中获取的信息，没有进行中的比赛，则显示创建比赛的组件
     * 7、如果有已经进行的比赛，则显示比赛界面
     */
  },
  watch: {
    // 作用：监听比赛名称和队伍数量的变化
    'raceFrom.racename': function(newVal) {
      this.raceFrom.racename = newVal
      this.isChuangjian = false
      this.randomData = []
      this.isAble = true
    },
    'raceFrom.racenumber': function(newVal) {
      this.raceFrom.racenumber = newVal
      this.isChuangjian = false
      this.randomData = []
      this.isAble = true
    }
  }
}
</script>

<style>
.main-zhuchi{
  background-color: #f5f5f5;
}
.demo-raceFrom{
  border: 1px solid #DCDFE6;
  margin: 80px auto 10px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  /* box-shadow: 0 0 5px #909399; */
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #000;
}
.random-table{
  border: 1px solid #DCDFE6;
  margin: auto;
  padding: 30px 50px 30px 50px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  text-align: center;
}
.random-value{
  display: inline;
  padding-top:20px;
}
.button-create{
  text-align: center;
}
.button-start{
  margin-top:20px;
}
.compute{
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}
.compute-top{
  padding: 10px;
  font-size: 15px;
  text-align: center;
}
.compute-bottom{
  padding: 10px 0px;
}
.title{
  font-size: 20px;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.icon-login{
  font-size: 40px;
}
.svg-icon{
  margin-right: 5px;
  font-size: 25px;
  fill:#000;
}
</style>
