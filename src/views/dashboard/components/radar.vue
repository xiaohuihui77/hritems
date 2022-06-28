<!--
 * @Description: 雷达图
 * @Autor: xiaohuihui
 * @Date: 2022-06-26 15:02:27
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-26 15:12:23
-->
<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])
export default {
  mounted() {
    var myChart = echarts.init(this.$refs.myDiv)
    var option

    option = {
      title: {
        text: '基础雷达图'
      },
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: '张三'
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: '李四'
            }
          ]
        }
      ]
    }

    option && myChart.setOption(option)
  }
}
</script>

<style lang="scss" scoped>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
