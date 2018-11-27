<template>
    <!-- Page -->

    <div>
        <div class="panel panel-bordered" v-if="info && coin">
            <div class="panel-heading">
                <h4 class="panel-title">Tx: {{info._id}}</h4>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered dataTable table-striped w-full dtr-inline">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Confirmations</th>
                            <th style="width: 60%;">Block Hash</th>
                            <th style="width: 20%;">Timestamp</th>
                            <th style="width: 5%;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :class="{ 'table-warning': !info.bid, 'table-info': info.bid }">
                            <td v-if="!info.bid">
                                <i class="fa-spin fal fa-cog"></i> Loading...
                            </td>
                            <td v-else>
                                {{coin.blocks>info.idx?coin.blocks - info.idx:1}}
                            </td>
                            <td>
                                <router-link :to="{name:'block', params:{id: info.bid}} ">{{info.bid}}</router-link>
                            </td>
                            <td>{{ info.tt | moment("YYYY-MM-DD h:mm:ss A") }}</td>
                            <td class="text-center">
                                <router-link :to="{name:'block', params:{id: info.bid}} ">
                                    <span class="fa fa-eye table-eye"></span>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row" v-if="info">
            <div class="col-md-6">
                <div class="panel panel-bordered">
                    <div class="panel-heading">
                        <h4 class="panel-title font-weight-unset">Inputs</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped summary-table">

                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!info.in || info.in.length==0">
                                    <td colspan="2" class="badge-info text-center">Proof of Stake</td>
                                </tr>
                                <tr v-else-if="info.in.length>0 && info.in[0]._id == coin._id">
                                    <td colspan="2" class="badge-info text-center" v-if="info.in[0].tp=='pos'">Proof of
                                        Stake</td>
                                    <td colspan="2" class="badge-info text-center" v-else>Coin Base</td>
                                </tr>
                                <tr v-else v-for="a in info.in">
                                    <td>
                                        <router-link :to="{name: 'addr-info', params:{id: a._id}}" class="loading">{{a._id}}</router-link>
                                    </td>
                                    <td class="badge-danger">{{ _.numberFormat(a.val,8)}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="panel panel-bordered">
                    <div class="panel-heading">
                        <h4 class="panel-title font-weight-unset">Recipients</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped summary-table left-table">
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!info.out || info.out.length==0">
                                    <td colspan="2" class="badge-info text-center">Nonstandard</td>
                                </tr>
                                <tr v-else v-for="r in info.out">
                                    <td>
                                        <router-link :to="{name:'addr-info', params:{id: r._id}}">{{r._id}}</router-link>
                                    </td>
                                    <td class="badge-success">{{ _.numberFormat(r.val, 8)}}</td>
                                </tr>

                                <tr v-if="fee>0.00000001">
                                    <td>
                                        <strong>Fee</strong>
                                    </td>
                                    <td class="badge-info">{{_.numberFormat(fee, 8)}}</td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    </div>

    <!-- End Page -->
</template>


<script>
    import { mapGetters } from "vuex";

    export default {

        data: function () {
            return {
                timer: null,
            }
        },

        computed: {
            ...mapGetters({
                info: "tx_info",
                coin: "coin_info"
            }),

            fee() {
                return this.info ? _.sumBy(this.info.in, 'val') - _.sumBy(this.info.out, 'val') : 0;
            }
        },
        methods: {
            detail() {
                if (this.$route.params.id) {
                    this.$store.dispatch("TX_INFO", { id: this.$route.params.id });
                }
            }

        },

        mounted() {

            var _this = this;
            this.detail();
            var t = setInterval(() => {
                if (_this.info.bid) {
                    clearInterval(t);
                } else {
                    _this.detail();
                }
            }, 15000);
        },

        watch: {
            $route: "detail"
        },

    };
</script>