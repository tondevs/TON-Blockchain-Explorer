import axios from 'axios';
import * as CRYPTO from "crypto";
import HumanHash from 'humanhash';
import { exit } from 'process';
import * as qFunctions from './functions';

export default class TONController {

  constructor() {
    this.BLOCK_STATES = {
      "Unknown": 0,
      "Preliminary": 1,
      "Proposed": 2,
      "Finalized": 3,
      "Refused": 4,
    }

  }

  async getLatestBlocks(base_url, count = 10, fromTimeStamp = undefined) {
    let blocks;
    await axios.post(base_url,
      {
        query: `
        {
          blocks (
            limit: ${count}
            ${fromTimeStamp ? 'filter: {gen_utime:{lt:' + fromTimeStamp + '}}' : ''}
            orderBy: {
              path:"gen_utime"
              direction:DESC
            }
          )
          {
            id
            status
            status_name
            seq_no
            gen_utime
            created_by
            workchain_id
            tr_count
          }
        }
      `,
      })
      .then((response) => {
        blocks = response.data.data.blocks;
      });

    return blocks;
  }

  async getAccountInfo(base_url, account_id) {
    let accountData = [];
    await axios.post(base_url,
      {
        query: `
        {
          accounts(
            filter:{
              id:{
                eq:"${account_id}"
              }
            }
          ){
            id
            acc_type_name
            last_paid
            due_payment
            last_trans_lt
            balance
            data
            data_hash
            code
            code_hash
            library_hash
            boc
          }
        }
      `,
      })
      .then(async (response) => {
        if (response.data.data.accounts.length >= 0)
          accountData = response.data.data.accounts[0];
      });

    return accountData;
  }

  async getAccountTransactions(base_url, account_addr, count = 10, fromTimeStamp = undefined) {
    let transactions;
    await axios.post(base_url,
      {
        query: `
        {
          transactions(
            filter: {
              account_addr: {
                eq: "${account_addr}"
              }
            ${fromTimeStamp ? ',now:{lt: ' + fromTimeStamp + '}' : ''}
            }
            orderBy: [
              {path:"now", direction:DESC}
            ]
            limit: ${count}
          )
          {
            id
            tr_type
            tr_type_name
            aborted
            block_id
            account_addr
            balance_delta
            workchain_id
            lt
            prev_trans_lt
            now
            outmsg_cnt
            orig_status_name
            end_status_name
            in_msg
            in_message {
              msg_type_name
              src
              dst
              value
            }
          }
        }
      `,
      })
      .then((response) => {
        transactions = response.data.data.transactions;
      });

    return transactions;
  }

  async getTransactionsByBlock(base_url, block_id) {
    let transactions;
    await axios.post(base_url,
      {
        query: `
        {
          transactions(
            filter:{
              block_id:{
                eq:"${block_id}"
              }
            }
          ){
            id
            tr_type
            tr_type_name
            aborted
            block_id
            account_addr
            balance_delta
            workchain_id
            lt
            prev_trans_lt
            now # block time that contains transaction. transaction execution time
            outmsg_cnt
            orig_status_name
            end_status_name
            in_msg
            in_message{
              msg_type_name
              src
              dst
              value
            }
          }
        }
      `,
      })
      .then((response) => {
        transactions = response.data.data.transactions;
      });
    return transactions;
  }

  async getTransactions(base_url, count = 10, fromTimeStamp = undefined) {
    let transactions;
    await axios.post(base_url,
      {
        query: `
        {
          transactions(
            limit: ${count}
            orderBy: [{ path: "now", direction: DESC }]
            ${fromTimeStamp ? 'filter:{now:{lt: ' + fromTimeStamp + '}}' : ''}
          ) {
            id
            tr_type
            tr_type_name
            aborted
            block_id
            account_addr
            balance_delta
            workchain_id
            lt
            prev_trans_lt
            now
            outmsg_cnt
            orig_status_name
            end_status_name
            in_msg
            in_message {
              msg_type_name
              src
              dst
              value
            }
          }
        }
      `
      })
      .then((response) => {
        transactions = response.data.data.transactions;
      });
    return transactions;
  }

  async getTransactionInfo(base_url, transaction_id) {
    let transactionData = [];
    await axios.post(base_url,
      {
        query: `
        {
          transactions(
            filter:{
              id:{
                eq:"${transaction_id}"
              }
            }
          ){
            id
            tr_type
            tr_type_name
            aborted
            block_id
            block {
              id
              seq_no
              workchain_id
              shard
            }
            boc
            account_addr
            balance_delta
            workchain_id
            lt
            prev_trans_hash
            prev_trans_lt
            old_hash
            new_hash
            now
            outmsg_cnt
            orig_status_name
            end_status_name
            in_msg
            in_message{
              msg_type_name
              src
              dst
              value
            }
            storage {
              storage_fees_collected
              storage_fees_due
              status_change_name
            }
            compute {
              gas_limit
              gas_used
              gas_fees
              gas_credit
              compute_type_name
              success
              msg_state_used
              account_activated
              mode
              exit_code
              vm_steps
              vm_init_state_hash
              vm_final_state_hash
            }
            action {
              success
              valid
              no_funds
              status_change_name
              total_fwd_fees
              total_action_fees
              result_code
              tot_actions
              spec_actions
              skipped_actions
              msgs_created
              action_list_hash
            }
            destroyed
          }
        }
      `,
      })
      .then((response) => {
        if (response.data.data.transactions.length >= 0)
          transactionData = response.data.data.transactions[0];
      });

    return transactionData;
  }

  async getMessages(base_url, count = 10, fromTimeStamp = undefined, message_id = undefined) {
    let messages;
    await axios.post(base_url, {
      query: `{
        messages(
          limit: ${count}
          filter:{
            ${message_id ? 'id:{eq:"' + message_id + '"}' : ''}
            ${fromTimeStamp ? 'created_at:{lt:' + fromTimeStamp + '}' : ''}
          }
          orderBy: [{ path: "created_at", direction: DESC }]
        ) {
          id
          msg_type_name
          status_name
          value(format: DEC)
          src
          dst
          created_at
        }
      }
    `
    })
      .then((response) => {
        messages = response.data.data.messages;
      });
    return messages;
  }

  async getMessagesBy(base_url, account_addr, count = 10, fromTimeStamp = undefined) {
    let messages;
    await axios.post(base_url, {
      query: `
      {
        messages(
          filter:{
            src:{eq:"${account_addr}"}
            ${fromTimeStamp ? 'created_at:{lt:' + fromTimeStamp + '}' : ''}
          }
          limit: ${count}
          orderBy: [{ path: "created_at", direction: DESC }]
        ) {
          id
          msg_type_name
          status_name
          value(format: DEC)
          src
          dst
          created_at
        }
      }
    `
    })
      .then((response) => {
        messages = response.data.data.messages;
      });
    return messages;
  }

  async getAggregateTransactionsCount(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        aggregateTransactions
      }
    `
    });
    return response.data.aggregateTransactions;
  }

  async getWorkchainCount(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        blocks(limit: 1, filter: {workchain_id: {eq: -1}}, orderBy: {path: "seq_no", direction: DESC}) {
          master {
            shard_hashes {
              workchain_id
            }
            config {
              p34 {
                utime_since
              }
            }
          }
        }
      }
    `
    });
    return response.data.blocks[0].master.shard_hashes.length;
  }

  async getLatestAccounts(base_url, limit = 25, lt = undefined) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        accounts(
          ${lt ? 'filter:{balance:{lt:"' + lt + '"}}' : ''}
          orderBy:{path: "balance", direction: DESC}
          limit: 25
        ) {
          id
          balance
          last_paid
        }
      }
    `
    });
    return response.data.accounts;
  }

  async getAccountsCount(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        getAccountsCount
      }
    `
    });
    return response.data.getAccountsCount;
  }

  async getAccountsTotalBalance(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        getAccountsTotalBalance
      }
    `
    });
    return response.data.getAccountsTotalBalance;
  }

  async getAggregateBlocks(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        aggregateBlocks
      }
    `
    });
    return response.data.aggregateBlocks[0];
  }

  async getBlockInfo(base_url, block_id) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        blocks(filter:{id:{eq:"${block_id}"}}) {
          id
          status
          status_name
          seq_no
          workchain_id
          shard
          gen_utime
          tr_count
          status
          global_id
          before_split
          want_split
          after_split
          want_merge
          after_merge
          gen_catchain_seqno
          flags
          want_merge
          prev_ref {
            root_hash
          }
          prev_key_block_seqno
          gen_validator_list_hash_short
          min_ref_mc_seqno
          value_flow {
            to_next_blk
            exported
            fees_collected
            created
            imported
            from_prev_blk
            minted
            fees_imported
          }
          version
          gen_software_version
          gen_software_capabilities
          rand_seed
          boc
        }
      }
    `
    });
    return response.data.blocks[0];
  }

  async getBlockIdBySequenceNumber(base_url, sequenceNumber, workchain_id) {
    if (workchain_id < -1) workchain_id = -1;
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        blocks(filter:{seq_no:{eq:${sequenceNumber}}, workchain_id: {eq: ${workchain_id}}}) {
          id
        }
      }
    `
    });
    return response.data.blocks[0].id;
  }

  async getValidatorData(base_url) {
    const validatorSets = await this.getValidatorSets(base_url);
    const p15 = validatorSets.p15;
    const p32 = validatorSets.p32;
    const p34 = validatorSets.p34;
    const p36 = validatorSets.p36;

    const electionStart = p34.utime_until - p15.elections_start_before;
    const electionEnd = p34.utime_until - p15.elections_end_before;
    const duration = electionEnd - electionStart;
    const now = parseInt(Date.now() / 1000);
    const electionStatus = (now > electionStart && now < electionEnd) ? "Open" : "Closed"

    const nextElectionsStart = p34.utime_until + p15.elections_start_before;
    const nextElectionsEnd = nextElectionsStart + duration;

    return {
      number_of_validators: p34.total,
      elections_start: electionStart,
      elections_end: electionEnd,
      next_elections_start: nextElectionsStart,
      next_elections_end: nextElectionsEnd,
      election_status: electionStatus,
      sets: {
        previous: p32,
        current: p34,
        next: p36
      }
    }
  }

  async getValidatorSets(base_url) {
    const { data: response } = await axios.post(base_url, {
      query: `
      {
        blocks(filter:{
          workchain_id:{
            eq:-1
          }
          key_block:{
            eq:true
          }

        }
          orderBy:{
            path:"seq_no"
            direction:DESC
          }
          limit: 1
        )
        {
          id
             master {
                config {
                  p15 {
                    validators_elected_for
                    elections_start_before
                    elections_end_before
                    stake_held_for
                  }
                  p32 {
                    utime_since
                    utime_until
                    total
                    total_weight
                    list {
                      public_key
                      adnl_addr
                      weight
                    }
                  }
                  p34 {
                    utime_since
                    utime_until
                    total
                    total_weight
                    list {
                      public_key
                      adnl_addr
                      weight
                    }
                  }
                  p36 {
                    utime_since
                    utime_until
                    total
                    total_weight
                    list {
                      public_key
                      adnl_addr
                      weight
                    }
                  }

                }
            }
        }
      }
    `
    });
    return response.data.blocks[0].master.config;
  }

  async getAggregateNodeSignedMasterchainBlocks(base_url, node_id) {
    const { data: response } = await axios.post(base_url, {
      operationName: "aggregateBlockSignatures",
      query: `query aggregateBlockSignatures($filter: BlockSignaturesFilter, $fields: [FieldAggregation]) {
        aggregateBlockSignatures(filter: $filter, fields: $fields)
      }`,
      variables: {
        filter: {
          signatures: {
            any: {
              node_id: {
                eq: node_id
              }
            }
          }
        }
      }
    });
    return response.data.aggregateBlockSignatures[0];
  }

  async getAggregateNodeTotalNumberMasterchainBlocks(base_url, node_id) {
    const { data: response } = await axios.post(base_url, {
      operationName: "aggregateBlockSignatures",
      query: `query aggregateBlockSignatures($filter: BlockSignaturesFilter, $fields: [FieldAggregation]) {
        aggregateBlockSignatures(filter: $filter, fields: $fields)
      }`,
      variables: {
        filter: {
          signatures: {
            any: {
              node_id: {
                eq: node_id
              }
            }
          }
        }
      }
    });
    return response.data.aggregateBlockSignatures[0];
  }

  async getNodeBlockSignatures(base_url, node_id) {
    const { data: response } = await axios.post(base_url, {
      operationName: "blocks_signatures",
      query: `query blocks_signatures($filter: BlockSignaturesFilter, $orderBy: [QueryOrderBy], $limit: Int, $timeout: Float) {
        blocks_signatures(filter: $filter, orderBy: $orderBy, limit: $limit, timeout: $timeout) {
          id
          gen_utime
          __typename
        }
      }`,
      variables: {
        filter: {
          signatures: {
            any: {
              node_id: {
                eq: node_id
              }
            }
          }
        },
        limit: 50,
        orderBy: [
          { direction: "DESC", path: "gen_utime" }
        ]
      }
    });
    return response.data.blocks_signatures;
  }

  async getBlocksBySignatures(base_url, signatures)
  {
    let signatureIds = [];
    signatures.forEach((item) => {
      signatureIds.push(item.id);
    });

    const { data: response } = await axios.post(base_url, {
      operationName: "blocks",
      query: `query blocks($filter: BlockFilter, $orderBy: [QueryOrderBy], $limit: Int, $timeout: Float) {
        blocks(filter: $filter, orderBy: $orderBy, limit: $limit, timeout: $timeout) {
          id
          seq_no
          workchain_id
          shard
          gen_utime
          tr_count
          __typename
        }
      }`,
      variables: {
        filter: {
          id: {
            in: signatureIds
          }
        }
      }
    });

    return response.data.blocks;
  }

  async getValidatorInfo(base_url, validator_public_hash) {
    let info;

    const validatorSets = await this.getValidatorSets(base_url);
    const p32 = validatorSets.p32;
    const p34 = validatorSets.p34;
    const p36 = validatorSets.p36;

    let config = null;
    let generalValidatorInfo = null;

    if(p32 != null)
    {
      p32.list.forEach((validatorInSet) => {
        if(validatorInSet.public_key == validator_public_hash) {
          config = p32;
          generalValidatorInfo = validatorInSet;
        }
      });
    }

    if(config == null && p34 != null) {
      p34.list.forEach((validatorInSet) => {
        if(validatorInSet.public_key == validator_public_hash) {
          config = p34;
          generalValidatorInfo = validatorInSet;
        }
      });
    }
    
    if(config == null && p36 != null) {
      p36.list.forEach((validatorInSet) => {
        if(validatorInSet.public_key == validator_public_hash) {
          config = p36;
          generalValidatorInfo = validatorInSet;
        }
      });
    }

    const node_id = this.validatorPublicKeyToNodeHex(validator_public_hash) 
    const blocks_signatures = await this.getNodeBlockSignatures(base_url, node_id);
    const blocks = await this.getBlocksBySignatures(base_url, blocks_signatures);

    info = {
      public_key_hex: validator_public_hash,
      adnl_address_hex: generalValidatorInfo.adnl_addr,
      node_id_hex: node_id,
      weight: generalValidatorInfo.weight,
      utime_since: config.utime_since,
      utime_until: config.utime_until,
      aggregate_signed_masterchain_blocks: await this.getAggregateNodeSignedMasterchainBlocks(base_url, node_id),
      aggregate_total_masterchain_blocks: await this.getAggregateNodeTotalNumberMasterchainBlocks(base_url, node_id),
      signed_masterchain_blocks: blocks
    }

    return info;
  }

  validatorPublicKeyToNodeHex(public_key) {
      const magicBytes = [0xc6, 0xb4, 0x13, 0x48];
      const keyArr = qFunctions.toByteArray(public_key);
      
      return CRYPTO.createHash("sha256")
                    .update(magicBytes)
                    .update(keyArr)
                    .digest("hex");
  }

  getReadableHash(public_key)
  {
    const hasher = new HumanHash();
    const parts = hasher.humanize(public_key, 3).split("-");
    
    let concat = "";
    parts.map((x) => {
      concat += x.charAt(0).toUpperCase() + x.slice(1) + " ";
    })

    return concat.trim();
  }

  async calculateValidatorScore(baseUrl, validator, now)
  {
    const info = await this.getValidatorInfo(baseUrl, validator.public_key);
    
    const since = info.utime_since;
    const uptime = now - since;
    
    const signaturesCount = info.aggregate_signed_masterchain_blocks;

    const score = (signaturesCount / uptime * 1000000);
    
    return {"node_id": info.node_id_hex, "score": Math.ceil(score.toFixed(2))};
  }
}