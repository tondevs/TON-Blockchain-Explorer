<template>
  <section class="block-explorer-wrapper bg-bottom-center" id="welcome-1">
    <div class="block-explorer text">
      <div class="container text-center">
        <div class="row">
          <div class="col-lg-12 align-self-center">
            <h1>{{ $t('TON Blockchain Explorer') }}</h1>
          </div>
          <div class="offset-lg-3 col-lg-6">
            <p>{{ $t('Up To Block') }} {{ latestBlock ? latestBlock.seq_no.toLocaleString(): '' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="search">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="input-wrapper">
              <div class="input">
                <input v-model="searchVal" @keyup.enter="onSearch()" type="text" :placeholder="$t('block, hash, transaction, etc...')">
                <button @click="onSearch()"><i class="fa fa-search"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TONController from '../assets/js/TONController';
import _ from "lodash";
const controller = new TONController();

export default {
  name: 'wellcome-area-start',
  data: () => {
    return {
      latestBlocks: 0,
      latestBlock: undefined,
      searchVal: undefined,
    }
  },
  async beforeMount() {
    this.latestBlocks = await controller.getLatestBlocks(this.$store.state.baseURL);
    this.latestBlock = _.last(this.latestBlocks);
  },
  methods: {
    async onSearch() {
      const block = await controller.getBlockInfo(this.$store.state.baseURL, this.searchVal);
      if (block) {
        const param = this.searchVal;
        this.searchVal = undefined;
        return this.$router.push(this.localePath(`/block/${param}`));
      }

      const account = await controller.getAccountInfo(this.$store.state.baseURL, this.searchVal);
      if (account) {
        const param = this.searchVal;
        this.searchVal = undefined;
        return this.$router.push(this.localePath(`/account/${param}`));
      }

      const transaction = await controller.getTransactionInfo(this.$store.state.baseURL, this.searchVal);
      if (transaction) {
        const param = this.searchVal;
        this.searchVal = undefined;
        return this.$router.push(this.localePath(`/transaction/${param}`));
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
