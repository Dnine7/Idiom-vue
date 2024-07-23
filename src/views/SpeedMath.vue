<template>
  <el-header>
    <el-radio-group v-model="flag">
      <el-radio value="*">乘法</el-radio>
      <el-radio value="2+-">两位数加减</el-radio>
      <el-radio value="3+-">三位数加减</el-radio>
      <el-radio value="/3">多位/三位(首位)</el-radio>
      <el-radio value="/2">多位/两位(首两位)</el-radio>
<!--      <el-radio value="4/">四位数除法</el-radio>-->
    </el-radio-group>

  </el-header>
  <div class="container">
    <el-form-item label="题量:">
      <el-input-number v-model="problemNum" :min="1" :max="100" :step="5" />
    </el-form-item>
    <el-card class="box-card" v-if="!started">
      <el-button type="primary" @click="startQuiz">开始</el-button>
    </el-card>
    <el-card class="box-card" v-if="!completed && started">
      <div class="problem">{{ currentProblem.A }} {{ currentProblem.operator }} {{ currentProblem.B }}</div>
      <el-input
          v-model="currentProblem.inputAnswer"
          class="input"
          placeholder="请输入答案"
          @keyup.enter="saveAnswer"
      ></el-input>
      <el-button @click="saveAnswer">下一题</el-button>
      <el-button @click="startQuiz">重新生成题目</el-button>
<!--      <div class="timer">用时: {{ timer }} 秒</div>-->
    </el-card>

    <el-card class="box-card" v-else-if="completed && started">
      <div class="result-summary">
        <h2>结果总结</h2>
        <ul>
          <li v-for="(problem, index) in problems" :key="index">
            {{ problem.A }} {{ problem.operator }} {{ problem.B }} = {{ problem.inputAnswer }}
            <span :style="{ color: problem.correct ? 'green' : 'red' }">
              {{ problem.correct ? '正确' : `错误 (正确答案: ${problem.correctAnswer})` }}
            </span>
          </li>
        </ul>
<!--        <div>总用时: {{ timer }} 秒</div>-->
        <el-button @click="startQuiz">重新生成题目</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed,onMounted, onUnmounted } from 'vue';

export default {
  name: 'SpeedMath',
  setup() {
    const problems = ref([]);
    const currentIndex = ref(0);
    const problemNum = ref(20);
    const completed = ref(false);
    const started = ref(false);
    const flag = ref("*");


    class Problem {
      constructor(A, B, operator) {
        this.A = A;
        this.B = B;
        this.operator = operator;
        this.correctAnswer = this.calculateAnswer();
        this.inputAnswer = '';
        this.correct = false;
      }

      calculateAnswer() {
        let answer = 0;
        switch (this.operator) {
          case '*':
            answer = this.A * this.B;
            break;
          case '/':
            if (this.B.toString().length === 2) {
              answer = this.A / this.B;
              answer = this.keepLeftTwoDigits(answer, 1);
            }else if (this.B.toString().length === 3) {
              answer = this.A / this.B;
              answer = this.keepLeftTwoDigits(answer, 2);
            }
            break;
          case '+':
            answer = this.A + this.B;
            break;
          case '-':
            answer = this.A - this.B;
            break;
        }
        return answer;
      }

      keepLeftTwoDigits(number,length) {
        // 将数字转换为字符串
        let numberStr = number.toString();
        // 取出左侧两位
        let leftDigits = numberStr.slice(0, length);
        // 将结果转换回数字类型并返回
        return parseInt(leftDigits, 10);
      }
    }

    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateProblems = () => {
      problems.value = [];
      for (let i = 0; i < problemNum.value; i++) {
        let A,B,operator;
        switch (flag.value) {
          case "*":
            A = getRandomInt(12, 99);
            while (A % 10 === 0) {
              A = getRandomInt(12, 99);
            }
            B = getRandomInt(3, 9);
            operator = '*';
            break;
          case "2+-":
            A = getRandomInt(12, 99);
            B = getRandomInt(12, 99);
            while (A % 10 === 0) {
              A = getRandomInt(12, 99);
            }
            while (B % 10 === 0) {
              B = getRandomInt(12, 99);
            }
            operator = Math.random() < 0.5 ? '+' : '-';
            if (operator === '-' && A < B) {
              let a = A;
              A = B;
              B = a;
            }
            break;
          case "3+-":
            A = getRandomInt(101, 999);
            B = getRandomInt(101, 999);
            while (A % 10 === 0) {
              A = getRandomInt(101, 999);
            }
            while (B % 10 === 0) {
              B = getRandomInt(101, 999);
            }
            operator = Math.random() < 0.5 ? '+' : '-';
            if (operator === '-' && A < B) {
              let a = A;
              A = B;
              B = a;
            }
            break;
          case "/2":
            A = getRandomInt(10000, 99999);
            B = getRandomInt(12, 99);
            while (A % 10 === 0) {
              A = getRandomInt(10000, 99999);
            }
            while (B % 10 === 0) {
              B = getRandomInt(12, 99);
            }
            operator = '/';
            break;
          case "/3":
            A = getRandomInt(10000, 99999);
            B = getRandomInt(101, 999);
            while (A % 10 === 0) {
              A = getRandomInt(10000, 99999);
            }
            while (B % 10 === 0) {
              B = getRandomInt(101, 999);
            }
            operator = '/';
            break;
          case "4/":

            break;
        }

        problems.value.push(new Problem(A, B, operator));
      }
      currentIndex.value = 0;
      completed.value = false;
    };

    const saveAnswer = () => {
      const currentProblem = problems.value[currentIndex.value];
      currentProblem.correct = parseInt(currentProblem.inputAnswer, 10) === currentProblem.correctAnswer;
      if (currentIndex.value < problems.value.length - 1) {
        currentIndex.value++;
      } else {
        completed.value = true;
      }
    };

    const currentProblem = computed(() => problems.value[currentIndex.value]);

    const startQuiz = () => {
      generateProblems();
      started.value = true;
    };

    return {
      problems,
      problemNum,
      currentIndex,
      currentProblem,
      flag,
      started,
      completed,
      startQuiz,
      saveAnswer,
      generateProblems,
    };
  },
};
</script>

<style scoped>
.el-header {
  text-align: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.problem {
  font-size: 2em;
  margin-bottom: 20px;
}

.input {
  margin-bottom: 20px;
}

.result-summary {
  font-size: 1.2em;
}
</style>
