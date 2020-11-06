<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV()" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <Loader v-if="loading" />
        <div class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <th>{{ $t('Account Address') }}</th>
                  <th>{{ $t('Last Paid') }}</th>
                  <th>{{ $t('Balance') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="account in accounts">
                  <td><nuxt-link class="block-id" :to="localePath(`/account/${account.id}`)">{{ account.id }}</nuxt-link></td>
                  <td>{{ account.last_paid > 0 ? formatTime(account.last_paid) : '-' }}</td>
                  <td class="text-right">{{ parseInt(account.balance).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
              <p v-if="!accounts.length" class="center-text">{{ $t('No accounts found') }}</p>
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
import TONController from '@/assets/js/TONController';
import Loader from "@/components/Global/Loader";
import _ from "lodash";
const controller = new TONController();
import moment from 'moment';
import web3Utils from 'web3-utils';
import JsonToCsv from "assets/js/jsonToCsv";

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      accounts: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    this.accounts = await controller.getLatestAccounts(this.$store.state.baseURL, 25);
    console.log(this.accounts);

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
      const lastTimeStamp = _.last(this.accounts).balance;
      const moreAccounts = await controller.getLatestAccounts(this.$store.state.baseURL, 25, lastTimeStamp);
      this.accounts = [...this.accounts, ...moreAccounts];
    },
    exportCSV() {
      const data = this.accounts.map(account => {
        return {
          account_address: account.id,
          last_paid: this.formatTime(account.last_paid),
          balance: parseInt(account.balance),
        };
      });
      const exporter = new JsonToCsv({
        account_address: "Account Address",
        last_paid: "Last Paid",
        balance: "Balance",
      }, data, 'Accounts');
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
