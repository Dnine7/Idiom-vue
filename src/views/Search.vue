<template>
  <el-container>
    <el-header>单词查询</el-header>
    <el-main>
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="名称">
          <el-input v-model="searchCriteria.name"></el-input>
        </el-form-item>
        <el-form-item label="词义">
          <el-input v-model="searchCriteria.mean"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchCriteria.type" placeholder="选择分类">
            <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
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
        <el-table-column prop="mean" label="释义"></el-table-column>
        <el-table-column prop="type" label="分类"></el-table-column>
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
      types: [],
      groups: [],
      searchCriteria: {
        name: '',
        mean: '',
        type: '',
        group: '',
      },
    }
  },
  methods: {
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
      api.searchWords(this.searchCriteria).then(response => {
        this.words = response.data.data
      })
    },
  },
  created() {
    this.fetchCategories()
    this.fetchGroups()
  },
}
</script>
