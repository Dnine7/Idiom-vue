<template>
  <el-container>
    <el-header>单词查询</el-header>
    <el-main>
      <el-form-item label="颜色选择">
        <el-select
            v-model="colorBy"
            placeholder="Select"
            size="default"
            style="width: 192px"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="名称">
          <el-input v-model="searchCriteria.name"></el-input>
        </el-form-item>
        <el-form-item label="词义">
          <el-input v-model="searchCriteria.mean"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchCriteria.typeId" placeholder="选择分类" style="width: 192px" clearable filterable>
            <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编组">
          <el-select v-model="searchCriteria.groupId" placeholder="选择编组" style="width: 192px" clearable filterable>
            <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchWords" type="primary">搜索</el-button>
          <el-button @click="showAddDialog" type="primary">添加单词</el-button>
        </el-form-item>
      </el-form>
      <el-table
          :data="words"
          :row-style="rowStyle"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          border
      >
        <el-table-column width="100" prop="type" label="分类"></el-table-column>
        <el-table-column width="100" prop="group" label="编组"></el-table-column>
        <el-table-column width="150" class-name="bold-cell" prop="name" label="名称"></el-table-column>
        <el-table-column width="100" prop="sentimentType" label="情感类型" :formatter="sentimentTypeFormat"></el-table-column>
        <el-table-column width="100" prop="collocation" label="常见搭配"></el-table-column>
        <el-table-column prop="mean" label="释义"></el-table-column>
        <el-table-column prop="sentence" label="例句"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column width="180" label="操作">
          <template v-slot="scope">
            <el-button @click="editWord(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleteWord(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :page-size="currentPageSize"
          :current-page="currentPage"
          :page-sizes="pageSize"
          layout="sizes, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
          @update:page-size="handleCurrentPageChange"
      >
      </el-pagination>

      <el-dialog v-model="dialogVisible" title="单词">
        <el-form :model="currentWord">
          <el-form-item label="名称">
            <el-input v-model="currentWord.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="释义">
            <el-input type="textarea" v-model="currentWord.mean" placeholder="请输入释义"></el-input>
          </el-form-item>
          <el-form-item label="例句">
            <el-input type="textarea" v-model="currentWord.sentence" placeholder="请输入例句"></el-input>
          </el-form-item>

          <el-form-item label="分类">
            <el-select v-model="currentWord.type" placeholder="选择分类" @change="typeChange" clearable filterable>
              <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编组">
            <el-select v-model="currentWord.group" placeholder="选择编组" @change="groupChange" clearable filterable>
              <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="currentWord.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="常见搭配">
            <el-input type="textarea" v-model="currentWord.collocation" placeholder="请输入常见搭配"></el-input>
          </el-form-item>
          <el-form-item label="情感类型">
            <el-radio-group v-model="currentWord.sentimentType">
              <el-radio value="good">褒义</el-radio>
              <el-radio value="bad">贬义</el-radio>
              <el-radio value="middle">中性词</el-radio>
            </el-radio-group>
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
      currentPage: 1,
      pageSize: [100, 200, 500, 1000],
      currentPageSize: 100,
      total: 0,
      words: [],
      types: [],
      groups: [],
      dialogVisible: false,
      colorBy: 1,
      sentimentTypes: [
        {
          value: 'good',
          label: '褒义',
        },
        {
          value: 'bad',
          label: '贬义',
        },
        {
          value: 'middle',
          label: '中性',
        },
      ],
      options: [
        {
          value: 0,
          label: '分类',
        },
        {
          value: 1,
          label: '分组',
        },
      ],
      searchCriteria: {
        name: '',
        mean: '',
        type: '',
        typeId: '',
        group: '',
        groupId: '',
        page: 1,
        pageSize: 10
      },
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
        remark: '',
        sentence: '',
        sentimentType: '',
        collocation: ''
      },
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchCriteria.page = this.currentPage
      this.searchCriteria.pageSize = this.currentPageSize
      this.searchWords();
    },
    handleCurrentPageChange(val){
      this.currentPageSize = val;
      this.searchCriteria.page = this.currentPage
      this.searchCriteria.pageSize = this.currentPageSize
      this.searchWords();
    },
    sentimentTypeFormat(row, column, cellValue, index) {
      switch (cellValue) {
        case "good":
          return "褒义";
        case "bad":
          return "贬义";
        case "middle":
          return "中性词";
      }
    },
    typeChange(value) {
      this.currentWord.typeId = value;
    },
    groupChange(value) {
      this.currentWord.groupId = value;
    },
    sentimentTypeChange(value) {
      this.currentWord.sentimentType = value;
    },
    rowStyle({row, rowIndex}) {
      if (this.colorBy === 0) {
        return {
          backgroundColor: row["typeColor"] || '',
        };
      } else if (this.colorBy === 1) {
        return {
          backgroundColor: row["groupColor"] || '',
        };
      }
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
    searchWords() {
      console.log(this.searchCriteria);
      api.searchWords(this.searchCriteria).then(response => {
        console.log(response.data);
        this.words = response.data.data.list
        this.total = response.data.data.total
      })
    },
    showAddDialog() {
      this.fetchCategories()
      this.fetchGroups()
      this.dialogVisible = true
      this.currentWord = {id: '', name: '', mean: '', type: '', group: '',collocation: ''}
    },
    saveWord() {
      if (this.currentWord.id !== '') {
        api.updateWord(this.currentWord.id, this.currentWord).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.searchWords();
            this.dialogVisible = false
          } else {
            ElMessage.error(response.data.message)
          }
        })
      } else {
        api.createWord(this.currentWord).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.searchWords();
            this.dialogVisible = false
          } else {
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
      api.deleteWord(id).then(response => {
        const code = response.data.code
        if (code === 200) {
          this.searchWords();
          this.dialogVisible = false
        } else {
          ElMessage.error(response.data.message)
        }
      })
    },
  },
  created() {
    this.searchWords()
    this.fetchCategories()
    this.fetchGroups()
  },
}
</script>

<style>
.bold-cell {
  font-weight: 1000;
}
</style>
