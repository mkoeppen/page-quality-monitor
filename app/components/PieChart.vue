<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, {
      cutoutPercentage: 97,
      legend: {
        display: false
      }
    })
  }
}
</script>