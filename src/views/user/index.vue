<template>
  <div class="app-container">
    <div class="main-form-header">
      <el-form>
        <el-row :gutter="40">
          <el-col :md="4" :sm="24">
            <el-form-item label="用户ID" label-width="60px">
              <el-input v-model="form.invitee_account" placeholder="请录入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="24">
            <el-form-item label="邀请方式" label-width="70px">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="邀请时间" label-width="70px">
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
            <el-button type="primary" @click="getUserList"><svg-icon icon-class="search"/> 查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column align="center" prop="account" label="合伙人ID"></el-table-column>
      <el-table-column align="center" prop="name" label="合伙人名称"></el-table-column>
      <el-table-column align="center" prop="account_flag" label="合伙人级别">
        <template slot-scope="scope">{{ level(scope.row.account_flag) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="invitee_account" label="用户ID"></el-table-column>
      <el-table-column align="center" prop="updated_uuid" label="邀请方式">
        <template slot-scope="scope">{{ scope.row.updated_uuid == "" ? "注册邀请" : "人工邀请" }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="邀请时间">
        <template slot-scope="scope">
          {{ $moment(scope.row.created_at).format("YYYY-MM-DD") }}
          <!-- {{scope.row.created_at}} -->
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
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      />
    </el-row>

  </div>
</template>

<script>
import { userTable } from '@/api/user'
import Pagination from '@/components/Pagination'
import { inviteeUsers } from '../../api/user'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      form: {
        invitee_account: '',
        type: '',
        between: ''
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '注册邀请'
        },
        {
          value: 2,
          label: '人工调整'
        }
      ],
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      listLoading: true
    }
  },
  methods: {
    level(value) {
      switch (value) {
        case 1:
          return '黄金'
        case 2:
          return '白金'
        case 3:
          return '钻石'
        case 4:
          return '王者'
      }
    },

    getUserList() {
      this.listLoading = true
      console.log(111, this.form.between)
      const params = Object.assign({
        uuid: this.form.invitee_account,
        between:
          this.form.between == null
            ? ''
            : `created_at~${this.form.between[0]} 00:00:00~${this.form.between[1]} 23:59:59`,
        type: this.form.type,
        page: this.page,
        size: this.size
      })
      inviteeUsers(params)
        .then(response => {
          console.log('结果' + JSON.stringify(response))
          if (response.data.record != null) {
            this.tableData = response.data.record
          } else {
            const arr = []
            arr.push(response.data)
            this.tableData = arr
          }
          console.log(this.tableData)
          this.page = response.data.page
          this.size = response.data.size
          this.total = response.data.total

          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
          reject(false)
        })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleClick() {
      var query = {
        page: this.page,
        size: this.size,
        uuid: this.invitee_account,
        between: this.between
      }
      userTable()
        .then(response => {
          console.log('结果' + response)
        })
        .catch(err => {
          console.log(err)
          reject(false)
        })
    },

    handleSizeChange(val) {
      this.size = val
      this.getUserList()
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUserList()
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

    this.getUserList()
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
