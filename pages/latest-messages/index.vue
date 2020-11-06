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
      messages: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    this.messages = await controller.getMessages(this.$store.state.baseURL, 25);

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
      const lastTimeStamp = _.last(this.messages).created_at;
      console.log(lastTimeStamp);
      const moreMessages = await controller.getMessages(this.$store.state.baseURL, 25, lastTimeStamp);
      console.log(moreMessages);
      this.messages = [...this.messages, ...moreMessages];
    },
    exportCSV() {
      const data = this.messages.map(message => {
        return {
          message_id: message.id,
          date_time: this.formatTime(message.created_at),
          status: message.status_name,
          type: message.msg_type_name,
          value: parseInt(message.value),
        };
      });
      const exporter = new JsonToCsv({
        message_id: "Message ID",
        date_time: "Date & Time",
        status: "Status",
        type: "Type",
        value: "Value",
      }, data, 'Latest_Messages');
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
