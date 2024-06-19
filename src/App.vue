<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="/" @click="goTo('/')">单词查询</el-menu-item>
<!--        <el-menu-item index="/words" @click="goTo('/words')">单词管理</el-menu-item>-->
        <el-menu-item index="/categories" @click="goTo('/categories')">分类管理</el-menu-item>
        <el-menu-item index="/groups" @click="goTo('/groups')">编组管理</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: '/'
    }
  },
  watch: {
    '$route.path'(newPath) {
      this.activeMenu = newPath
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path)
    }
  }
}
</script>
