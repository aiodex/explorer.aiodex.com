<template>
    <div :class="{'layout-full': isIndex}">
        <navbar></navbar>
        <!--  -->
        <div class="page">
            <div class="page-content container-fluid">
                <overview v-if="!isIndex"></overview>
                <transition name="fade" mode="out-in">
                    <router-view class="view" keep-alive :key="$route.path"></router-view>
                </transition>
            </div>
        </div>

    </div>

</template>
<script>
    import Navbar from "./views/navbar.vue";
    import Overview from "./views/overview.vue";

    export default {

        data() {
            return {
                id: null,
            }
        },

        components: {
            "navbar": Navbar,
            "overview": Overview
        },

        computed: {
            // a computed getter
            isIndex: function () {
                // `this` points to the vm instance
                return this.$route.path == '/'
            }
        },

        mounted() {

            var theme = this.$cookie.get('theme-light');
            if (theme) {
                $('body').removeClass('theme-dark');
            }

        },

        watch: {
            '$route.params.cid': function (id) {
                if (this.id != id){
                    this.id = id;
                    this.$store.dispatch("COIN_INFO", { id: id });
                }
            }
        },



    };
</script>