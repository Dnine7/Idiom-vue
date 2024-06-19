<template>
  <el-container>
    <el-header>单词管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="2">
          <el-button @click="fetchWords" type="primary">刷新</el-button>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col :span="6">
              <el-text class="mx-1">颜色选择</el-text>
            </el-col>
            <el-col :span="12">
              <el-select
                  v-model="colorBy"
                  placeholder="Select"
                  size="default"
              >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table :data="words"
      :row-style="rowStyle"
      >
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

      <el-dialog v-model="dialogVisible" title="单词">
        <el-form :model="currentWord">
          <el-form-item label="名称">
            <el-input v-model="currentWord.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="释义">
            <el-input v-model="currentWord.mean" placeholder="请输入释义"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="currentWord.type" placeholder="选择分类" @change="typeChange">
              <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编组">
            <el-select v-model="currentWord.group" placeholder="选择编组" @change="groupChange">
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
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      words: [],
      types: [],
      groups: [],
      dialogVisible: false,
      colorBy: 0,
      options:[
        {
          value: 0,
          label: '分类',
        },
        {
          value: 1,
          label: '分组',
        },
      ],
      currentWord: {
        id: '',
        name: '',
        mean: '',
        typeId: '',
        type: '',
        typeColor: '',
        groupId: '',
        group: '',
        groupColor: '',
      },
    }
  },
  methods: {
    typeChange(value){
      this.currentWord.typeId = value;
    },
    groupChange(value){
      this.currentWord.groupId = value;
    },
    rowStyle({row, rowIndex}) {
      console.log(row)
      console.log(row["typeColor"])
      if (this.colorBy === 0) {
        return {
          backgroundColor: row["typeColor"] || '',
        };
      }else if (this.colorBy === 1) {
        return {
          backgroundColor: row["groupColor"] || '',
        };
      }
    },
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
      this.dialogVisible = true
      this.currentWord = {id: '', name: '', mean: '', type: '', group: ''}
    },
    saveWord() {
      if (this.currentWord.id !== '') {
        api.updateWord(this.currentWord.id, this.currentWord).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchWords();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
        })
      } else {
        api.createWord(this.currentWord).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchWords();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
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

