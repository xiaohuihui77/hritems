<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push({ name: 'Import' })"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >导出</el-button>
          <el-button
            v-if="checkPermission('add-user')"
            size="small"
            type="primary"
            @click="addU"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="userList">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" width="101px">
            <template slot-scope="{ row }">
              <el-image
                style="width: 80px; height: 80px;"
                :src="row.staffPhoto.trim() ? row.staffPhoto : '#'"
                fit="fill"
                @click="clickShowMa(row.staffPhoto.trim())"
              >
                <template slot="error">
                  <img
                    style="width: 80px; height: 80px;"
                    src="http://hrsaas-1312603163.cos.ap-chongqing.myqcloud.com/%E5%B0%8F%E7%81%B0%E7%81%B0.png"
                    @click="clickShowMa(row.staffPhoto.trim())"
                  >
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            :formatter="formatEmployment"
            sortable=""
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="scope">
              <span>{{ scope.row.timeOfEntry | formatDate }}</span>
            </template></el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push({ path: '/employees/detail/' + row.id })"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                v-if="checkPermission('point-user-delete')"
                type="text"
                size="small"
                @click="delUser(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :current-page="page"
              :page-size="pageSize"
              @current-change="pageChange"
            />
          </div>
        </el-row>
      </el-card>
    </div>

    <!-- 弹出框 -->
    <add-employee
      :show-dialog.sync="showDialog"
      @cancel="cancel"
      @confirm="confirm"
    />

    <!-- 二维码弹出 -->
    <el-dialog title="头像 && 二维码" :visible.sync="showMa">
      <el-row type="flex" justify="center">
        <el-col span="12" type="flex" style="text-align:center">
          <img :src="iconUrl" alt="#" style="width:170px;height:170px">
        </el-col>
        <el-col span="12" style="text-align:center">
          <canvas ref="qrcode" />
        </el-col>
      </el-row>
    </el-dialog>
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getUserList, deleteUser, addUser } from '@/api/user'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import dayjs from 'dayjs'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      userList: [],
      total: 0,
      page: 1,
      pageSize: 10,
      showDialog: false,
      showMa: false,
      iconUrl: '#',
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取员工列表
    getUserList() {
      getUserList({
        page: this.page,
        size: this.pageSize
      }).then((res) => {
        this.userList = res.data.rows
        this.total = res.data.total
      })
    },
    pageChange(page) {
      this.page = page
      this.getUserList()
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    delUser(id) {
      deleteUser(id).then((res) => {
        this.getUserList()
        this.$message.success(res.message)
      })
    },
    // 添加员工按钮
    addU() {
      this.showDialog = true
    },
    // 取消按钮
    cancel() {
      this.showDialog = false
    },
    // 确认按钮
    confirm(data) {
      addUser(data).then((res) => {
        this.showDialog = false
        this.getUserList()
        this.$message.success(res.message)
      })
    },
    // 导出excel
    exportData() {
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel')
        .then(async(excel) => {
          const res = await getUserList({
            page: 1,
            size: this.total
          })
          const data = this.formatJson(headers, res.data.rows)
          excel.export_json_to_excel({
            header: Object.keys(headers), // 表头 必填
            data, // 具体数据 必填
            filename: '员工列表', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx', // 非必填
            // 复杂表头
            multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 复杂表头的部分
            merges: ['A1:A2', 'B1:F1', 'G1:G2']
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return dayjs(item[headers[key]]).format('YYYY/MM/DD') // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            if (+item[headers[key]] === 1) {
              return '正式'
            } else if (+item[headers[key]] === 2) {
              return '非正式'
            } else {
              return '未知'
            }
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    clickShowMa(url) {
      if (url) {
        this.showMa = true
        this.iconUrl = url
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.qrcode, url)
        })
      } else {
        this.$message('该用户尚未上传头像，当前为默认头像')
      }
    },
    async  editRole(id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  }
}
</script>

<style></style>
