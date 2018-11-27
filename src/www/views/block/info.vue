<template>

    <!-- Page -->

    <div>

        <div class="panel panel-bordered" v-if="info">
            <div class="panel-heading">
                <h4 class="panel-title">Block: {{info._id}}</h4>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="width: 10%">Height</th>
                            <th style="width: 20%">Difficulty</th>
                            <th style="width: 10%">Confirms</th>
                            <th style="width: 10%">Size</th>
                            <th style="width: 10%">Bits</th>
                            <th style="width: 20%">Nonce</th>
                            <th style="width: 20%">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-info">
                            <td>{{info.idx}}</td>
                            <td>{{info.diff}}</td>
                            <td>{{coin.blocks - info.idx}}</td>
                            <td>{{_.toKb(info.sz)}}B</td>
                            <td>{{info.bits}}</td>
                            <td>{{info.n}}</td>
                            <td>{{ info.tt | moment("YYYY-MM-DD h:mm:ss A")}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel panel-bordered">
            <div class="panel-heading">
                <h4 class="panel-title">Latest transactions</h4>
            </div>
            <div class="table-responsive">
              

                <mix-table :data="data" css="table table-hover table-striped table-bordered text-center w-full" ref="mixtable"
                    @mixtable:fetch="fetch" :limit=15>

                    <mix-table-column data-field="tt" label="Timestamp" type="slot" target="time" class="text-center"
                        width="20%"></mix-table-column>
                    <mix-table-column data-field="_id" label="Hash" type="slot" target="Hash" class="text-center"></mix-table-column>
                    <mix-table-column data-field="out" label="Recipients" type="slot" class="text-center" width="10%"
                        target="Recipients"></mix-table-column>
                    <mix-table-column data-field="val" label="Amount" type="slot" target="val" class="text-center"
                        width="15%"></mix-table-column>


                    <template slot="Hash" slot-scope="props">
                        <router-link :to="{name:'tx-info', params:{ id: props.row._id}}">{{props.value}}</router-link>
                    </template>

                    <template slot="Recipients" slot-scope="props">
                        <span>{{props.value.length}}</span>
                    </template>

                    <template slot="val" slot-scope="props">{{_.numberFormat(props.value, 8)}}</template>

                    <template slot="time" slot-scope="props">
                        <span class="text-center">{{ props.value | moment("YYYY-MM-DD h:mm:ss A")}}</span>
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
                info: "block_info",
                coin: "coin_info",
                data: "tx_data"

            })
        },
        methods: {
            detail() {
                if (this.$route.params.id) {
                    this.$store.dispatch("BLOCK_INFO", { id: this.$route.params.id });
                    this.$store.dispatch("TX_FETCH", { search: this.$route.params.id, cid: this.$route.params.cid });
                }
            }

        },

        created() {
            this.detail();
        },

        watch: {
            $route: "detail"
        },

    };
</script>