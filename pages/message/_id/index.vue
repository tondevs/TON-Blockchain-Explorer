<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Message Info') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading && message" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests table-detail">
                <tbody>
                <tr>
                  <td><strong>{{ $t('Message ID') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/message/${message.id}`)">{{ message.id }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Date & Time') }}</strong></td>
                  <td>{{ formatTime(message.created_at) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('From') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/account/${message.src}`)">{{ message.src }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('To') }}</strong></td>
                  <td><nuxt-link :to="localePath(`/account/${message.dst}`)">{{ message.dst }}</nuxt-link></td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Status') }}</strong></td>
                  <td>{{ $t(message.status_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Type') }}</strong></td>
                  <td>{{ $t(message.msg_type_name) }}</td>
                </tr>
                <tr>
                  <td><strong>{{ $t('Value') }}</strong></td>
                  <td>{{ ((parseInt(message.value) / 1000000000) || 0).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
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
      message: undefined,
    }
  },
  async beforeMount() {
    this.loading = true;

    const message_id = this.$route.params.id;
    this.message = (await controller.getMessages(this.$store.state.baseURL, 1, undefined, message_id))[0];

    console.log(this.message);

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
