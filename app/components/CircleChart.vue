<template>
    <div class="m-circle-chart">
        <div class="m-circle-chart__inner-chart">
            <strong class="m-circle-chart__inner-value">123</strong>
            <span class="m-circle-chart__inner-label">Lorem</span>
        </div>
        <PieChart class="m-circle-chart__chart-glow" :data="this.data"></PieChart>
        <PieChart class="m-circle-chart__chart" :data="this.data"></PieChart>
    </div>
</template>

<script>

import PieChart from '~/components/PieChart.vue'

export default {

  components: {
    PieChart
  },
  props: ['data', 'options'],
}
</script>

<style lang="scss" scoped>
    .m-circle-chart {
        width: 120px;
        height: 120px;
        position: relative;
        z-index: 1;
    }

    .m-circle-chart__inner-chart {
        position: absolute;
        top: 4px;
        left: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 20px solid #e8e8e8;
        background: #f8f8f8;
        color: rgb(0, 0, 0);
        border-radius: 50%;
        box-sizing: border-box;
        z-index: 2;
    }

    .m-circle-chart__chart {
        z-index: 3;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .m-circle-chart__chart-glow {
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: .5;
        filter: blur(5px) contrast(10);
    }
</style>