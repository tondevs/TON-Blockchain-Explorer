<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
<!--        <div class="row justify-content-center">-->
<!--          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">-->
<!--            <div class="item">-->
<!--              <div class="title">-->
<!--                <div class="icon"></div>-->
<!--                <h5>Total Blocks</h5>-->
<!--              </div>-->
<!--              <div class="text position-relative">-->
<!--                <Loader v-if="loading" />-->
<!--                <span>{{ latestBlock ? latestBlock.seq_no.toLocaleString() : '0' }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV()" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <Loader style="height: 70vh;" v-if="loading" />
        <div v-else class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <th>{{ $t('Transaction ID') }}</th>
                  <th>{{ $t('Date & Time') }}</th>
                  <th>{{ $t('Aborted') }}</th>
                  <th>{{ $t('Type') }}</th>
                  <th>{{ $t('Value') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="transaction in transactions">
                  <td><nuxt-link :to="localePath(`/transaction/${transaction.id}`)" class="block-id">{{ transaction.id }}</nuxt-link></td>
                  <td>{{ formatTime(transaction.now) }}</td>
                  <td>
                    <i v-if="transaction.aborted" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                  <td>{{ $t(transaction.tr_type_name) }}</td>
                  <td class="text-right"><span :class="{'red': (web3Utils().hexToNumber(transaction.balance_delta) / 1000000000) < 0}">{{ (web3Utils().hexToNumber(transaction.balance_delta) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></span></td>
                </tr>
                </tbody>
              </table>
              <p v-if="!transactions.length" class="center-text">{{ $t('No transactions found') }}</p>
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
import web3Utils from "web3-utils";
import JsonToCsv from "assets/js/jsonToCsv";

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      transactions: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    this.transactions = await controller.getTransactions(this.$store.state.baseURL, 25);

    this.loading = false;
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
    },
    web3Utils() {
      return web3Utils;
    },
    async loadMore() {
      const lastTimeStamp = _.last(this.transactions).now;
      console.log(lastTimeStamp);
      const moreTransactions = await controller.getTransactions(this.$store.state.baseURL, 25, lastTimeStamp);
      console.log(moreTransactions);
      this.transactions = [...this.transactions, ...moreTransactions];
    },
    exportCSV() {
      const data = this.transactions.map(transaction => {
        return {
          transaction_id: transaction.id,
          date_time: this.formatTime(transaction.now),
          aborted: transaction.aborted,
          type: transaction.tr_type_name,
          value: parseInt(transaction.balance_delta),
        };
      });
      const exporter = new JsonToCsv({
        transaction_id: "Transaction ID",
        date_time: "Date & Time",
        aborted: "Aborted",
        type: "Type",
        value: "Value",
      }, data, 'Latest_Transactions');
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
