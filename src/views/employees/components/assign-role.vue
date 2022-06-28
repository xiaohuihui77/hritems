<!--
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-24 17:12:14
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-24 18:55:57
-->
<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" :before-close="cancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById, assignRoles } from '@/api/user'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { data } = await getRoleList()
      this.list = data.rows
    },
    async getUserDetailById(id) {
      const { data } = await getUserDetailById(id)
      this.roleIds = data.roleIds // 赋值本用户的角色
    },
    async confirm() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    cancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

