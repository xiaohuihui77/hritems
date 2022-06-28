<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="roleList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" min-width="240">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :current-page="page"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="CompanyInfo.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="CompanyInfo.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="CompanyInfo.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="CompanyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑弹层" :visible="showDialog" :before-close="cancel" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配角色权限 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleAll, deleteRoleById, getRoleDetail, editRoleId, addRole } from '@/api/role'
import { getCompanyInfo } from '@/api/company'
import { getPermissionList } from '@/api/permission'
import { assignPerm } from '@/api/setting'
export default {
  data() {
    return {
      roleList: [],
      total: 0,
      page: 1,
      pageSize: 10,
      CompanyInfo: {},
      showDialog: false,
      roleForm: {},
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 扁平化数据
    findChild(data, id = '0') {
      return data
        .filter((item) => item.pid === id)
        .map((item) => ({ ...item, children: this.findChild(data, item.id) }))
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleAll({
        page: this.page,
        pageSize: this.pageSize
      })
      this.roleList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司信息
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.state.user.userInfo.companyId)
      this.CompanyInfo = res.data
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    // 删除角色
    delRole(id) {
      this.$confirm('确认删除？').then(async() => {
        const res = await deleteRoleById(id)
        if (res.code === 10000) {
          this.$message.success('删除成功')
          this.getRoleList()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message('取消删除')
      })
    },
    // 编辑角色
    editRole(item) {
      this.showDialog = true
      getRoleDetail(item.id).then(res => {
        this.roleForm = res.data
      })
    },
    // 添加角色
    addRole(item) {
      this.showDialog = true
    },
    // 取消按钮
    cancel() {
      this.showDialog = false
    },
    // 弹出框关闭时，清空表单数据
    btnCancel() {
      this.roleForm = {}
    },
    // 确认按钮
    btnOK() {
      // 如果有id就是编辑角色
      if (this.roleForm.id) {
        editRoleId(this.roleForm).then(res => {
          if (res.code === 10000) {
            this.$message.success('修改成功')
            this.showDialog = false
            this.getRoleList()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        // 没有就是添加角色
        addRole(this.roleForm).then(res => {
          if (res.code === 10000) {
            this.$message.success('添加成功')
            this.showDialog = false
            this.getRoleList()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    async assignPerm(id) {
      const res = await getPermissionList(id)
      console.log(res.data)
      console.log(this.findChild(res.data))
      this.permData = this.findChild(res.data)
      this.roleId = id
      const res1 = await getRoleDetail(id)
      this.selectCheck = res1.data.permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('操作成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.showPermDialog = false
      this.selectCheck = []
      this.permData = []
    }
  }
}
</script>

<style>

</style>
