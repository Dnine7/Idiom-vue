<template>
  <el-container>
    <el-header>单词查询</el-header>
    <el-main>
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="词义">
          <el-input v-model="searchCriteria.definition"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchCriteria.category" placeholder="选择分类">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编组">
          <el-select v-model="searchCriteria.group" placeholder="选择编组">
            <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchWords" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="words">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="definition" label="释义"></el-table-column>
        <el-table-column prop="category" label="分类"></el-table-column>
        <el-table-column prop="group" label="编组"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      words: [],
      categories: [],
      groups: [],
      searchCriteria: {
        definition: '',
        category: '',
        group: '',
      },
    }
  },
  methods: {
    fetchCategories() {
      api.getCategories().then(response => {
        this.categories = response.data
      })
    },
    fetchGroups() {
      api.getGroups().then(response => {
        this.groups = response.data
      })
    },
    searchWords() {
      api.searchWords(this.searchCriteria).then(response => {
        this.words = response.data
      })
    },
  },
  created() {
    this.fetchCategories()
    this.fetchGroups()
  },
}
</script>
