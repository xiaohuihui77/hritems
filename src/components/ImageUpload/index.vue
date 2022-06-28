<!--
 * @Description: 上传img组件
 * @Autor: xiaohuihui
 * @Date: 2022-06-22 19:17:29
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-24 10:36:46
-->
<template>
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="remove"
      :class="{disabled:fileComputed}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percentage" style="width: 180px" />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDud8OQDsISM1QaVBcnjPq1xe6JGxOaWCc',
  SecretKey: 'DBtLYVDrHTRAdqoWyB9rKXVDftsb4IGy'
})
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null,
      percentage: 0,
      showProgress: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    remove(file, fileList) {
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 类型不对，返回FALSE
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 大小超过5m，返回FALSE
        this.$message.error('只能上传5M以下图片')
        return false
      }
      this.currentFileUid = file.uid
      return true
    },
    upload(params) {
      this.showProgress = true
      cos.putObject({
        Bucket: 'hrsaas-1312603163', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-chongqing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 必须 */
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        Body: params.file, // 上传文件对象
        onProgress: (progressData) => {
          this.percentage = progressData.percent * 100
          if (progressData.percent === 1) {
            setTimeout(() => {
              this.percentage = 0
              this.showProgress = false
            }, 1000)
          }
        }
      }, (err, data) => {
        console.log(err || data)
        if (data.statusCode === 200) {
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currentFileUid) {
              return { url: 'http://' + data.Location, upload: true }
            }
            return item
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .disabled .el-upload--picture-card{
    display: none;
}
</style>
