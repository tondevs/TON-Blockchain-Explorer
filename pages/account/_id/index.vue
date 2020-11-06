<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Account Details') }}</h2>
            </div>
          </div>
        </div>
        <Loader v-if="loading" />
        <div v-else class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table v-if="account" class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Account Address') }}</strong></td>
                  <td>{{ account.id }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Status') }}</strong></td>
                  <td><span :class="{'green': account.acc_type_name === 'Active'}">{{ $t(account.acc_type_name) }}</span></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Balance') }}</strong></td>
                  <td>{{ parseInt(account.balance).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Last paid') }}</strong></td>
                  <td>{{ account.last_paid ? formatTime(account.last_paid) : '-' }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Due payment') }}</strong></td>
                  <td>{{ account.due_payment }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Last transaction lt') }}</strong></td>
                  <td>{{ formatTime(account.last_trans_lt) }}</td>
                </tr>
<!--                <tr>-->
<!--                  <td><strong>Code</strong></td>-->
<!--                  <td>{{ account.code }}</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td><strong>Code hash</strong></td>-->
<!--                  <td>{{ account.code_hash }}</td>-->
<!--                </tr>-->
                <tr>
                  <td><strong>{{ $t('Data') }}</strong></td>
                  <td class="block-id">{{ account.data }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Data') }}</strong></td>
                  <td>{{ account.data_hash }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">Account Transactions</h2>
            </div>
          </div>
        </div>
        <div class="row mt-lg-5 mt-3">
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
                  <td class="text-right"><span :class="{'red': (parseInt(transaction.balance_delta) / 1000000000) < 0}">{{ (parseInt(transaction.balance_delta) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></span></td>
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
        <div class="row mt-lg-5 mt-3">
          <div class="col-lg-12 mt-lg-5 mt-3">
            <div class="center-heading mt-lg-5 mt-3">
              <h2 class="section-title">{{ $t('Account Messages') }}</h2>
            </div>
          </div>
        </div>
        <div class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <th>{{ $t('Message ID') }}</th>
                  <th>{{ $t('Date & Time') }}</th>
                  <th>{{ $t('Status') }}</th>
                  <th>{{ $t('Type') }}</th>
                  <th>{{ $t('Value') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="msg in messages">
                  <td><nuxt-link :to="localePath(`/message/${msg.id}`)" class="block-id">{{ msg.id }}</nuxt-link></td>
                  <td>{{ formatTime(msg.created_at) }}</td>
                  <td>{{ $t(msg.status_name) }}</td>
                  <td>{{ $t(msg.msg_type_name) }}</td>
                  <td class="text-right">{{ ((parseInt(msg.value) / 1000000000) || 0).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
              <p v-if="!messages.length" class="center-text">{{ $t('No messages found') }}</p>
            </div>

            <div class="text-center mt-3">
              <a @click.prevent="loadMoreMessages()" class="btn-secondary-line mobile-bottom-fix">{{ $t('Load More', {n:25}) }}</a>
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

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      tx: undefined,
      sequenceBlockId: undefined,
      account: undefined,
      transactions: [],
      messages: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    const account_id = this.$route.params.id;
    this.account = await controller.getAccountInfo(this.$store.state.baseURL, account_id);
    this.transactions = await controller.getAccountTransactions(this.$store.state.baseURL, account_id, 25);
    this.messages = await controller.getMessagesBy(this.$store.state.baseURL, account_id, 25);

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
      const account_id = this.$route.params.id;
      const lastTimeStamp = _.last(this.transactions).now;
      console.log(lastTimeStamp);
      const moreTransactions = await controller.getAccountTransactions(this.$store.state.baseURL, account_id, 25, lastTimeStamp);
      this.transactions = [...this.transactions, ...moreTransactions];
    },
    async loadMoreMessages() {
      const account_id = this.$route.params.id;
      const lastTimeStamp = _.last(this.messages).created_at;
      console.log(lastTimeStamp);
      const moreMessages = await controller.getMessagesBy(this.$store.state.baseURL, account_id, 25, lastTimeStamp);
      console.log(moreMessages);
      this.messages = [...this.messages, ...moreMessages];
    },
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
