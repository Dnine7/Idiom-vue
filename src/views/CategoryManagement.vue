<template>
  <el-container>
    <el-header>分类管理</el-header>
    <el-main>
      <el-table :data="categories">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="editCategory(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleteCategory(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="showAddDialog" type="primary">添加分类</el-button>

      <el-dialog :visible.sync="dialogVisible" title="添加分类">
        <el-form :model="currentCategory">
          <el-form-item label="名称">
            <el-input v-model="currentCategory.name"></el-input>
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
      categories: [],
      dialogVisible: false,
      currentCategory: {
        name: '',
      },
    }
  },
  methods: {
    fetchCategories() {
      api.getCategories().then(response => {
        this.categories = response.data
      })
    },
    showAddDialog() {
      this.dialogVisible = true
      this.currentCategory = { name: '' }
    },
    saveCategory() {
      if (this.currentCategory.id) {
        api.updateCategory(this.currentCategory.id, this.currentCategory).then(() => {
          this.fetchCategories()
          this.dialogVisible = false
        })
      } else {
        api.createCategory(this.currentCategory).then(() => {
          this.fetchCategories()
          this.dialogVisible = false
        })
      }
    },
    editCategory(category) {
      this.currentCategory = { ...category }
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
