<template>
  <div class="app-container">
    <div class="main-form-header">
      <el-form>
        <el-row :gutter="40">
          <el-col :md="4" :sm="24">
            <el-form-item label="币种" label-width="40px">
             <el-input v-model="form.currency" placeholder="请录入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="8" :sm="24" >
            <el-form-item label="时间" label-width="40px">
              <el-date-picker
                v-model="form.between"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-button type="primary" @click="getCommissionDetail"><svg-icon icon-class="search"/> 查询</el-button>
            <el-button type="primary" @click="dialogFormVisible = true"> 修改</el-button>
            <el-button type="primary" @click="exPort"><svg-icon icon-class="excel"/> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%"  v-loading="commissionDetailLoading">
      <el-table-column align="center" prop="currency" label="币种"></el-table-column>
      <el-table-column align="center" prop="uuid" label="合伙人ID"></el-table-column>
      <el-table-column align="center" prop="node_name" label="合伙人名称"></el-table-column>
      <el-table-column align="center" prop="bounty" label="合伙人级别">
      </el-table-column>
      <el-table-column align="center" prop="commission_ratio" label="佣金比例">
        <template slot-scope="scope">
       {{(scope.row.commission_ratio *100).toFixed(2)+'%'}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deserve_commission" label="应得佣金">
        <template slot-scope="scope">
       {{(scope.row.deserve_commission).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="commission_total" label="总佣金">
         <template slot-scope="scope">
       {{(scope.row.commission_total).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="gap_income" label="点差收入">
         <template slot-scope="scope">
       {{(scope.row.gap_income).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fee_income" label="手续费收入">
         <template slot-scope="scope">
       {{(scope.row.fee_income).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deficit_position_risk_amount" label="风险金收入">
         <template slot-scope="scope">
       {{(scope.row.deficit_position_risk_amount).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="trade_amount_total" label="交易总额">
         <template slot-scope="scope">
       {{(scope.row.trade_amount_total).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="date" label="时间">
        <template slot-scope="scope">
        {{$moment(scope.row.date).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="marginTop:20px">
      <el-pagination
        v-show="total > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      />
    </el-row>
    <!-- 弹窗 -->
 <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <el-form :model="dialogForm">
    <el-form-item label="活动名称" :label-width="40">
       <el-col :span="12">
      <el-input v-model="dialogForm.name"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="活动区域" :label-width="formLabelWidth">
      <el-select v-model="dialogForm.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="revise">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { commissionDetails, commissionTable, exportCommission } from '../../api/commission'

export default {
  name: 'Commission',
  components: { Pagination },
  data() {
    return {
      form: {
        currency: 'USDT',
        between: ''
      },
      dialogForm:{
        name:"",
        region:""
      },
      tableData: [],
      commissionDetailLoading: false,
      uuid: '',
      page: 1,
      size: 10,
      total: 0,
      dialogFormVisible: false,
    }
  },
  methods: {
   revise(){
   const params = {

   }
    this.dialogFormVisible = false
   },
    exPort() {
      this.commissionDetailLoading = true
      const params = Object.assign({
        between: `update_at~${this.form.between[0]} 00:00:00~${this.form.between[1]} 23:59:59`,
        currency: this.form.currency
      })
      exportCommission(params).then(response => {
        console.log(response)
        const blob = new Blob([response])
        const fileName = '佣金明细表.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
        setTimeout(() => {
          this.commissionDetailLoading = false
        }, 1.5 * 1000)
        console.log(response)
      }).catch(err => {
        console.log(err)
        reject(false)
      })
    },

    getCommissionDetail() {
      this.commissionDetailLoading = true
      const params = Object.assign({
        between: `created_at~${this.form.between[0]} 00:00:00~${this.form.between[1]} 23:59:59`,
        currency: this.form.currency,
        page: this.page,
        size: this.size
      }, params)
      commissionDetails(params).then(response => {
        setTimeout(() => {
          this.commissionDetailLoading = false
        }, 1.5 * 1000)

        this.tableData = response.data.record
        this.page = response.data.page
        this.size = response.data.size
        this.total = response.data.total
      }).catch(err => {
        console.log(err)
        reject(false)
      })
    },

    handleSizeChange(val) {
      this.size = val
      this.getCommissionDetail()
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getCommissionDetail()
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },

    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    }

  },
  computed: {},
  created() {
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.form.between = [this.formatDate(start), this.formatDate(new Date())]

    this.getCommissionDetail()
  }
}
</script>
<style lang="scss" scoped>
.home {
  background-color: white;
}
.btn {
  text-align: right;
}
</style>
