<template>
  <el-container>
    <el-header>单词管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-button @click="fetchWords" type="primary">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="words">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="mean" label="释义"></el-table-column>
        <el-table-column prop="type" label="分类"></el-table-column>
        <el-table-column prop="group" label="编组"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="editWord(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleteWord(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="showAddDialog" type="primary">添加单词</el-button>

      <el-dialog v-model="dialogVisible" title="添加单词">
        <el-form :model="currentWord">
          <el-form-item label="名称">
            <el-input v-model="currentWord.name"></el-input>
          </el-form-item>
          <el-form-item label="释义">
            <el-input v-model="currentWord.mean"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="currentWord.type" placeholder="选择分类">
              <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编组">
            <el-select v-model="currentWord.group" placeholder="选择编组">
              <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="saveWord" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      words: [],
      types: [],
      groups: [],
      dialogVisible: false,
      currentWord: {
        id: '',
        name: '',
        mean: '',
        type: '',
        group: '',
      },
    }
  },
  methods: {
    fetchWords() {
      api.getWords().then(response => {
        console.log("response");
        console.log(response);
        this.words = response.data.data
      })
    },
    fetchCategories() {
      api.getCategories().then(response => {
        this.types = response.data.data
      })
    },
    fetchGroups() {
      api.getGroups().then(response => {
        this.groups = response.data.data
      })
    },
    showAddDialog() {
      console.log(this.dialogVisible)
      this.dialogVisible = true
      console.log(this.dialogVisible)

      this.currentWord = {id: '', name: '', mean: '', type: '', group: ''}
    },
    saveWord() {
      if (this.currentWord.id !== '') {
        api.updateWord(this.currentWord.id, this.currentWord).then(() => {
          this.fetchWords()
          this.dialogVisible = false
        })
      } else {
        api.createWord(this.currentWord).then(() => {
          this.fetchWords()
          this.dialogVisible = false
        })
      }
    },
    editWord(word) {
      this.currentWord = {...word}
      this.dialogVisible = true
    },
    deleteWord(id) {
      api.deleteWord(id).then(() => {
        this.fetchWords()
      })
    },
  },
  created() {
    this.fetchWords()
    this.fetchCategories()
    this.fetchGroups()
  },
}
</script>
