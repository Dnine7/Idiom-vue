<template>
  <el-container>
    <el-header>分类管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-button @click="fetchCategories" type="primary">搜索</el-button>
          <el-button @click="showAddDialog" type="primary">添加分类</el-button>
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

      <el-dialog v-model="dialogVisible" title="添加分类">
        <el-form :model="currentType">
          <el-form-item label="名称">
            <el-input v-model="currentType.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="currentType.color" color-format="rgb" @change="colorChange"/>
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
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      types: [],
      dialogVisible: false,
      currentType: {
        id: '',
        name: '',
        color:'',
      },
    }
  },
  methods: {
    colorChange(value){
      this.currentType.color = this.rgbaToHex(value)
    },
    rgbaToHex(rgba){
      // 提取 RGBA 分量
      const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/);

      if (!match) {
        throw new Error('Invalid RGBA color');
      }

      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      let a = parseFloat(match[4] || 0.3); // 透明度默认为 0.3

      // 转换为 HEX
      const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex; // 保证两位
      };

      const hexR = toHex(r);
      const hexG = toHex(g);
      const hexB = toHex(b);

      // 转换透明度
      const hexA = toHex(Math.round(a * 255));

      // 如果透明度为 1，返回 #RRGGBB，否则返回 #RRGGBBAA
      return a === 1 ? `#${hexR}${hexG}${hexB}` : `#${hexR}${hexG}${hexB}${hexA}`;
    },
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
      this.currentType = {id: '', name: ''}
    },
    saveCategory() {
      if (this.currentType.id !== '') {
        api.updateCategory(this.currentType.id, this.currentType).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchCategories();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
        })
      } else {
        api.createCategory(this.currentType).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchCategories();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
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
