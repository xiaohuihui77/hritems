<template>
  <div class="departments">
    <template>
      <div class="dashboard-container">
        <div class="app-container">
          <!-- 实现页面的基本布局 -->
          <el-card class="tree-card">
            <!-- 用了一个行列布局 -->
            <!-- 缺少treeNode -->
            <tree-tools :tree-node="company" @addDeparts="addDepts" />
            <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
            <el-tree :data="departs" :props="defaultProps" default-expand-all>
              <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
              <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
              <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
              <tree-tools
                slot-scope="{ data }"
                :tree-node="data"
                is-root
                @delOut="resetData"
                @addDeparts="addDepts"
                @editDeparts="editDepts"
              />
            </el-tree>
          </el-card>
        </div>
      </div>
    </template>
    <add-dept
      ref="addDept"
      :tree-node="node"
      :simple-user="simpleUser"
      :show-dialog="showDialog"
      @cancel="cancel"
      @add="addDepart"
      @edit="editDepart"
    />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { departmentAll, addDepartment, editDepartment } from '@/api/departments'
import { getSimple } from '@/api//user'
export default {
  components: {
    treeTools,
    addDept
  },
  data() {
    return {
      showDialog: false,
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      departs: [
        // {
        //   name: '总裁办',
        //   manager: '曹操',
        //   children: [{ name: '董事会', manager: '曹丕' }]
        // },
        // { name: '行政部', manager: '刘备' },
        // { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      departmentAll: {},
      node: {},
      simpleUser: []
    }
  },
  created() {
    this.getDepartmentAll()
  },
  methods: {
    // 扁平化数据
    findChild(data, id = '') {
      return data
        .filter((item) => item.pid === id)
        .map((item) => ({ ...item, children: this.findChild(data, item.id) }))
    },
    async getDepartmentAll() {
      try {
        const { data } = await departmentAll()
        this.departmentAll = data
        this.company.name = data.companyName
        this.departs = this.findChild(data.depts)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    resetData() {
      this.getDepartmentAll()
    },
    addDepts(node) {
      this.node = node
      getSimple().then((res) => {
        this.simpleUser = res.data
        // this.$refs.addDept.empty()
        this.showDialog = true
      })
    },
    editDepts(node) {
      this.node = node
      getSimple().then((res) => {
        this.simpleUser = res.data
        this.$refs.addDept.empty(node)
        this.showDialog = true
      })
      this.showDialog = true
    },
    cancel() {
      this.showDialog = false
    },
    addDepart(data) {
      addDepartment({ ...data, 'pid': this.node.id || '' })
        .then((res) => {
          this.$message.success('添加成功')
          this.showDialog = false
          this.resetData()
        })
        .catch((err) => {
          return err
        })
    },
    editDepart(data) {
      editDepartment(data.id, data)
        .then((res) => {
          this.$message.success('修改成功')
          this.showDialog = false
          this.resetData()
        })
        .catch((err) => {
          return err
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
