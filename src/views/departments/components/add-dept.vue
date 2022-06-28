<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="addDeparts.id?'编辑部门': '添加部门'" :visible="showDialog" :show-close="true" :before-close="cancel" @close="empty">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="ruleForm" label-width="120px" :model="addDeparts" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addDeparts.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addDeparts.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="addDeparts.manager" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in simpleUser"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="addDeparts.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { departmentAll } from '@/api/departments'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    simpleUser: {
      type: Array,
      default: () => []
    },
    treeNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const { data } = await departmentAll()
      let isName = false
      if (this.addDeparts.id) {
        // 编辑状态
        isName = data.depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value.trim())
      } else {
        isName = data.depts.filter(item => item.pid === (this.treeNode.id || '')).some(item => item.name === value.trim())
      }
      if (isName) {
        callback(new Error('部门名称已存在'))
      } else {
        callback()
      }
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { data } = await departmentAll()
      let isCode = false
      if (this.addDeparts.id) {
        // 编辑状态
        isCode = data.depts.some(item => item.code === value.trim() && item.id !== this.treeNode.id)
      } else {
        isCode = data.depts.some(item => item.code === value.trim())
      }
      if (isCode) {
        callback(new Error('编号已存在'))
      } else {
        callback()
      }
    }
    return {
      addDeparts: {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        dialogTitle: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名字', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.addDeparts.id) {
            this.$emit('add', this.addDeparts)
          } else {
            this.$emit('edit', this.addDeparts)
          }
        } else {
          return false
        }
      })
    },
    empty(manager = null) {
      if (manager) {
        this.addDeparts = manager
      } else {
        this.addDeparts = {
          name: '',
          code: '',
          manager: '',
          introduce: ''
        }
      }
      this.$refs.ruleForm.resetFields()
    },
    setAddDeparts(data) {
      this.addDeparts = data
    }
  }
}
</script>

<style>

</style>
