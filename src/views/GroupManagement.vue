<template>
  <el-container>
    <el-header>编组管理</el-header>
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-button @click="fetchGroups" type="primary">搜索</el-button>
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
      <el-button @click="showAddDialog" type="primary">添加编组</el-button>

      <el-dialog v-model="dialogVisible" title="添加编组">
        <el-form :model="currentGroup">
          <el-form-item label="名称">
            <el-input v-model="currentGroup.name"></el-input>
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

export default {
  data() {
    return {
      groups: [],
      dialogVisible: false,
      currentGroup: {
        id: '',
        name: '',
      },
    }
  },
  methods: {
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
        api.updateGroup(this.currentGroup.id, this.currentGroup).then(() => {
          this.fetchGroups()
          this.dialogVisible = false
        })
      } else {
        api.createGroup(this.currentGroup).then(() => {
          this.fetchGroups()
          this.dialogVisible = false
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
