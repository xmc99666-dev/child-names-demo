/**
 * 预设场景模板
 * 包含 4 个常见场景的词汇配置
 */

const TEMPLATES = {
  // 超市场景
  supermarket: {
    name: '超市',
    title: '走进超市',
    vocabulary: {
      // 核心角色与设施
      core: [
        'shōu yín yuán 收银员',
        'huò jià 货架',
        'shōu yín tái 收银台',
        'tuī chē 推车',
        'gòu wù lán 购物篮'
      ],
      // 常见物品
      items: [
        'píng guǒ 苹果',
        'xiāng jiāo 香蕉',
        'niú nǎi 牛奶',
        'miàn bāo 面包',
        'qiāo kè lì 巧克力',
        'yá gāo 牙膏',
        'shā fā 沙发',
        'huǒ chái 火柴'
      ],
      // 环境与装饰
      env: [
        'chū kǒu 出口',
        'rù kǒu 入口',
        'dēng 灯',
        'qiáng 墙',
        'bāo zhuāng 包装'
      ]
    }
  },

  // 医院场景
  hospital: {
    name: '医院',
    title: '快乐医院',
    vocabulary: {
      core: [
        'yī shēng 医生',
        'hù shì 护士',
        'bing chuáng 病床',
        'zhěn suǒ 诊所',
        'yào fáng 药房'
      ],
      items: [
        'tīng zhěn qì 听诊器',
        'yào 药',
        'wēn dù jì 温度计',
        'zhēn tou 针头',
        'mián qiá 棉签',
        'kǒu zhào 口罩',
        'bēng dài 绷带',
        'yī liáo yī liao 医疗椅'
      ],
      env: [
        'jiě shì tái 接待台',
        'dēng 灯',
        'mén 门',
        'chuāng 窗',
        'zhǐ shì pái 指示牌'
      ]
    }
  },

  // 公园场景
  park: {
    name: '公园',
    title: '美丽公园',
    vocabulary: {
      core: [
        'huá tǐ 滑梯',
        'qiū qiān 秋千',
        'qiáo 桥',
        'pēn quán 喷泉',
        'cháng yǐ 长椅'
      ],
      items: [
        'huā 花',
        'cǎo 草',
        'shù 树',
        'niǎo 鸟',
        'hú dié 蝴蝶',
        'qiú 球',
        'fēng zhēng 风筝',
        'zi xíng chē 自行车'
      ],
      env: [
        'lù 路',
        'shuǐ 水',
        'tiān 天空',
        'yún 云',
        'tài yáng 太阳'
      ]
    }
  },

  // 学校场景
  school: {
    name: '学校',
    title: '快乐校园',
    vocabulary: {
      core: [
        'lǎo shī 老师',
        'xué sheng 学生',
        'hēi bǎn 黑板',
        'jiǎng tái 讲台',
        'kè zhuō 课桌'
      ],
      items: [
        'shū 书',
        'qiān bǐ 铅笔',
        'xiàng pí 橡皮',
        'chǐ 尺',
        'wén jù hé 文具盒',
        'shū bāo 书包',
        'zuò yè běn 作业本',
        'tú huǐ 图绘'
      ],
      env: [
        'jiào shì 教室',
        'mén 门',
        'chuāng 窗',
        'dēng 灯',
        'qiáng bì 墙壁'
      ]
    }
  }
};

/**
 * 获取所有模板列表
 * @returns {Array} 模板列表
 */
function getTemplateList() {
  return Object.keys(TEMPLATES).map(key => ({
    key: key,
    name: TEMPLATES[key].name,
    title: TEMPLATES[key].title
  }));
}

/**
 * 根据 key 获取模板
 * @param {string} key - 模板 key
 * @returns {Object|null} 模板对象
 */
function getTemplate(key) {
  return TEMPLATES[key] || null;
}
