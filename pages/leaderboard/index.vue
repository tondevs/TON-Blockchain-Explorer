<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Current Validators') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ currentValidatorsCount }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Period Start') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(periodStart) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Period End') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(periodEnd) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Leaderboard') }}</h2>
            </div>
          </div>
        </div>
        <div v-if="!loading" class="row m-bottom-70">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('#') }}</td>
                  <td></td>
                  <td>{{ $t('Account Address') }}</td>
                  <td>{{ $t('Score') }}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in leaderboard" v-bind:key="index" v-if="index < 50">
                  <td>{{index+1}}</td>
                  <td><img class="avatar" :src="getAvatar(item.public_key)" alt=""></td>
                  <td>
                    <b>{{ getNickname(item.public_key) }}</b><br>
                    <small><nuxt-link :to="localePath(`/validator/${item.public_key}`)">{{ item.public_key }}</nuxt-link></small>
                  </td>
                  <td>{{ item.score }}</td>
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
import { createIcon } from '@download/blockies';

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      message: undefined,
      participants: [],
      participantsCount: 0,
      currentValidators: [],
      currentValidatorsCount: 0,
      periodStart: 0,
      periodEnd: 0,
      leaderboard: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    const validatorData = await controller.getValidatorData(this.$store.state.baseURL);

    this.currentValidators = validatorData.sets.current.list;
    this.currentValidatorsCount = this.currentValidators.length;

    this.participants = this.currentValidators;
    this.participantsCount = this.participants.length;

    this.periodStart = validatorData.elections_start;
    this.periodEnd = validatorData.elections_end;

    this.calculateOrder(this.participants);
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
    },
    web3Utils() {
      return web3Utils;
    },
    getNickname(hash) {
      return controller.getReadableHash(hash);
    },
    getAvatar(hash) {
      const avatar = createIcon({ // All options are optional
        seed: hash, // seed used to generate icon data, default: random
        size: 15, // width/height of the icon in blocks, default: 10
        scale: 3 // width/height of each block in pixels, default: 5
      });
      return avatar.toDataURL();
    },
    timestampToString: function(timestamp, time_only = false) {
      const printFormat = time_only ? "HH:mm:ss" : "HH:mm:ss DD MMM YYYY";
      return moment(timestamp * 1000).format(printFormat);
    },
    calculateOrder: async function(participants) {
      let leaderboard = [];
      const now = parseInt(Date.now() / 1000);

      let scoreArr = [];
      for(let i = 0; i < participants.length; i++) {
        let curParticipant = participants[i];
        scoreArr.push(controller.calculateValidatorScore(this.$store.state.baseURL, curParticipant, now));
      }

      let scores = await Promise.all(scoreArr);

      for(let i = 0; i < participants.length; i++) {
        let curPart = participants[i];
        curPart.score = scores[i].score;
        curPart.node_id = scores[i].node_id;
        leaderboard.push(curPart);
      }

      leaderboard.sort((a, b) => {
        return b.score - a.score;
      });

      console.log(leaderboard[0]);

      this.loading = false;

      this.leaderboard = leaderboard;
    },
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    border-radius: 50%;
  }

  table {
    tr td {
      vertical-align: middle;
    }

    .block-id {
      display: block;
      max-width: 20vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
