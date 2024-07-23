<template>
  <div class="container">
    <el-card class="box-card">
      <div class="problem" id="problem">{{ problem }}</div>
      <el-input v-model="answer" class="input" placeholder="请输入答案"></el-input>
      <el-button type="primary" @click="checkAnswer">检查答案</el-button>
      <div class="result" id="result">{{ result }}</div>
      <el-button @click="generateProblem">下一个</el-button>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SpeedMath',
  setup() {
    const problem = ref('');
    const answer = ref('');
    const result = ref('');

    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateProblem = () => {
      const num1 = getRandomInt(10, 99);
      const num2 = getRandomInt(1, 9);
      problem.value = `${num1} x ${num2}`;
      answer.value = '';
      result.value = '';
    };

    const checkAnswer = () => {
      const [num1, num2] = problem.value.split(' x ').map(Number);
      const correctAnswer = num1 * num2;
      if (parseInt(answer.value, 10) === correctAnswer) {
        result.value = '正确!';
      } else {
        result.value = `错误，正确答案是 ${correctAnswer}`;
      }
    };

    // 生成第一个问题
    generateProblem();

    return {
      problem,
      answer,
      result,
      generateProblem,
      checkAnswer,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.problem {
  font-size: 2em;
  margin-bottom: 20px;
}
.input {
  margin-bottom: 20px;
}
.result {
  font-size: 1.5em;
  margin-top: 20px;
}
</style>
