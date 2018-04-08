<template>
  <div ref="zsTable" class="zs-table">
    <colgroup>
      <col v-for="(item,index) in columnModel" :name="'zs-table-column_'+index" :width="item.width">
    </colgroup>
    <div class="zs-table-header-wrapper">
      <table class="zs-table-header">
        <tr>
          <th v-for="item in columnModel" :width="item.width">{{item.label}}</th>
        </tr>
      </table>
    </div>
    <div class="zs-table-body-wrapper">
      <table class="zs-table-body">
        <tr v-for="rowData in dataList">
          <td v-for="item in columnModel" :width="item.width" @click="item.click?item.click(rowData[item.name]):''">
            {{ item.formatter?item.formatter(rowData[item.name]):rowData[item.name]}}
          </td>
        </tr>
      </table>
    </div>
    <div class="zs-table-footer-wrapper">
      <div v-if="total!=0" class="zs-table-pagination">
        <span class="zs-table-pagination-total">共<em>{{toalPage}}</em>页 共<em>{{total}}</em>条记录</span>
        <select class="zs-table-pagination-select"  v-model="size" @change="setPageSize()"><option v-for="item of sizeArr" :value="item">{{item}}</option></select>
        <a href="javascript:void(0);" v-show="current != 1"  @click="setCurrent(1)">首页</a>
        <a href="javascript:void(0);" :disabled="current == 1"  @click="setCurrent(current - 1)">上一页</a>
        <template  v-for="p in groupList">
            <template v-if="p.val&&p.val==current">
              <span :class="{'active': current == p.val}"><em class="page-em"></em><em>{{p.text}}</em></span>
            </template>
            <template v-else-if="p.val">
               <a  href="javascript:void(0);" @click="setCurrent(p.val)">{{p.text}}</a>
            </template>
            <template v-else>
              <span>{{p.text}}</span>
            </template>
        </template >
        <a href="javascript:void(0);"  :disabled="current == toalPage"   @click="setCurrent(current + 1)">下一页</a>
        <a href="javascript:void(0);"  v-show="current != toalPage"  @click="setCurrent(toalPage)">尾页</a>
      </div>
      <div style="clear:both;"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "zs-table",
    mounted() {
      var that = this;
      this.$nextTick(() => {
        this.calColumnWidth();
      })
    },
    data() {
      return {
        size:this.pageSize,
        current: 1   // 当前的页数
      }
    },
    props: {
      dataList: {
        type: Array,
        default: function() {
          return [];
        }
      },
      columnModel: {
        type: Array,
        default: function() {
          return [];
        }
      },
      sizeArr: {// 数据总条数
        type: Array,
        default: function() {
          return [10,15,20,30];
        }
      },
      total: {// 数据总条数
        type: Number,
        default: 0
      },
      pageSize: {// 每页显示条数
        type: Number,
        default: 10
      },
      currentPage: {// 当前页码
        type: Number,
        default: 1
      }
    },
    methods: {
      setPageSize(){
        this.current = 1;
        this.$emit('pageChange',{"page": this.current,"pageSize":this.size});
      },
      setCurrent (page) {
        if (this.current != page && page > 0 && page < this.toalPage + 1) {
          this.current = page;
          this.$emit('pageChange',{"page": this.current,"pageSize":this.size});
        }
      },
      calColumnWidth() {
        var tableWidth = this.$refs.zsTable.offsetWidth;
        var settingWidth = 0;
        var len = this.columnModel.length;
        for (var i = 0; i < len; i++) {
          var column = this.columnModel[i];
          var width = column.width || 80;
          if (typeof width == 'string' && width.indexOf('%') > 0) {
            width = Math.round(tableWidth * parseInt(width.substring(0, width.length - 1)) / 100);
            column.width = width;
          }
          this.$set(column, "width", width);
          settingWidth += width;
        }
        if (settingWidth != tableWidth) {
          var width = this.columnModel[len - 1].width;
          this.columnModel[len - 1].width = width + (tableWidth - settingWidth);
        }
      }
    },
    computed: {
      toalPage() { // 总页数
        return Math.ceil(this.total / this.size);
      },
      groupList () { // 获取分页页码
        var len = this.toalPage, list = new Array();
        if (len <= 8) {
          for (var i = 1; i <= len; i++) {
            list.push({text: i, val: i});
          }
        } else {
            if (this.current <= 5) {
              for (var i = 1; i <= 7; i++) {
                list.push({text: i, val: i});
              }
              list.push({text: "..."})
            } else {
                list.push({text: 1, val: 1}, {text: 2, val: 2}, {text: "..."});
                var begin = this.current - 2;
                var end = this.current + 2;
                if (end >len) {
                    end = len;
                    begin = end - 4;
                    if (this.current - begin < 2) {
                      begin = begin - 1;
                    }
                } else if (end + 1 == len) {
                   end =len;
                }
                for (var i = begin; i <= end; i++) {
                  list.push({text: i, val: i});
                }
                if (end != len) {
                  list.push({text: "..."});
                }
            }
        }
        return list;
      }
    }
  }
</script>

<style lang="scss"  scoped>
  .zs-table table{
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    background-color: #fff;
  }

  .zs-table-header-wrapper{
    .zs-table-header{
        tr{
          background-color: #f2f2f2;
          transition: all .3s;
          -webkit-transition: all .3s;
          th{
            text-align: center;
            word-break: break-all;
            padding: 9px 5px;
            min-height: 20px;
            line-height: 20px;
            border: 1px solid #e2e2e2;
            border-bottom: none;
            font-size: 14px;
          }
        }
    }
  }
  .zs-table-body-wrapper {
    .zs-table-body {
      tr {
        transition: all .3s;
        -webkit-transition: all .3s;
        &:hover{
          background-color: #f8f8f8;
        }
        td {
          word-break: break-all;
          padding: 9px 5px;
          min-height: 20px;
          line-height: 20px;
          border: 1px solid #e2e2e2;
          font-size: 14px;
        }
      }
    }
  }
  .zs-table-footer-wrapper{
    width: 100%;
    text-align: right;
    .zs-table-pagination{
      display: inline-block;
      vertical-align: middle;
      margin: 10px 0;
      font-size: 0;
      -webkit-box-sizing: content-box!important;
      -moz-box-sizing: content-box!important;
      box-sizing: content-box!important;
      a,span{
        display: inline-block;
        vertical-align: middle;
        padding: 0 15px;
        border: 1px solid #e2e2e2;
        height: 28px;
        line-height: 28px;
        margin: 0 -1px 5px 0;
        background-color: #fff;
        color: #333;
        font-size: 12px;
      }
      .zs-table-pagination-total {
        height: 30px;
        line-height: 30px;
        margin-left: 1px;
        border: none;
        font-weight: 400;
        em {
          font-style: normal;
        }
      }

      .zs-table-pagination-select {
        display: inline-block !important;
        height: 30px;
        line-height: 30px;
        border: 1px solid #e2e2e2;
        font-size: 14px;
        color: #333;
        border-radius: 3px;
        padding: 0 5px;
        margin-right: 5px;
        box-sizing: border-box !important;
        position: relative;
        top: 3px;
      }

      a{
        text-decoration: none;
      }
      .active{
        position: relative;
        .page-em{
          position: absolute;
          left: -1px;
          top: -1px;
          padding: 1px;
          width: 100%;
          height: 100%;
          background-color: #009688;
        }
        em{
          position: relative;
          color: #fff;
          font-weight: 400;
          font-style: normal;
        }
      }
      span{
          color: #999;
          font-weight: 700;
      }
    }
  }
</style>
