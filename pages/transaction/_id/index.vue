<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Transaction Info') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Block ID') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/block/${transaction.block_id}`)">{{ transaction.block_id }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Type') }}</strong></td>
                  <td>{{ $t(transaction.tr_type_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Time & Date') }}</strong></td>
                  <td>{{ formatTime(transaction.now) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Account') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/account/${transaction.account_addr}`)">{{ transaction.account_addr }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Aborted') }}</strong></td>
                  <td>
                    <i v-if="transaction.aborted" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Transaction Details') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Transaction ID') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/transaction/${transaction.id}`)">{{ transaction.id }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Block ID') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/block/${transaction.block_id}`)">{{ transaction.block_id }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Logical time') }}</strong></td>
                  <td>{{ web3Utils().hexToNumber(transaction.lt) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Workchain ID') }}</strong></td>
                  <td>{{ transaction.workchain_id }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Old hash') }}</strong></td>
                  <td>{{ transaction.old_hash }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('New hash') }}</strong></td>
                  <td>{{ transaction.new_hash }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Storage Fees collected') }}</strong></td>
                  <td>{{ parseInt(transaction.storage.storage_fees_collected) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Storage Fees due') }}</strong></td>
                  <td>{{ parseInt(transaction.storage.storage_fees_due) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Gas Limit') }}</strong></td>
                  <td>{{ parseInt(transaction.compute.gas_limit) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Gas Used') }}</strong></td>
                  <td>{{ parseInt(transaction.compute.gas_used) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Gas Fees') }}</strong></td>
                  <td>{{ parseInt(transaction.compute.gas_fees) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Compute Type') }}</strong></td>
                  <td>{{ $t(transaction.compute.compute_type_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Success') }}</strong></td>
                  <td>
                    <i v-if="transaction.compute.success" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Message State Used') }}</strong></td>
                  <td>
                    <i v-if="transaction.compute.msg_state_used" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Account activated') }}</strong></td>
                  <td>
                    <i v-if="transaction.compute.account_activated" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Mode') }}</strong></td>
                  <td>{{ transaction.compute.mode }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Exit Code') }}</strong></td>
                  <td>{{ transaction.compute.exit_code }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('VM steps') }}</strong></td>
                  <td>{{ transaction.compute.vm_steps }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('VM init state hash') }}</strong></td>
                  <td>{{ transaction.compute.vm_init_state_hash }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Success') }}</strong></td>
                  <td>{{ transaction.action.success }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Valid') }}</strong></td>
                  <td>{{ transaction.action.valid }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('No funds') }}</strong></td>
                  <td>{{ transaction.action.no_funds }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Status Change') }}</strong></td>
                  <td>{{ $t(transaction.action.status_change_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Total fwd fees') }}</strong></td>
                  <td>{{ transaction.action.total_fwd_fees }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Total action fees') }}</strong></td>
                  <td>{{ transaction.action.total_action_fees }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Result code') }}</strong></td>
                  <td>{{ transaction.action.result_code }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Tot actions') }}</strong></td>
                  <td>{{ transaction.action.tot_actions }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Spec actions') }}</strong></td>
                  <td>{{ transaction.action.spec_actions }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Skipped actions') }}</strong></td>
                  <td>{{ transaction.action.skipped_actions }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Messages created') }}</strong></td>
                  <td>{{ transaction.action.msgs_created }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Action list hash') }}</strong></td>
                  <td>{{ transaction.action.action_list_hash }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Destroyed') }}</strong></td>
                  <td>{{ transaction.destroyed }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Loader v-else />
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
      transaction: undefined,
      sequenceBlockId: undefined,
      transactions: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    const transaction_id = this.$route.params.id;
    this.transaction = await controller.getTransactionInfo(this.$store.state.baseURL, transaction_id);
    console.log(this.transaction);
    this.loading = false;
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
    },
    web3Utils() {
      return web3Utils;
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    .block-id {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
