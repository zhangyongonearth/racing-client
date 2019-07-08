<template>
<div class="main-screen">
  <!-- 创建竞赛，包括竞赛名称、队伍数量、随机数 -->
  <div v-if="isBuild">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
       <h3 class="login-title"><svg-icon class="icon-login" icon-class="welcome"></svg-icon>随机数生成</h3>
      <el-form-item label="竞赛名称" prop="racename">
        <el-input placeholder="请输入竞赛名称" v-model="ruleForm.racename"></el-input>
      </el-form-item>
      <el-form-item label="队伍数量" prop="number">
        <el-input placeholder="请输入队伍数量" v-model="ruleForm.number"></el-input>
      </el-form-item>
      <div class="button-create">
        <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-form>

    <el-row class="random-table">
      <div class="random-value" v-for="(random) in randomData" v-bind:key="random">
        <svg-icon icon-class="flag"></svg-icon><u>{{random}}</u> </div>
      <div class="button-start"><el-button v-show="startEnd" type="primary" @click="start(isBuild)">开始</el-button></div>
    </el-row>
  </div>

  <div v-else>
    <el-row :span="10" class="compute compute-top">
      <el-row :span="4" class="title title-subject">
        <svg-icon icon-class="seq"></svg-icon>题目序号</el-row>
      <el-row>当前题号：<el-button class="button-current" type="success">{{currentNum}}</el-button></el-row>
      <el-row>
        <el-button type="primary" @click="next(question)">下一题</el-button>
        <el-button v-show="startEnd" type="primary" @click="end(isBuild)">答题结束</el-button>
      </el-row>
    </el-row>
    <el-row :span="10" class="compute compute-bottom">
      <el-row :span="4" class="title title-compute">
        <svg-icon icon-class="compute"></svg-icon>分值计算</el-row>
      <el-table
        stripe
        highlight-current-row
        :data="zhuchiData">
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
          <el-input-number class="input-number" size="mini" v-model="num" @change="handleChange(value)" :min="1" :max="10" label="加减分">
          </el-input-number>
        </el-table-column>
        <el-table-column
          prop="score"
          label="分数"
          width="50px"
          align="center">
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
    return {
      activedRace: '789313', // 从localstorage中获取，如果有该值，
      ruleForm: {
        racename: '竞赛名称',
        number: '4'
      },
      rules: {
        racename: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '队伍数量不能为空'},
          { type: 'number', message: '队伍数量必须为数字值'}
        ]
      },
      currentNum: '1',
      titleOperator: '操作界面',
      isBuild: false,
      num: 1,
      startEnd: true,
      list: 40,
      randomData: [1234, 2345, 3456, 4567, 5567],
      zhuchiData: [
        {
          name: '我是战队1的队号',
          addreduce: '',
          score: '53'
        },
        {
          name: '我是战队1的队号的对号队号',
          addreduce: '',
          score: '53'
        },
        {
          name: '我是战队1的队号',
          addreduce: '',
          score: '53'
        },
        {
          name: '我是战队1的队号的对号队号',
          addreduce: '',
          score: '53'
        }]
    }
  },
  methods: {
    handleChange(value) {
      alert(value)
    }
  }
}
</script>

<style>
.main-zhuchi{
  background-color: #f5f5f5;
}
.demo-ruleForm{
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
