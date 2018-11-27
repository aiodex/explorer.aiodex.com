<template>
    <!-- Page -->

    <div class="panel panel-bordered">
        <header class="panel-heading">           
            <h3 class="panel-title">Addresses</h3>
        </header>
        <div class="table-responsive">
            <mix-table :data="data" css="table table-hover table-striped table-bordered w-full" ref="mixtable" @mixtable:fetch="fetch"
                :limit=15>

                <mix-table-column data-field="_id" label="Address" type="slot" target="Payee" width="30%"></mix-table-column>
                <mix-table-column data-field="bl" label="Balance" type="slot" target="bl" width="25%"></mix-table-column>
                <mix-table-column data-field="sent" label="Sent" type="slot" target="sent" width="25%"></mix-table-column>
                <mix-table-column data-field="rec" label="Received" type="slot" target="rec" width="25%"></mix-table-column>


                <template slot="Payee" slot-scope="props">
                    <router-link :to="{name:'addr-info', params:{ id: props.row._id}}">{{props.value}}</router-link>
                </template>

                <template slot="bl" slot-scope="props">
                    <span>{{_.numberFormat(props.value, 8)}}</span>
                </template>

                <template slot="sent" slot-scope="props">
                    <span>{{_.numberFormat(props.value, 8)}}</span>
                </template>
                <template slot="rec" slot-scope="props">
                    <span>{{_.numberFormat(props.value, 8)}}</span>
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
                data: "address_data",
            })
        },
        methods: {
            fetch(params) {
                params = Object.assign(params, { cid: this.$route.params.cid });
                this.$store.dispatch("ADDRESS_FETCH", params);
            }
        },

    };
</script>