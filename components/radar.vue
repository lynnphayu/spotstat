
<template>
  <canvas :id="id" width="75%" height="75%" style="position: relative;"></canvas>
</template>

<script>
import chart from 'chart.js'
var RadarChart
export default {
  name: 'radar',
  props: ['data', 'id'],
  mounted() {
    this.$parent.$on('stats_loaded', this.drawchart)
    // RadarChart = new Chart(document.getElementById(this.id).getContext('2d'), {
    //   type: 'radar',
    //   data: {
    //     labels: [
    //       'acoustic',
    //       'dance',
    //       'energy',
    //       'instrumental',
    //       'liveness',
    //       'speech',
    //       'valence'
    //     ],
    //     datasets: [
    //       {
    //         data: [1,1,1,1,1,1,1],
    //         backgroundColor: 'rgba(21, 174, 43, 0.2)',
    //         borderColor: 'rgb(21, 174, 43)',
    //         pointBackgroundColor: 'rgb(21, 174, 43)'
    //       }
    //     ]
    //   },
    //   options: {
    //     scale: {
    //       angleLines: { color: 'white' },
    //       gridLines: { color: 'white' },
    //       pointLabels: { fontColor: 'white' },
    //       ticks: { maxTicksLimit: 3, display: false }
    //     },
    //     legend: false
    //   }
    // })
  },
  methods: {
    update_chart() {
      RadarChart.data.datasets[0] = {
        data: this.data.recap,
        backgroundColor: 'rgba(21, 174, 43, 0.2)',
        borderColor: 'rgb(21, 174, 43)',
        pointBackgroundColor: 'rgb(21, 174, 43)'
      }
      RadarChart.update()
    },
    drawchart() {
      RadarChart = new Chart(
        document.getElementById(this.id).getContext('2d'),
        {
          type: 'radar',
          data: {
            labels: [
              'acoustic',
              'dance',
              'energy',
              'instrumental',
              'liveness',
              'speech',
              'valence'
            ],
            datasets: [
              {
                data: this.data.recap,
                backgroundColor: 'rgba(21, 174, 43, 0.2)',
                borderColor: 'rgb(21, 174, 43)',
                pointBackgroundColor: 'rgb(21, 174, 43)'
              }
            ]
          },
          options: {
            scale: {
              angleLines: { color: 'white' },
              gridLines: { color: 'white' },
              pointLabels: { fontColor: 'white' },
              ticks: { maxTicksLimit: 3, display: false }
            },
            legend: {
              fontColor: '#ffffff'
            }
          }
        }
      )
    }
  }
}
</script>
<style>
</style>
