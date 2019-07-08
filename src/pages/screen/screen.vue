<template>
<div class="main-zhuchi">
  <el-row :span="4" class="race-name" >
    <div class="header">
      <img clss="header-img" src="./logo1.png">
      <span class="header-text">{{raceName}}</span></div>
  </el-row>
  <el-row :span="20">
    <!-- 题目问题 答案 -->
    <el-col :span="12"><div class="grid-content">
      <el-row :span="4" class="title title-question">
        <svg-icon icon-class="problem"></svg-icon>题目</el-row>
      <el-row :span="18" class="question" ><div v-html="question"></div></el-row>
      <el-row :span="2" class="correct-answer" v-show="isAnswerShow">
        <svg-icon icon-class="answer"></svg-icon>正确答案：<span></span></el-row>
    </div>
    </el-col>
    <!-- 各组亮灯 组名 答案 时间 超时 分数情况 -->
    <el-col :span="11" :offset="1"><div class="grid-content">
      <el-row :span="4" class="title title-group">
        <svg-icon icon-class="flag"></svg-icon>各组战况</el-row>
      <el-table
        class="table"
        :data="tableData"
        stripe
        highlight-current-row
        :default-sort = "{prop: 'score', order: 'descending'}">
        
        <el-table-column
          type="index"
          label="排名"
          width="80px"
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
    </div></el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'screen',
  data(){
    return {
      raceToken:'',
      activedTeamToken:'8719',//哪个组号抢到了答题权
      raceName:'竞赛的名称',
      isAnswerShow: true,
      isLight:true,
      answer:'A',
      question: '<h1>今天是几号？</h1><br /> <h2>A 1</h2><br /> <h2>B 2</h2><br /> <h2>C 3</h2><br /> <h2>D 4</h2>',   
      tableData: [
      {
        teamToken:'8917',
        name: 'karroy1',
        score: '53',
        answer: 'ABCDE'
      },
      {
        teamToken:'6634',
        name: 'karroy2',
        score: '45',
        answer: 'ABCD'
      },
      {
        teamToken:'6634',
        name: 'karroy3',
        score: '20',
        answer: 'ABC'
      }]
    }
  },
  computed:{
    
  }
}
</script>

<style>
.main-zhuchi{
  background-color: #f5f5f5;
  height: 100vh;
}
.race-name{
  background-color: #bf4340;
  color: #fff;
  margin: 0px;
}
.header{
  margin:10px 40px;
} 
.header-text{
  text-align: center;
  font-size: 30px;
  line-height: 20px;
}

.grid-content{
  border: 1px solid #DCDFE6;
  margin: auto;
  padding: 20px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}
.title{
  color: #be1915;
  font-size: 30px;
}
.question{
  background-color: #fff;
  padding: 0px 20px;
}
.correct-answer{
  font-size: 40px;
  color: #be1915;
}
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-row:first-child {
  margin-bottom: 10px;
}
.el-table__header-wrapper,.el-table__body-wrapper{
  font-size: 20px;
}
.svg-icon{
  margin-right: 5px;
}
</style>
