
<script>
import { Radar } from 'vue-chartjs'

export default {
  props: ['data'],
  components: {
    Radar
  },
  extends: Radar,
  mounted() {
    this.$parent.$on('stats_loaded', this.render)
  },
  methods: {
    render() {
      this.renderChart(
        {
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
        {
          responsive: true,
          maintainAspectRatio: false,
          scale: {
            angleLines: { color: 'white' },
            gridLines: { color: 'white' },
            pointLabels: { fontColor: 'white' },
            ticks: { maxTicksLimit: 3, display: false }
          },
          legend: false
        }
      )
    }
  }
}
</script>
