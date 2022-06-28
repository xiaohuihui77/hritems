/*
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-21 09:15:07
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-27 13:04:56
 */
// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import TagsView from './TagsView'
import ThemePicker from './ThemePicker'
import Lang from './lang'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('TagsView', TagsView)
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('Lang', Lang)
  }
}
