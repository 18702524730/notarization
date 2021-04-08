import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
var mock = new MockAdapter(axios);

console.log(mock)
//上传文件
mock.onPost('./EvidenceController/uploadData.do').reply(200, {
  "url":"http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png"
});

mock.onPost('http://localhost:8081/EvidenceController/uploadData.do').reply(200, {
  "url":"http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png"
});

// 价格类型
mock.onPost('./EvidenceController/findNotarizationSet.do').reply(200, {
  "code": "0",
  "data": [
    {
      "id": 1,
      "item": 1,
      "size": 10,
      "fee": 2.1,
      "year": 1,
      "createTime": "Apr 10, 2017 3:11:10 PM"
    },
    {
      "id": 2,
      "item": 2,
      "size": 10,
      "fee": 20,
      "year": 1,
      "createTime": "Apr 10, 2017 3:11:10 PM"
    }
  ]
}
);


//下载证书
mock.onPost('./EvidenceController/downEvidence.do').reply(200, {
  "code":"0"
});

//生成电子存证订单
mock.onPost('./EvidenceController/addAttestations.do').reply(200, {
  "code": "0",
  "data": {
    "id": 175,
    "clientType": 1,
    "name": "1",
    "mobile": "1",
    "email": "1",
    "identificationCard": "1",
    "identificationCardCorrect": "1",
    "identificationCardOppsite": "1",
    "source": 2,
    "notarizationType": 1,
    "memberId": 31,
    "orderSn": "00o270412100005",
    "updateTime": "Apr 12, 2017 1:47:33 PM",
    "createTime": "Apr 12, 2017 1:47:33 PM",
    "fileData": [
      "http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png"
    ],
    "notarizationFee": {
      "natorizationMainId": 175,
      "size": 1,
      "fee": 2,
      "orderSn": "00o270412100005",
      "paymentSn": "1491976053406",
      "createTime": "Apr 12, 2017 1:47:33 PM"
    }
  }
}
);

//查询主体列表
mock.onPost('./EvidenceController/findAllByApplyType.do').reply(200, {
  "code": "0",
  "data": [
    {
      "apply_id": 49,
      "member_id": 33,
      "apply_type": 1,
      "is_default": "0",
      "apply_name": "测试1",
      "apply_number": "2",
      "apply_phone": "13",
      "apply_email": "12@12.cn",
      "province_id": "15",
      "city_id": "226",
      "area_id": "2546",
      "area_info": "3",
      "zip_code": "2",
      "create_time": 1494380685000,
      "update_time": 1494381167000
    },
    {
      "apply_id": 50,
      "member_id": 33,
      "apply_type": 1,
      "is_default": "0",
      "apply_name": "测试2",
      "apply_number": "2",
      "apply_phone": "13",
      "apply_email": "12@12.cn",
      "province_id": "15",
      "city_id": "226",
      "area_id": "2546",
      "area_info": "3",
      "zip_code": "2",
      "create_time": 1494380685000,
      "update_time": 1494381167000
    },
    {
      "apply_id": 51,
      "member_id": 33,
      "apply_type": 1,
      "is_default": "0",
      "apply_name": "测试3",
      "apply_number": "2",
      "apply_phone": "13",
      "apply_email": "12@12.cn",
      "province_id": "15",
      "city_id": "226",
      "area_id": "2546",
      "area_info": "3",
      "zip_code": "2",
      "create_time": 1494380685000,
      "update_time": 1494381167000
    }
  ]
});

//支付成功回调
mock.onPost('./EvidenceController/addBaoQuan.do').reply(200, {
  "code":"0"
}
);

//查看订单详情
mock.onPost('./EvidenceController/findEvidenceByOrderSn.do').reply(200, {
  "code": "0",
  "data": {
    "id": 163,
    "clientType": 2,
    "name": "tom",
    "mobile": "18301375890",
    "email": "1",
    "identificationCard": "411522199503056019",
    "identificationCardCorrect": "1",
    "identificationCardOppsite": "1",
    "source": 1,
    "notarizationType": 1,
    "memberId": 33,
    "orderSn": "004270410100011",
    "updateTime": "Apr 10, 2017 4:50:38 PM",
    "createTime": "Apr 10, 2017 4:50:38 PM",
    "notarizationRefList": [
      {
        "id": 168,
        "notarizationMainId": 163,
        "url": "http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png",
        "fileId": "E19B4F23D27343A0A12E456D230D74EE",
        "createTime": "Apr 10, 2017 4:50:38 PM"
      }
    ],
    "notarizationFee": {
      "id": 115,
      "natorizationMainId": 163,
      "size": 1,
      "fee": 10,
      "orderSn": "004270410100011",
      "paymentSn": "1491814238344",
      "payStatus": 0,
      "createTime": "Apr 10, 2017 4:50:38 PM"
    }
  }
});


// 用户订单列表
mock.onPost('./EvidenceController/findAttestations.do').reply(200, {
  "code": "0",
  "data": [
    {
      "id": 121,
      "clientType": 2,
      "name": "tom",
      "mobile": "18301375890",
      "email": "1",
      "identificationCard": "411522199503056019",
      "identificationCardCorrect": "1",
      "identificationCardOppsite": "1",
      "notarizationType": 1,
      "memberId": 33,
      "czyUserId": 4950542,
      "finishTime": "Apr 10, 2017 3:43:02 PM",
      "orderSn": "000b70410100000",
      "czurlCookie": "123",
      "czh": "123",
      "updateTime": "Apr 10, 2017 3:33:41 PM",
      "createTime": "Apr 10, 2017 3:33:45 PM",
      "notarizationRefList": [
        {
          "id": 126,
          "notarizationMainId": 121,
          "url": "http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png",
          "fileId": "asdasda",
          "updateTime": "Apr 10, 2017 3:45:24 PM",
          "createTime": "Apr 10, 2017 3:11:10 PM"
        }
      ]
    },
    {
      "id": 122,
      "clientType": 2,
      "name": "tom",
      "mobile": "18301375890",
      "email": "1",
      "identificationCard": "411522199503056019",
      "identificationCardCorrect": "1",
      "identificationCardOppsite": "1",
      "notarizationType": 1,
      "memberId": 33,
      "orderSn": "000b70410100001",
      "updateTime": "Apr 10, 2017 3:33:41 PM",
      "createTime": "Apr 10, 2017 3:33:41 PM",
      "notarizationRefList": [
        {
          "id": 127,
          "notarizationMainId": 122,
          "url": "http://sebe360test.oss-cn-beijing.aliyuncs.com/14C6DE9E2B5C8BA7B60D3FDC3FE06D48.png",
          "createTime": "Apr 10, 2017 3:11:54 PM"
        }
      ]
    }
  ]
});

// 省市区
mock.onPost('./EvidenceController/areas.do').reply(200, {
  "is_first": true,
  "is_last": true,
  "has_previous": false,
  "has_next": false,
  "index": 0,
  "size": 9999,
  "total_pages": 1,
  "total_elements": 17,
  "elements": [
    {
      "area_id": 37,
      "name": "浙江省",
      "sort": 0,
      "deep": 3,
      "parent": null,
      "childs": null,
      "create_time": 1445235949000,
      "update_time": 1445235949000
    },
    {
      "area_id": 37,
      "name": "杭州",
      "sort": 0,
      "deep": 3,
      "parent": null,
      "childs": null,
      "create_time": 1445235949000,
      "update_time": 1445235949000
    },
    {
      "area_id": 37,
      "name": "西湖区",
      "sort": 0,
      "deep": 3,
      "parent": null,
      "childs": null,
      "create_time": 1445235949000,
      "update_time": 1445235949000
    }

  ]
});


// 申请出证
mock.onPost('./cunnar/applyCunnar.do').reply(200, {
    "code": "0",
    "desc": null,
    "data": true
});


// 支付数据
mock.onPost('./publicinterface/topay.do').reply(200, {
  "msg": "请前台组装Channel，再发起支付请求!",
  "code": "success",
  "data": {
      "order_sn": "000b70410100000",//订单编号
      "payment_sn": "1491808270348",//支付单号
      "channel": "channel",//渠道
      "client_ip": "192.168.1.150",//客户端IP
      "subject": "存证订单",
      "body": "存证订单描述",
      "success_url": "中心平台回调存证前台url地址",
      "timestamp": "1492052062409",//时间戳
      "sign": "be38dc134c75f65737e0329b6121b428",//签名
      "standardPrice": "0.00",//标准价格
      "depositPrice": "0",//定金价格
      "preferentialPrice": "0",
      "payMoney": "0.00",//应付价格
      "createTime": "2017-04-10 15:11:10",
      "payTime": "2017-04-13 10:54:22",
      "paymentsList": [
          {
              "payment_id": 2,
              "code": "alipay_pc_direct",
              "name": "支付宝",
              "config": "",
              "state": 1,
              "create_time": 1472659200000,
              "update_time": 1489568777000
          },
          {
              "payment_id": 3,
              "code": "wx_pub_qr",
              "name": "微信",
              "config": "",
              "state": 1,
              "create_time": 1472659200000,
              "update_time": 1489568785000
          },
          {
              "payment_id": 4,
              "code": "upacp_pc",
              "name": "银联",
              "config": "",
              "state": 1,
              "create_time": 1472659200000,
              "update_time": 1484791537000
          }
      ]
  }
});

