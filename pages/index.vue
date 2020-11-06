<template>
  <div>
    <section class="block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('General Information') }}</h2>
            </div>
          </div>
          <div class="offset-lg-3 col-lg-6">
            <div class="center-text">
              <p>{{ $t('TON Blockchain Explorer is a Explorer and Analytics Platform for TON, a decentralized smart contracts platform.') }}</p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Total Blocks') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span v-if="latestBlock">{{ latestBlock.seq_no.toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Average Block Time') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span>{{ avgBlockTime }} {{ $t('Seconds') }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Total Transactions') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span v-if="aggregateTransactionsCount">{{ aggregateTransactionsCount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Workchain Shards') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span>{{ workchainCount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Accounts') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span>{{ accountsCount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Total TONs') }}</h5>
              </div>
              <div class="text position-relative">
                <Loader v-if="loading" />
                <span>{{ accountsTotalBalance.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TONController from '../assets/js/TONController';
const controller = new TONController();
import _ from 'lodash';
import moment from 'moment';
import Loader from "@/components/Global/Loader";

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      latestBlocks: [],
      latestBlock: undefined,
      avgBlockTime: 0,
      aggregateTransactionsCount: 0,
      workchainCount: 0,
      accountsCount: 0,
      accountsTotalBalance: 0,
      blocksByValidators: 0,
    }
  },
  async beforeMount() {
    this.loading = true;
    this.latestBlocks = await controller.getLatestBlocks(this.$store.state.baseURL);
    this.latestBlock = _.last(this.latestBlocks);
    const firstTwo = this.latestBlocks.slice(0, 2);
    this.avgBlockTime = (firstTwo[1].gen_utime - firstTwo[0].gen_utime) * -1;
    this.aggregateTransactionsCount = Number((await controller.getAggregateTransactionsCount(this.$store.state.baseURL))[0]);
    this.workchainCount = await controller.getWorkchainCount(this.$store.state.baseURL);
    this.accountsCount = await controller.getAccountsCount(this.$store.state.baseURL);
    this.accountsTotalBalance = Number((Number( await controller.getAccountsTotalBalance(this.$store.state.baseURL) ) / 1000000000).toFixed(0));
    this.loading = false;
  }
}
</script>
