<template>

    <!-- Page -->

    <div>
        <div class="panel panel-bordered" v-if="info">
            <header class="panel-heading">
                <h4 class="panel-title">Address: {{info._id}}</h4>
            </header>

            <div class="table-responsive">
                <table class="table table-hover table-bordered text-center">
                    <thead>
                        <tr>
                            <th style="width: 33%">Sent</th>
                            <th style="width: 33%">Received</th>
                            <th style="width: 33%">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{_.numberFormat(info.sent, 8)}}</td>
                            <td>{{_.numberFormat(info.rec, 8)}}</td>
                            <td>{{_.numberFormat(info.bl, 8)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel panel-bordered">
            <header class="panel-heading">

                <h4 class="panel-title">Latest transactions</h4>
            </header>
            <div class="table-responsive">
                <mix-table :data="data" css="mix-table table table-hover table-striped table-bordered text-center"
                    ref="mixtable" @mixtable:fetch="fetch" :limit=15>

                    <mix-table-column data-field="tt" label="Timestamp" type="slot" width="20%" class="text-center"
                        target="tt"></mix-table-column>
                    <mix-table-column data-field="tx" label="Hash" type="slot" target="Hash" class="text-center" width="55%"></mix-table-column>
                    <mix-table-column data-field="tp" label="Type" type="slot" target="tp" class="text-center" width="10%"></mix-table-column>
                    <mix-table-column data-field="val" label="Amount" type="slot" class="text-center" width="15%"
                        target="val"></mix-table-column>

                    <template slot="tt" slot-scope="props">
                        <span>{{ props.value | moment("YYYY-MM-DD h:mm:ss A")}}</span>
                    </template>

                    <template slot="Hash" slot-scope="props">
                        <router-link :to="{name: 'tx-info', params:{ id: props.value}} ">{{props.value}}</router-link>
                    </template>

                    <template slot="tp" slot-scope="props">
                        <span v-if="props.value == 1" class="badge badge-success font-weight-100">IN</span>
                        <span v-else class="badge badge-warning font-weight-100">OUT</span>
                    </template>

                    <template slot="val" slot-scope="props">
                        <span>{{_.numberFormat(props.value, 4)}}</span>
                    </template>
                </mix-table>
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
                info: "address_info",
                data: "tx_data"
            })
        },
        methods: {

            detail: function () {
                this.$store.dispatch("ADDRESS_INFO", { id: this.$route.params.id });
            },
            fetch(params) {
                this.$store.dispatch("TRANSACTION_FETCH", Object.assign(params, { search: this.$route.params.id, cid: this.$route.params.cid }));
            }

        },

        mounted() {
            this.detail();
        },

        watch: {
            $route: 'detail'
        },

    };
</script>