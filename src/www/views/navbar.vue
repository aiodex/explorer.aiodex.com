<template>
    <div class="main-nav">
        <nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega bg-green-600" role="navigation">

            <div class="navbar-header text-center">
                <button type="button" class="navbar-toggler hamburger hamburger-close navbar-toggler-left unfolded hided"
                    data-toggle="menubar" v-on:click="toggleMenubar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="hamburger-bar"></span>
                </button>

                <button type="button" class="navbar-toggler collapsed" data-target="#site-navbar-collapse" data-toggle="collapse">
                    <i class="icon wb-more-horizontal" aria-hidden="true"></i>
                </button>
                <div class="navbar-brand navbar-brand-center">
                    <router-link :to="{name: 'tx'}">
                        <img class="navbar-brand-logo" :src="img">
                    </router-link>
                    <!-- <span class="badge badge-pill badge-danger up float-right">rc</span> -->
                </div>

            </div>

            <div class="navbar-container container-fluid">
                <!-- Navbar Collapse -->
                <div class="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">

                    <div class="row">

                        <div class="col-8">
                            <form autocomplete="off" class="navbar-form form-inline navbar-left quick-search-form"
                                v-on:submit.prevent="search($event)">
                                <div class="input-group quick-search-form-input" :class="{'has-danger': errors.has('kwd') }">
                                    <input v-model="kwd" type="text" class="form-control" v-validate="{ rules: { required: true }, initial: 'kwd' }"
                                        placeholder="Quick search..." aria-describedby="quick-search-form-addon">
                                    <span class="input-group-append" id="quick-search-form-addon">
                                        <button type="submit" class="btn btn-success btn-quick-search">Search</button>

                                    </span>
                                </div>
                            </form>
                        </div>
                        <div class="col-4">

                            <ul class="nav navbar-toolbar navbar-right navbar-toolbar-right mr-5">

                                <li class="nav-item">
                                    <router-link class="nav-link" to="/">
                                        <!-- <i class="nav-fa far fa-home"></i> -->
                                        <i class="nav-fa far fa-bars"></i>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <a href="https://aiodex.com" target="_blank" class="nav-link">
                                        <i class="nav-fa far fa-home"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="javascript:void(0)" @click="switchTheme" class="nav-link"><i class="nav-fa far fa-lightbulb-on"></i></a>
                                </li>

                                <!-- Plz keep it -->
                                <li class="nav-item">
                                    <a href="https://aiodex.com" target="_blank" class="nav-link">
                                        <i class="nav-fa far fa-copyright"></i>
                                    </a>
                                </li>
                                <!-- Plz keep it -->

                                <li class="nav-item">
                                    <a href="javascript:void(0)" class="nav-link"><i class="nav-fa far fa-cog"></i></a>
                                </li>
                             
                            </ul>

                        </div>
                    </div>



                </div>
               
            </div>

            
        </nav>

        <div class="site-menubar" v-show="$route.path!='/'">
            <div class="site-menubar-body">
                <ul class="site-menu" data-plugin="menu">
                    <li class="site-menu-item">
                        <router-link :to="{ name: 'tx', params: { cid: $route.params.cid }}" class="nav-link">
                            <i aria-hidden="true" class="far fa-search site-menu-icon"></i>
                            <span class="site-menu-title">Explorer</span>
                        </router-link>
                    </li>
                    <li class="site-menu-item">
                        <router-link :to="{ name: 'movement', params: { cid: $route.params.cid }}" class="nav-link">
                            <i aria-hidden="true" class="far fa-exchange site-menu-icon"></i>
                            <span class="site-menu-title">Movement</span>
                        </router-link>
                    </li>

                    <li class="site-menu-item">
                        <router-link :to="{ name: 'addr', params: { cid: $route.params.cid }}" class="nav-link">
                            <i aria-hidden="true" class="far fa-wallet site-menu-icon"></i>
                            <span class="site-menu-title">Addresses</span>
                        </router-link>
                    </li>

                    <li class="site-menu-item" v-if="coin && coin.masternodes>0">
                        <router-link :to="{ name: 'mn', params: { cid: $route.params.cid }}" class="nav-link">
                            <i aria-hidden="true" class="fab fa-connectdevelop site-menu-icon"></i>
                            <span class="site-menu-title">Masternodes</span>
                        </router-link>
                    </li>
                    <li class="site-menu-item">
                        <router-link :to="{ name: 'richlist', params: { cid: $route.params.cid }}" class="nav-link">
                            <i aria-hidden="true" class="far fa-chart-line site-menu-icon"></i>
                            <span class="site-menu-title">Top 100</span>
                        </router-link>
                    </li>


                </ul>

            </div>

            <div class="site-menubar-footer">

                <div class="form-group text-center">
                    SYNC: <span class="text-success">{{sync}}%</span>
                </div>
               
            </div>

        </div>


        <div class="modal fade modal-success" id="search-result" aria-labelledby="examplePositionCenter" role="dialog"
            tabindex="-1" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-simple modal-center">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">Message</h4>
                    </div>
                    <div class="modal-body">
                        <p></p>
                        <p>No data result.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    export default {
        data() {
            return {
                kwd: ""
            }
        },
        computed: {
            ...mapGetters({
                coin: 'coin_info',

            }),
            img: function () {
                return this.coin ? this.coin.img : 'https://i.imgur.com/EY7TUtz.png';
            },
            sync: function () {
                return this.coin ? _.numberFormat(this.coin.idx / this.coin.blocks * 100, 2) : 0;
            }

        },
        methods: {

            search(e) {

                var _this = this;
                this.$validator.validateAll();
                if (!this.errors.any()) {


                    var payload = { id: this.kwd };                  

                    (async () => {

                        var info = await this.$store.dispatch('TX_INFO', payload);

                        if (info) {
                            return this.$router.push({ name: 'tx-info', params: { id: info._id, cid: info.cid } });
                        }

                        info = await this.$store.dispatch('ADDRESS_INFO', payload);
                        if (info) {
                            return this.$router.push({ name: 'addr-info', params: { id: info._id, cid: info.cid } });
                        }

                        info = await this.$store.dispatch('BLOCK_INFO', payload);
                        if (info) {
                            return this.$router.push({ name: 'block', params: { id: info._id, cid: info.cid } });
                        }

                        $('#search-result').modal('show');

                    })();

                }

            },
            switchTheme() {

                var theme = this.$cookie.get('theme-light');
                if (!theme) {
                    this.$cookie.set('theme-light', 1, 30);

                } else {
                    this.$cookie.delete('theme-light');
                }
                $('body').toggleClass('theme-dark');
            },

            toggleMenubar() {
                this.menubarOpen = !this.menubarOpen;
                if (this.menubarOpen) {
                    $(".page")
                        .last()
                        .addClass("page-menubar-open");
                    $(".site-menubar")
                        .last()
                        .addClass("site-menubar-open");
                    $(".hamburger-close")
                        .last()
                        .removeClass("hided");
                } else {
                    $(".page")
                        .last()
                        .removeClass("page-menubar-open");
                    $(".site-menubar")
                        .last()
                        .removeClass("site-menubar-open");
                    $(".hamburger-close")
                        .last()
                        .addClass("hided");
                }
            },
            
        }

    };
</script>