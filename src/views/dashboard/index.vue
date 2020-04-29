<template>
  <div class="app-container">
      <el-table
    :data="inviteeInfoTable"
    border
    style="width: 100%"
v-loading="inviteeInfoLoading">
    <el-table-column
    align="center"
      prop="uuid"
      label="合伙人ID"
    >
    </el-table-column>
    <el-table-column
    align="center"
      prop="name"
      label="合伙人名称"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="bounty_id"
      label="合伙人级别">
           <template slot-scope="scope">
          {{ level(scope.row.bounty_id) }}
        </template>
    </el-table-column>
       <el-table-column
       align="center"
      prop="bounty_number"
      label="佣金比例">
        <template slot-scope="scope">
          {{ (scope.row.bounty_number *100).toFixed(2)+'%'}}
        </template>
    </el-table-column>
       <el-table-column
       align="center"
      prop="invitee_count"
      label="邀请总人数">
    </el-table-column>
       <el-table-column
       align="center"
      prop="invitee_yesterday_completed"
      label="昨日邀请人数">
    </el-table-column>
       <el-table-column
       align="center"
      prop="invitee_contract_count"
      label="开通合约总人数">
    </el-table-column>
       <el-table-column
       align="center"
      prop="invitee_yesterday_contract_count"
      label="昨日开通合约人数">
    </el-table-column>
  </el-table>

    <div style="height:40px"></div>
        <div>
      <el-form>
        <el-row type="flex">
          <el-col :md="4" :sm="24">
            <el-form-item label="交易币种" label-width="80px">
                 <el-input v-model="form.currency" placeholder="请录入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1">
          <el-form-item>
            <el-button type="primary" style="marginLeft: 20px" @click="getCommission"><svg-icon icon-class="search"/> 查询</el-button>
          </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <el-table
    :data="commissionTable"
    border
    style="width: 100%"
    v-loading="commissionLoading"
    >
    <el-table-column
    align="center"
      prop="total_commission"
      label="交易总额"
     >
       <template slot-scope="scope">
          {{ (scope.row.total_commission).toFixed(2)}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="last_week_commission"
      label="上周交易额"
      >
       <template slot-scope="scope">
          {{ (scope.row.last_week_commission).toFixed(2)}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="this_week_commission"
      label="本周交易额">
       <template slot-scope="scope">
          {{ (scope.row.this_week_commission).toFixed(2)}}
        </template>
    </el-table-column>
       <el-table-column
       align="center"
      prop="yesterday_commission"
      label="昨日交易额">
       <template slot-scope="scope">
          {{ (scope.row.yesterday_commission).toFixed(2)}}
        </template>
    </el-table-column>
       <!-- <el-table-column
       align="center"
      prop="total_number"
      label="总交易人数">
    </el-table-column> -->
       <el-table-column
       align="center"
      prop="trade_number"
      label="昨日交易人数">
    </el-table-column>
  </el-table>

   <div style="height:40px"></div>
      <el-table
    :data="commissionTable"
    border
    style="width: 100%"
    v-loading="commissionLoading"
    >
    <el-table-column
    align="center"
      prop="total_in_come"
      label="总收入"
     >
       <template slot-scope="scope">
          {{ (scope.row.total_in_come).toFixed(2)}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="last_week_in_come"
      label="上周收入"
    >
      <template slot-scope="scope">
          {{ (scope.row.last_week_in_come).toFixed(2)}}
        </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="this_week_in_come"
      label="本周收入">
        <template slot-scope="scope">
          {{ (scope.row.this_week_in_come).toFixed(2)}}
        </template>
    </el-table-column>
       <el-table-column
       align="center"
      prop="yesterday_in_come"
      label="昨日收入">
        <template slot-scope="scope">
          {{ (scope.row.yesterday_in_come).toFixed(2)}}
        </template>
    </el-table-column>
  </el-table>
    <p class="title">
      注：每天09点更新上一天的数据(8点-8点的) (UTC+8)
    </p>
  </div>
</template>

<script>
import { inviteeInfoTable, commissionTable } from '@/api/dashboard'

export default {
  name: 'Dashboard',

  data() {
    return {
      form: {
        currency: 'USDT'
      },
      tableLoading: true,
      inviteeInfoTable: [],
      inviteeInfoLoading: true,
      commissionTable: [],
      commissionLoading: true
    }
  },
  computed: {

  },
  methods: {
    level(value) {
      switch (value) {
        case 1:
          return "黄金";
        case 2:
          return "白金";
        case 3:
          return "钻石";
        case 4:
          return "王者";
      }
    },

    getInviteeInfo() {
      inviteeInfoTable().then(response => {
        setTimeout(() => {
          this.inviteeInfoLoading = false
        }, 1.5 * 1000)
        var arr = [];
    response.data == null || arr.push(response.data)
        this.inviteeInfoTable = arr
      }).catch(err => {
        console.log(err)
        reject(false)
      })
    },

    getCommission() {
      const params = {
        currency:this.form.currency
      }
      this.commissionLoading = true
      commissionTable(params).then(response => {
        setTimeout(() => {
          this.commissionLoading = false
        }, 1.5 * 1000)

     var arr = [];
     response.data == null || arr.push(response.data)
      this.commissionTable = arr;

      }).catch(err => {
        console.log(err)
        reject(false)
      })
    }
  },
  created() {
    this.getInviteeInfo()
    this.getCommission()
  }
}
</script>
<style lang="scss" scoped>
.title{
  font-size: 14px;
  color: #606266;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
</style>
