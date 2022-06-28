<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    :before-close="cancel"
    :close-on-click-modal="false"
    @close="close"
  >
    <!-- 表单 -->
    <el-form
      ref="ruleForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option label="正式" value="1" />
          <el-option label="非正式" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item class="department" label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          readonly
          style="width: 50%"
          placeholder="请选择部门"
          @focus="focus"
          @blur="blur"
        />
        <el-tree
          :class="{ showTree: !showTree }"
          class="tree"
          :data="departs"
          default-expand-all
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirm"
          >确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { departmentAll } from '@/api/departments'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTree: false,
      departs: [],
      departmentName: '',
      isBlur: false,
      defaultProps: {
        label: 'name'
      },
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用形式', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入数字类型工号', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取所有部门
    async getDepartmentAll() {
      try {
        const { data } = await departmentAll()
        this.departs = this.findChild(data.depts)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 扁平化数据
    findChild(data, id = '') {
      return data
        .filter((item) => item.pid === id)
        .map((item) => ({ ...item, children: this.findChild(data, item.id) }))
    },
    // 弹出框关闭时触发逻辑
    close() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.departs = []
      this.$refs.ruleForm.resetFields()
    },
    // 取消
    cancel() {
      this.$emit('cancel')
    },
    // 确认
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.formData)
        } else {
          return false
        }
      })
    },
    // 选择部门input框获取焦点时
    focus() {
      this.showTree = true
      this.getDepartmentAll()
    },
    // 选择部门
    handleNodeClick(data) {
      this.formData.departmentName = data.name
      this.showTree = false
    },
    // 选择部门input框死去焦点时
    blur() {
      setTimeout(() => {
        if (this.showTree) this.showTree = false
      }, 140)
    }
  }
}
</script>

<style lang="scss" scoped>
.department {
  position: relative;
  .tree {
    position: absolute;
    width: 50%;
    top: 40px;
    background-color: rgb(255, 255, 255);
    z-index: 999;
    overflow: auto;
    transition: all 0.2s;
    max-height: 300px;
  }
  .showTree {
    height: 0;
  }
}
</style>
