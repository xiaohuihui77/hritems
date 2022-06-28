<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importUser } from '@/api/user'
export default {
  methods: {
    success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const userList = results.map(item => {
        const user = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            user[userRelations[key]] = new Date(this.formatDate(item[key], '-'))
          } else {
            user[userRelations[key]] = item[key]
          }
        })
        return user
      })
      importUser(userList).then(res => {
        this.$message.success(res.message)
        this.$router.back()
      })
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
