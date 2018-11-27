<template>

    <div class="row" v-if="info">
        <!-- First Row -->
        <div class="col-xl-3 col-md-6" v-if="info.supply>0">
            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Coin Supply ({{info._id}})</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">{{_.toKb(info.supply, 2)}}</h4>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6" v-else>
            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Blocks ({{info._id}})</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">{{_.numberFormat(info.blocks)}}</h4>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6">

            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Network</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">{{_.toKb(info.hashrate ,info.pu)}}H/s</h4>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6">
            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Difficulty</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">{{_.numberFormat(info.difficulty, 4)}}</h4>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6" v-if="info.masternodes>0">
            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Masternodes</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">{{info.masternodes}}</h4>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6" v-else>
            <div class="panel panel-bordered text-center">
                <div class="panel-heading">
                    <h4 class="panel-title">Price</h4>
                </div>
                <div class="panel-body">
                    <h4 class="font-weight-unset">Pending</h4>
                </div>
            </div>
        </div>
        <!-- End First Row -->

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
                info: "coin_info"
            })
        },


        mounted() {
            //console.log(this.$root);
            var _this = this;
            clearInterval(_this.timer);
            _this.timer = setInterval(function () {
                var _id = _this.$route.params.cid;
                if (_id)
                    _this.$store.dispatch("COIN_INFO", { id: _id })
            }, 60000);
        }



    };
</script>