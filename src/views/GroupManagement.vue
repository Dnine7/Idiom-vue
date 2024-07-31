<template>
  <el-container>
    <el-header>编组管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-button @click="fetchGroups" type="primary">搜索</el-button>
          <el-button @click="showAddDialog" type="primary">添加编组</el-button>
        </el-col>
      </el-row>
      <el-table :data="groups">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="editGroup(scope.row)" type="primary">编辑</el-button>
            <el-button @click="deleteGroup(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" title="添加编组">
        <el-form :model="currentGroup">
          <el-form-item label="名称">
            <el-input v-model="currentGroup.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="currentGroup.color" color-format="rgb" @change="colorChange"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="saveGroup" type="primary">保存</el-button>
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
      groups: [],
      dialogVisible: false,
      currentGroup: {
        id: '',
        name: '',
        color:'',
      },
    }
  },
  methods: {
    colorChange(value){
      this.currentGroup.color = this.rgbaToHex(value)
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
    fetchGroups() {
      api.getGroups().then(response => {
        this.groups = response.data.data
      })
    },
    showAddDialog() {
      console.log(this.dialogVisible)
      this.dialogVisible = true
      console.log(this.dialogVisible)
      this.currentGroup = {id: '', name: ''}
    },
    saveGroup() {
      if (this.currentGroup.id !== '') {
        api.updateGroup(this.currentGroup.id, this.currentGroup).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchGroups();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
        })
      } else {
        api.createGroup(this.currentGroup).then(response => {
          const code = response.data.code
          if (code === 200) {
            this.fetchGroups();
            this.dialogVisible = false
          }else {
            ElMessage.error(response.data.message)
          }
        })
      }
    },
    editGroup(group) {
      this.currentGroup = {...group}
      this.dialogVisible = true
    },
    deleteGroup(id) {
      api.deleteGroup(id).then(() => {
        this.fetchGroups()
      })
    },
  },
  created() {
    this.fetchGroups()
  },
}
</script>
