<!--
 * @Description: 员工详细页
 * @Autor: xiaohuihui
 * @Date: 2022-06-22 15:43:16
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-22 18:35:27
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input v-model="userInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="userComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置岗位详情 -->
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id,
      userComponent: 'user-info',
      JobInfo: 'JobInfo',
      userInfo: {
        username: '',
        password: ''
      }
    }
  },
  created() {
    getUserDetailById(this.userId).then(res => {
      this.userInfo = res.data
    })
  },
  methods: {
    updateUser() {
      console.log(this.userInfo)
      saveUserDetailById(this.userInfo).then(res => {
        this.$message.success(res.message)
      })
    }
  }
}
</script>

<style>

</style>
