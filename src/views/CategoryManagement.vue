<template>
  <el-container>
    <el-header>分类管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-button @click="fetchCategories" type="primary">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="types">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="editCategory(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleteCategory(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="showAddDialog" type="primary">添加分类</el-button>

      <el-dialog v-model="dialogVisible" title="添加分类">
        <el-form :model="currentType">
          <el-form-item label="名称">
            <el-input v-model="currentType.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="saveCategory" type="primary">保存</el-button>
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
      types: [],
      dialogVisible: false,
      currentType: {
        id: '',
        name: '',
      },
    }
  },
  methods: {
    fetchCategories() {
      api.getCategories().then(response => {
        console.log(this.types)
        console.log(response.data.data)
        this.types = response.data.data
        console.log(this.types)
      })
    },
    showAddDialog() {
      this.dialogVisible = true
      this.currentType = {name: ''}
    },
    saveCategory() {
      if (this.currentType.id !== '') {
        api.updateCategory(this.currentType.id, this.currentType).then(() => {
          this.fetchCategories()
          this.dialogVisible = false
        })
      } else {
        api.createCategory(this.currentType).then(() => {
          this.fetchCategories()
          this.dialogVisible = false
        })
      }
    },
    editCategory(category) {
      this.currentType = {...category}
      this.dialogVisible = true
    },
    deleteCategory(id) {
      api.deleteCategory(id).then(() => {
        this.fetchCategories()
      })
    },
  },
  created() {
    this.fetchCategories()
  },
}
</script>
