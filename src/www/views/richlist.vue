<template>
    <!-- Page -->

    <div>
        <div class="panel">
            <div class="panel-heading">
                <h4 class="panel-title text-center">Wealth Distribution</h4>
            </div>
            <div class="panel-body">
                <!-- <highcharts height="350px" ref="pie" :options="options"></highcharts> -->
                <div id="hightchart" class="h-400"></div>
            </div>
        </div>

        <div class="panel panel-bordered">
            <header class="panel-heading">

                <h3 class="panel-title">Top 100 - Current Balance</h3>
            </header>
            <div class="table-responsive">
                <table class="table table-hover table-bordered  table-striped w-full">
                    <thead>
                        <tr role="row">
                            <th class="text-center w-5">
                                <span class="fa fa-flag-checkered"></span>
                            </th>
                            <th class="sorting">Address</th>
                            <th class="sorting">Balance</th>
                            <th class="sorting text-center">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="data" v-for="(a, index) in data.docs">
                            <td class="text-center">{{index +1}}</td>

                            <td>
                                <router-link :to="{name:'addr-info', params:{id: a._id}}">{{a._id}}</router-link>
                                <label v-if="coin.lb && coin.lb[a._id]" style="margin-left:15px;" class="badge badge-table badge-info">{{coin.lb[a._id]}}</label>
                            </td>

                            <td>{{_.numberFormat(a.bl, 8)}}</td>
                            <td class="text-center">{{_.numberFormat((a.bl / coin.supply) * 100, 2)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- End Page -->
</template>

<script>

    import { mapGetters } from "vuex";

    export default {


        computed: {
            ...mapGetters({
                coin: 'coin_info',
                data: "address_data"               

            })
        },
        methods: {
            buildChart() {

                var _this = this;
                setTimeout(() => {
                    var sum = 0;
                    var pr = 0;
                    var supply = _this.coin.supply;

                    var series = [];

                    for (let i = 0; i < _this.data.docs.length; i++) {
                        const doc = _this.data.docs[i];
                        sum += doc.bl;

                        var percent = (sum / supply) * 100;

                        switch (i) {
                            case 10:
                                series.push({ name: 'Top 1-10', y: percent });
                                pr += percent;
                                sum = 0;
                                break;

                            case 50:
                                series.push({ name: 'Top 11-50', y: percent });
                                pr += percent;

                                sum = 0;
                                break;
                            case 75:
                                series.push({ name: 'Top 51-75', y: percent });
                                pr += percent;
                                sum = 0;
                                break;

                            case 99:

                                series.push({ name: 'Top 76-100', y: percent });
                                pr += percent;
                                percent = 100 - pr;
                                series.push({ name: 'Others', y: percent });
                                sum = 0;
                                break;

                        }

                    }

                    // _this.series = [{
                    //     name: 'Rich',
                    //     colorByPoint: true,
                    //     data: series
                    // }];   



                    Highcharts.chart('hightchart', {

                        chart: {
                            backgroundColor: 'transparent',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    // style: {
                                    //     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    // }
                                }
                            },
                            showInLegend: true,

                        },
                        series: [{
                            name: 'Rich',
                            type: 'pie',
                            colorByPoint: true,
                            data: series
                        }]
                    }
                    );

                }, 800);
            },
        },
        mounted() {

            var _this = this;
            this.$store.dispatch("ADDRESS_FETCH", { cid: this.$route.params.cid, limit: 100 }).then(() => {
                _this.buildChart();
            });



        }

    };
</script>