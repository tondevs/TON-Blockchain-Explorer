<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Block Info') }}</h2>
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
                  <td>{{ block.id }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Date & Time') }}</strong></td>
                  <td>{{ formatTime(block.gen_utime) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Status') }}</strong></td>
                  <td>{{ $t(block.status_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Number') }}</strong></td>
                  <td>{{ block.seq_no.toLocaleString() }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Workchain') }}</strong></td>
                  <td>{{ block.workchain_id }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Shard') }}</strong></td>
                  <td>{{ block.shard }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Previous Block Sequence Nr.') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/block/${sequenceBlockId}`)">{{ block.prev_key_block_seqno }}</nuxt-link></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Loader v-else />
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Block Details') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Fees collected') }}</strong></td>
                  <td>{{ parseInt(block.value_flow.fees_collected) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Parent') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/block/${block.prev_ref.root_hash}`)" class="block-id">{{ block.prev_ref.root_hash }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Global Id') }}</strong></td>
                  <td>{{ block.global_id }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Want split') }}</strong></td>
                  <td>
                    <i v-if="block.want_split" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('After merge') }}</strong></td>
                  <td>
                    <i v-if="block.after_merge" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Get Catchain Sequence Number') }}</strong></td>
                  <td>{{ block.gen_catchain_seqno }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Previous Reference Root Hash') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/block/${block.prev_ref.root_hash}`)" class="block-id">{{ block.prev_ref.root_hash }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Version') }}</strong></td>
                  <td>{{ block.version }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Before split') }}</strong></td>
                  <td>
                    <i v-if="block.before_split" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('After split') }}</strong></td>
                  <td>
                    <i v-if="block.after_split" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Want merge') }}</strong></td>
                  <td>
                    <i v-if="block.want_merge" class="far fa-check-circle"></i>
                    <i v-else class="far fa-times-circle"></i>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Vert Sequence Number') }}</strong></td>
                  <td>{{ block.min_ref_mc_seqno }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Gen software version') }}</strong></td>
                  <td>{{ block.gen_software_version }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Gen software capabilities') }}</strong></td>
                  <td>{{ block.gen_software_capabilities }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Random Seed') }}</strong></td>
                  <td>{{ block.rand_seed }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Transactions') }}</h2>
            </div>
          </div>
        </div>
        <div class="row">
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
      block: undefined,
      sequenceBlockId: undefined,
      transactions: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    const block_id = this.$route.params.id;
    this.block = await controller.getBlockInfo(this.$store.state.baseURL, block_id);
    console.log(this.block);
    this.sequenceBlockId = await controller.getBlockIdBySequenceNumber(this.$store.state.baseURL, this.block.prev_key_block_seqno, this.block.workchain_id - 1);

    this.transactions = await controller.getTransactionsByBlock(this.$store.state.baseURL, block_id);

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
      display: block;
      max-width: 20vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
