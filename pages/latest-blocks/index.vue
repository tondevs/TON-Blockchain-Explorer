<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Total Blocks') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ latestBlock ? latestBlock.seq_no.toLocaleString() : '0' }}</span>
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
                <span>{{ avgBlockTime }} {{ $t('Seconds') }}</span>
              </div>
            </div>
          </div>
<!--          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">-->
<!--            <div class="item">-->
<!--              <div class="title">-->
<!--                <div class="icon"></div>-->
<!--                <h5>{{ $t('Blocks') }} <small>{{ $t('by validators') }}</small></h5>-->
<!--              </div>-->
<!--              <div class="text position-relative">-->
<!--                <span>{{ blocksByValidators ? blocksByValidators.toLocaleString() : 'TBD' }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Workchain Shards') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ workchainCount ? workchainCount.toLocaleString() : '0' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV()" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <Loader style="height: 70vh;" v-if="loading"/>
        <div v-else class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('Block ID') }}</td>
                  <td>{{ $t('Block Hash') }}</td>
                  <td>{{ $t('Date & Time') }}</td>
                  <td>{{ $t('Transactions') }}</td>
                  <td>{{ $t('Status') }}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="block in latestBlocks">
                  <td>{{ block.seq_no }}</td>
                  <td>
                    <nuxt-link :to="localePath(`/block/${block.id}`)" class="block-id">{{ block.id }}</nuxt-link>
                  </td>
                  <td>{{ formatTime(block.gen_utime) }}</td>
                  <td>{{ block.tr_count }}</td>
                  <td>{{ $t(block.status_name) }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center mt-3">
              <a @click.prevent="loadMore()" class="btn-secondary-line mobile-bottom-fix">{{ $t('Load More', {n:25}) }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TONController from '../../assets/js/TONController';
import Loader from "@/components/Global/Loader";
import _ from "lodash";

const controller = new TONController();
import moment from 'moment';
import JsonToCsv from "assets/js/jsonToCsv";

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      latestBlocks: [],
      latestBlock: undefined,
      avgBlockTime: undefined,
      aggregateTransactionsCount: undefined,
      workchainCount: undefined,
      latestBlockConfig: undefined,
      blocksByValidators: undefined,
    }
  },
  async beforeMount() {
    this.loading = true;

    this.latestBlocks = await controller.getLatestBlocks(this.$store.state.baseURL, 25);
    this.latestBlock = this.latestBlocks[0];
    const firstTwo = this.latestBlocks.slice(0, 2);
    this.avgBlockTime = (firstTwo[1].gen_utime - firstTwo[0].gen_utime) * -1;
    this.aggregateTransactionsCount = Number((await controller.getAggregateTransactionsCount(this.$store.state.baseURL))[0]);
    this.workchainCount = await controller.getWorkchainCount(this.$store.state.baseURL);

    this.loading = false;
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
    },
    async loadMore() {
      const lastTimeStamp = _.last(this.latestBlocks).gen_utime;
      console.log(lastTimeStamp);
      const moreBlocks = await controller.getLatestBlocks(this.$store.state.baseURL, 25, lastTimeStamp);
      this.latestBlocks = [...this.latestBlocks, ...moreBlocks];
    },
    exportCSV() {
      const data = this.latestBlocks.map(block => {
        return {
          block_id: block.seq_no,
          block_hash: block.id,
          date_time: this.formatTime(block.gen_utime),
          transactions: block.tr_count,
          status: block.status_name,
        };
      });
      const exporter = new JsonToCsv({
        block_id: "Block ID",
        block_hash: "Block Hash",
        date_time: "Date & Time",
        transactions: "Transactions",
        status: "Status",
      }, data, 'Latest_Blocks');
      exporter.exportCSVFile();
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  .block-id {
    display: block;
    max-width: 20vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
