<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Validator Info') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Public key hex') }}</strong></td>
                  <td>
                    <nuxt-link :to="localePath(`/validator/${validatorInfo.public_key_hex}`)">{{ validatorInfo.public_key_hex }}</nuxt-link>
                  </td>
                </tr>
                <tr>
                  <td><strong>{{ $t('ADNL address hex') }}</strong></td>
                  <td>{{ validatorInfo.adnl_address_hex }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Node ID hex') }}</strong></td>
                  <td>{{ validatorInfo.node_id_hex }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Stake') }}</strong></td>
                  <td>{{ (parseInt(validatorInfo.weight) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Validator Details') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Utime since') }}</strong></td>
                  <td>{{ formatTime(validatorInfo.utime_since) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Utime until') }}</strong></td>
                  <td>{{ formatTime(validatorInfo.utime_until) }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Loader v-else/>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Signed masterchain blocks') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="validatorInfo && validatorInfo.signed_masterchain_blocks.length" class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('Block ID') }}</td>
                  <td>{{ $t('Sequence Number') }}</td>
                  <td>{{ $t('Date & Time') }}</td>
                  <td>{{ $t('Transactions') }}</td>
                  <td>{{ $t('Shard') }}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="val in validatorInfo.signed_masterchain_blocks">
                  <td>
                    <nuxt-link :to="localePath(`/block/${val.id}`)" class="block-id">{{ val.id }}</nuxt-link>
                  </td>
                  <td>{{ val.seq_no }}</td>
                  <td>{{ formatTime(val.gen_utime) }}</td>
                  <td>{{ val.tr_count }}</td>
                  <td class="text-right">{{ (parseInt(val.shard) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TONController from '@/assets/js/TONController';
const controller = new TONController();
import Loader from "@/components/Global/Loader";
import _ from "lodash";
import moment from 'moment';
import web3Utils from 'web3-utils';

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      validatorInfo: undefined,
    }
  },
  async beforeMount() {
    this.loading = true;

    const validator_id = this.$route.params.id;
    this.validatorInfo = await controller.getValidatorInfo(this.$store.state.baseURL, validator_id);
    console.log(this.validatorInfo);
    this.loading = false;
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
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
