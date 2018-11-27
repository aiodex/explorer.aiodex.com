<template>
    <!-- Page -->

    <div class="panel panel-bordered">
        <header class="panel-heading">           
            <h4 class="panel-title">Movement</h4>
        </header>
        <div class="table-responsive">
            <mix-table :data="data" css="table table-hover table-striped table-bordered text-center" ref="mixtable"
                @mixtable:fetch="fetch" :limit=15>

                <mix-table-column data-field="tt" label="Timestamp" type="slot" target="time" width="15%"></mix-table-column>
                <mix-table-column data-field="tx" label="Tx" type="slot" target="txid"></mix-table-column>
                <mix-table-column data-field="wid" label="Addr" type="slot" target="addr" width="30%"></mix-table-column>
                <mix-table-column data-field="tp" label="Type" type="slot" target="tp" class="text-center" width="5%"></mix-table-column>
                <mix-table-column data-field="val" label="Amount" type="slot" width="10%" target="val"></mix-table-column>


                <template slot="time" slot-scope="props">
                    <span>{{props.value | moment("YYYY-MM-DD h:mm:ss A")}}</span>
                </template>

                <template slot="txid" slot-scope="props">
                    <router-link :to="{name: 'tx-info',params:{id:props.value } }">{{props.value}}</router-link>
                </template>
                <template slot="addr" slot-scope="props">
                    <span v-if="props.value == coin._id" class="badge badge-success">coinbase</span>
                    <router-link v-else :to="{name: 'addr-info',params:{id:props.value } }">{{props.value}}</router-link>
                </template>
                <template slot="tp" slot-scope="props">
                    <span v-if="props.value == 1" class="badge badge-success font-weight-100">IN</span>
                    <span v-else class="badge badge-warning font-weight-100">OUT</span>
                </template>

                <template slot="val" slot-scope="props">
                    <span>{{_.numberFormat(props.value,8)}}</span>
                </template>
            </mix-table>

        </div>
    </div>


    <!-- End Page -->
</template>


<script>

    import { mapGetters } from "vuex";

    export default {

        computed: {
            ...mapGetters({
                data: "tx_data",
                coin: "coin_info",
            })
        },

        methods: {
            fetch(params) {
                this.$store.dispatch("TRANSACTION_FETCH", Object.assign(params, { cid: this.$route.params.cid }));
            }

        },

    };
</script>