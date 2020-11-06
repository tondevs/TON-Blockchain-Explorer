<template>
  <div>
    <section class="position-relative block-explorer-section block-explorer-features section bg-bottom">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center-heading"><h2 class="section-title">{{ $t('Dashboard') }}</h2></div>
          </div>
          <div class="offset-lg-3 col-lg-6">
            <div class="center-text"><p>{{ $t('Calculate profit of a node in a given timeframe.') }}</p></div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="contact-form">
              <h3 class="section-title">{{ $t('Calculator') }}</h3>
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="form-element">
                    <label for="from">{{ $t('From Date & Time') }}</label>
                    <input v-model="date_from" id="from" type="datetime-local" :placeholder="$t('tt.mm.jjjj, --:--')">
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-element">
                    <label for="to">{{ $t('To Date & Time') }}</label>
                    <input v-model="date_to" id="to" type="datetime-local" :placeholder="$t('tt.mm.jjjj, --:--')">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-8">
                  <div class="form-element">
                    <label for="node">{{ $t('Node') }}</label>
                    <input v-model="node" id="node" type="text" placeholder="26da72ac2e...">
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-element">
                    <label for="tokens">{{ $t('Amount of Tokens') }}</label>
                    <input v-model="amount" id="tokens" type="number" placeholder="">
                  </div>
                </div>
              </div>
              <div class="form-element">
                <button @click.prevent="calculate()" class="btn-secondary-box">{{ $t('Calculate') }}</button>
              </div>
              <template v-if="amount_calculated">
                <div class="mt-5"></div>
                <hr>
                <div class="calculated-tokens text-center">
                  <span>{{ (amount_calculated).toLocaleString() }}</span> <img src="../../assets/images/logos/logo.png" style="width: 48px;" alt="TON LOGO">
                </div>
              </template>
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
import {createIcon} from '@download/blockies';

export default {
  components: {Loader},
  data: () => {
    return {
      loading: true,
      date_from: undefined,
      date_to: undefined,
      node: undefined,
      amount: undefined,
      amount_calculated: undefined,
    }
  },
  async beforeMount() {
    this.loading = true;

    let data = localStorage.getItem('dashboard_data');
    if (data) {
      data = JSON.parse(data);

      this.date_from = data.date_from;
      this.date_to = data.date_to;
      this.node = data.node;
      this.amount = data.amount;
      this.amount_calculated = data.amount_calculated;
    }

    this.loading = false;
  },
  methods: {
    formatTime(TS) {
      return moment(TS * 1000).format('MMMM Do YYYY h:mm:ss a');
    },
    web3Utils() {
      return web3Utils;
    },
    calculate() {
      const date_from = moment(this.date_from).unix() / 1000;
      const date_to = moment(this.date_to).unix() / 1000;
      const node = this.node;
      const amount = this.amount;

      if (date_from && date_to && node && amount) {
        // DO CALC

        this.amount_calculated = 1337;

        localStorage.setItem('dashboard_data', JSON.stringify({
          date_from: this.date_from,
          date_to: this.date_to,
          node: this.node,
          amount: this.amount,
          amount_calculated: this.amount_calculated,
        }));
      }

      console.log(date_from, date_to, node, amount);
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
}

button:hover {
  background-color: #1992c3 !important;
  border-color: #1DAAE5 !important;
}

.calculated-tokens {
  font-weight: 300;
  font-size: 40px;
  color: #5A6066;
  letter-spacing: 3.5px;
}

.contact-form {
  background: #FFFFFF;
  box-shadow: 0 1px 18px 10px rgba(0,0,0,0.06);
  border-radius: 4px;
  padding: 40px;
  margin-top: 30px;
  position: relative;
  z-index: 2;

  .section-title {
    letter-spacing: 0.77px;
    margin-bottom: 30px;
  }

  .form-element {
    input, textarea {
      width: 100%;
      height: 46px;
      border: 1px solid #CEE1F8;
      outline: none;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 24px;

      &:focus {
        padding-left: 30px;
        border: 1px solid;
      }
    }

    textarea {
      height: 120px;
      padding: 20px;
      resize: none;
    }

    button {
      width: 100%;

      &:hover {
        border: 1px solid;
      }
    }
  }
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
