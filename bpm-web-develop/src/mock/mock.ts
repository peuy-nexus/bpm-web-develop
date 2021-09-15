import Mock from "mockjs";

const Random = Mock.Random;
const baseUrl = process.env.VUE_APP_BASEURL;

/**
 * 使用mockjs进行拦截请求模拟数据，具体使用方法可至http://mockjs.com/进行查看
 */

/**
 * 获取基础单据列表
 */
const getList = function() {
  const resp: any = {};
  const list: any[] = [];
  for (let i = 0; i < 10; i++) {
    const item: any = {};
    item.appId = Random.string("number", 10);
    item.consignee = Random.string("number", 10);
    item.created = Random.string("number", 10);
    item.flowNo = Random.string("number", 10);
    item.memberInfo = Random.string("number", 10);
    item.realAmount = Random.string("number", 10);
    item.sysState = Random.string("number", 10);
    item.type = Random.string("number", 10);
    list.push(item);
  }
  resp.code = 200;
  resp.data = list;
  resp.fields = "你嘿嘿嘿嘿嘿";
  resp.more = true;
  resp.msg = "事实上事实上";
  resp.success = true;
  resp.total = Random.natural(60, 100);
  return resp;
};

const getPromChannels = function() {
  const resp: any = {};
  const list = [
    {
      uuid: "e997163b-fd9a-46e1-9696-fc49de51e9d1",
      code: "CYJ",
      name: "收银机",
    },
    {
      uuid: "e53c8b66-2ed0-4acf-9dc5-e2ebd11100b4",
      code: "XCX",
      name: "小程序",
    },
  ];
  resp.code = 200;
  resp.data = list;
  resp.fields = "你嘿嘿嘿嘿嘿";
  resp.more = true;
  resp.msg = "事实上事实上";
  resp.success = true;
  resp.total = Random.natural(60, 100);
  return resp;
};

/**
 * 获取商品列表
 */
const getSkuList = function() {
  const resp: any = {};
  const list: any[] = [];
  for (let i = 0; i < 10; i++) {
    const item: any = {};
    item.appId = "https://img.yzcdn.cn/vant/cat.jpeg";
    item.consignee = Random.string("number", 10);
    item.created = Random.string("number", 10);
    item.flowNo = Random.string("number", 10);
    item.memberInfo = Random.string("number", 10);
    item.realAmount = Random.string("number", 10);
    item.sysState = Random.string("number", 10);
    item.type = Random.string("number", 10);
    list.push(item);
  }
  resp.code = 200;
  resp.data = list;
  resp.fields = "你嘿嘿嘿嘿嘿";
  resp.more = true;
  resp.msg = "事实上事实上";
  resp.success = true;
  resp.total = Random.natural(60, 100);
  return resp;
};

/**
 * 获取规则列表
 */
const getRuleList = function() {
  const resp: any = {};
  const list: any[] = [];
  for (let i = 0; i < 10; i++) {
    const item: any = {};
    item.appId = "https://img.yzcdn.cn/vant/cat.jpeg";
    item.consignee = Random.string("number", 10);
    item.created = Random.string("number", 10);
    item.flowNo = Random.string("number", 10);
    item.memberInfo = Random.string("number", 10);
    item.realAmount = Random.string("number", 10);
    item.sysState = Random.string("number", 10);
    item.type = Random.string("number", 10);
    list.push(item);
  }
  resp.code = 200;
  resp.data = list;
  resp.fields = "你嘿嘿嘿嘿嘿";
  resp.more = true;
  resp.msg = "事实上事实上";
  resp.success = true;
  resp.total = Random.natural(60, 100);
  return resp;
};

/**
 * 获取商品分类列表
 */
const getCategoryList = function() {
  const resp: any = {};
  const list: any[] = [];
  for (let i = 0; i < 10; i++) {
    const item: any = {};
    item.appId = "https://img.yzcdn.cn/vant/cat.jpeg";
    item.label = Random.string("number", 10);
    item.children = [
      {
        label: Random.string("number", 10),
        children: [
          {
            label: Random.string("number", 10),
            children: [
              {
                label: Random.string("number", 10),
              },
              {
                label: Random.string("number", 10),
              },
              {
                label: Random.string("number", 10),
              },
            ],
          },
        ],
      },
      {
        label: Random.string("number", 10),
        children: [
          {
            label: Random.string("number", 10),
            children: [
              {
                label: Random.string("number", 10),
              },
            ],
          },
          {
            label: Random.string("number", 10),
            children: [
              {
                label: Random.string("number", 10),
              },
              {
                label: Random.string("number", 10),
              },
            ],
          },
        ],
      },
    ];
    list.push(item);
  }
  resp.code = 200;
  resp.data = list;
  resp.fields = "你嘿嘿嘿嘿嘿";
  resp.more = true;
  resp.msg = "事实上事实上";
  resp.success = true;
  resp.total = Random.natural(60, 100);
  return resp;
};
Mock.mock(/\/example\/getList/, getList);
Mock.mock(/\/example\/getSkuList/, getSkuList);
Mock.mock(/\/example\/getPromChannels/, getPromChannels);
// Mock.mock(/\/v1\/sop\/promotion\/rule\/query/, getRuleList);
Mock.mock(/\/v1\/category\/query/, getCategoryList);
