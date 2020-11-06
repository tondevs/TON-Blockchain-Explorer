<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">

        <div class="d-flex justify-content-between mb-5">
          <nuxt-link :to="localePath(`/leaderboard`)" class="btn-secondary-line mobile-bottom-fix">{{ $t('Leaderboard') }}</nuxt-link>
          <nuxt-link :to="localePath(`/dashboard`)" class="btn-secondary-line mobile-bottom-fix">{{ $t('Dashboard') }}</nuxt-link>
        </div>

        <Loader style="height: 70vh;" v-if="loading" />
        <div v-else class="row justify-content-center">
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Current Validators') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ validatorData.number_of_validators }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Elections Status') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ validatorData.election_status }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Elections Start') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.elections_start, true) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Elections End') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.elections_end, true) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Next Elections Start') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.next_elections_start) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Next Elections End') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.next_elections_end) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Validators Since') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.sets.current.utime_since, true) }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="item">
              <div class="title">
                <div class="icon"></div>
                <h5>{{ $t('Validators Until') }}</h5>
              </div>
              <div class="text position-relative">
                <span>{{ timestampToString(validatorData.sets.current.utime_until, true) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5 pt-5">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Current Validators') }}</h2>
            </div>
          </div>
        </div>

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV('current')" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <div v-if="validatorData.sets" class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('Validator ID') }}</td>
                  <td>{{ $t('ADNL') }}</td>
                  <td>{{ $t('Weight') }}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="val in validatorData.sets.current.list">
                  <td><nuxt-link :to="localePath(`/validator/${val.public_key}`)" class="block-id">{{ val.public_key }}</nuxt-link></td>
                  <td>{{ val.adnl_addr }}</td>
                  <td class="text-right">{{ (parseInt(val.weight) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="row mt-5 pt-5">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Next Validators') }}</h2>
            </div>
          </div>
        </div>

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV('next')" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <div v-if="validatorData.sets" class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('Validator ID') }}</td>
                  <td>{{ $t('ADNL') }}</td>
                  <td>{{ $t('Weight') }}</td>
                </tr>
                </thead>
                <tbody v-if="validatorData.sets.next && validatorData.sets.current.next.list">
                <tr v-for="val in validatorData.sets.next.list">
                  <td><nuxt-link :to="localePath(`/validator/${val.public_key}`)" class="block-id">{{ val.public_key }}</nuxt-link></td>
                  <td>{{ val.adnl_addr }}</td>
                  <td class="text-right">{{ (parseInt(val.weight) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="row mt-5 pt-5">
          <div class="col-lg-12">
            <div class="center-heading">
              <h2 class="section-title">{{ $t('Previous Validators') }}</h2>
            </div>
          </div>
        </div>

        <div class="text-right mt-3">
          <a @click.prevent="exportCSV('previous')" class="btn-secondary-line mobile-bottom-fix">{{ $t('Export') }}</a>
        </div>

        <div v-if="validatorData.sets" class="row mt-lg-5 mt-3">
          <div class="col-lg-12">
            <div class="table-responsive">
              <table class="table table-striped table-latests">
                <thead>
                <tr>
                  <td>{{ $t('Validator ID') }}</td>
                  <td>{{ $t('ADNL') }}</td>
                  <td>{{ $t('Weight') }}</td>
                </tr>
                </thead>
                <tbody v-if="validatorData.sets.previous && validatorData.sets.previous.list">
                <tr v-for="val in validatorData.sets.previous.list">
                  <td><nuxt-link :to="localePath(`/validator/${val.public_key}`)" class="block-id">{{ val.public_key }}</nuxt-link></td>
                  <td>{{ val.adnl_addr }}</td>
                  <td class="text-right">{{ (parseInt(val.weight) / 1000000000).toLocaleString() }} <img src="@/assets/images/icon/crystal.png" alt=""></td>
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
import TONController from '../../assets/js/TONController';
import * as qFunctions from '../../assets/js/functions';
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
      validatorData: [],
    }
  },
  async beforeMount() {
    this.loading = true;

    this.validatorData = await controller.getValidatorData(this.$store.state.baseURL);

    this.loading = false;
  },
  methods: {
    timestampToString: function(timestamp, time_only = false) {
      const printFormat = time_only ? "HH:mm:ss" : "HH:mm:ss DD MMM YYYY";
      return moment(timestamp * 1000).format(printFormat);
    },
    exportCSV(mode) {
      const data = this.validatorData.sets[mode].list.map(val => {
        return {
          validator_id: val.public_key,
          adnl: val.adnl_addr,
          weight: parseInt(val.weight),
        };
      });
      const exporter = new JsonToCsv({
        validator_id: "Validator ID",
        adnl: "ADNL",
        weight: "Weight",
      }, data, `Validators_${mode}`);
      exporter.exportCSVFile();
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    .block-id {
      display: block;
      max-width: 15vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
