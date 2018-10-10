//表头定义
export function getThName(key) {
  var thNames = [];
  switch (key) {
    case 'shop':
      thNames = [
        {
          item: 'id',
          name: '门店ID',
          visible: true,
          width: '80',
          order: 1
        },
        {
          item: 'gmtCreate',
          name: '创建时间',
          visible: false,
          width: '180',
          order: 2
        },
        {
          item: 'gmtModify',
          name: '更新时间',
          visible: false,
          width: '180',
          order: 3
        },
        {
          item: 'name',
          name: '名称',
          visible: true,
          width: '180',
          order: 4
        },
        {
          item: 'isOpen',
          name: '是否营业',
          visible: true,
          width: '100',
          order: 5
        },
        {
          item: 'beginTime',
          name: '营业开始时间',
          visible: true,
          width: '130',
          order: 6
        },
        {
          item: 'endTime',
          name: '营业结束时间',
          visible: true,
          width: '130',
          order: 7
        },
        {
          item: 'openTimeBitmap',
          name: '营业时间bitmap',
          visible: false,
          width: '180',
          order: 8
        },
        {
          item: 'bookTimeBitmap',
          name: '预定时间bitmap',
          visible: false,
          width: '180',
          order: 9
        },
        {
          item: 'phone',
          name: '门店电话',
          visible: true,
          width: '130',
          order: 10
        },
        {
          item: 'deliverAmount',
          name: '起送价',
          visible: true,
          width: '80',
          order: 11
        },
        {
          item: 'isInvoice',
          name: '是否支持开发票',
          visible: true,
          width: '140',
          order: 12
        },
        {
          item: 'settledPlatform',
          name: '入驻平台',
          visible: true,
          width: '100',
          order: 13
        },
        {
          item: 'remark',
          name: '备注',
          visible: true,
          width: '180',
          order: 14
        }
      ]
      return tborder(thNames);
      break;
    default:
      return [];
  }
}
function tborder(arr) {
  var tmp = null;
  for (var i = arr.length - 1; i > 0; i--) {
    for (var j = 0; j < i; j++) {
      if (arr[j].order > arr[j + 1].order) {
        tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}
