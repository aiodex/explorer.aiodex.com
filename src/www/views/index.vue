<template>

    <div class="row thumb-view">        
        <div class="col-xl-3 col-lg-4 col-sm-6" v-for="(x, index) in data.docs">
            <div class="card card-shadow text-center">
                <div class="card-header cover overlay">
                    <div class="cover-image h-250">

                    </div>

                    <div class="overlay-panel vertical-align">

                        <div class="vertical-align-middle">
                            <router-link :to="{name: 'tx', params:{cid: x._id} }">
                                <img :src="x.img" class="w-100 h-100 rounded-circle thumb-img">
                                <h4 class="font-weight-unset">{{ x.nm }}</h4>
                            </router-link>                       

                        </div>
                    </div>

                </div>

                <div class="card-footer px-30 py-20 h-100">
                    <div class="row no-space">
                        <div class="col-5">
                            <div class="counter">
                                <div class="counter">
                                    <div class="counter-label">Blocks</div>
                                    <span class="counter-number">{{ x.h }}</span>
                                </div>



                            </div>
                        </div>
                        <div class="col-2">
                            <!-- <div class="counter-label">Votes</div>
                                        <span class="counter-number">8,5K</span> -->
                        </div>
                        <div class="col-5">
                            <div class="counter">
                                <div class="counter-label">Supply</div>
                                <span class="counter-number">{{ _.toKb(x.sup, 2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>


    import { mapGetters } from "vuex";

    export default {

        computed: {
            ...mapGetters({
                data: "coin_data",
            })
        },

        mounted() {
            var _this = this;
            this.$store.dispatch("COIN_FETCH", { limit: 100 });           
        }

    };
</script>