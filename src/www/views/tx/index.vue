<template>
    <!-- <div class="page">
        <div class="page-content container-fluid"> -->
    <div class="panel panel-bordered">
        <header class="panel-heading">
            <h4 class="panel-title">Latest transactions</h4>
        </header>


        <div class="table-responsive">
            <mix-table :data="data" css="table table-hover table-striped table-bordered text-center" ref="mixtable"
                @mixtable:fetch="fetch" :limit=15>

                <mix-table-column data-field="idx" label="Block" type="slot" target="block" width="110px"></mix-table-column>
                <mix-table-column data-field="_id" label="Hash" type="slot" target="Hash" class="text-center"></mix-table-column>
                <mix-table-column data-field="out" label="Recipients" type="slot" class="text-center" width="10%"
                    target="Recipients"></mix-table-column>
                <mix-table-column data-field="val" label="Amount" type="slot" target="val" class="text-center" width="15%"></mix-table-column>
                <mix-table-column data-field="tt" label="Timestamp" type="slot" target="time" class="text-center" width="20%"></mix-table-column>

                <template slot="block" slot-scope="props">
                    <router-link class="text-center" :to="{name:'block', params:{ id: props.row.bid}}">{{props.value}}</router-link>

                </template>

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
                data: "tx_data",
            })
        },
        mounted() {

            var _this = this;
            clearInterval(_this.timer);

            _this.timer = setInterval(function () {
                if (_this.$refs.mixtable)
                    _this.$refs.mixtable.reload();
            }, 60000);
        },
        methods: {
            fetch(params) {
                params = Object.assign(params, { cid: this.$route.params.cid });
                this.$store.dispatch("TX_FETCH", params);
            },

        },

    };
</script>