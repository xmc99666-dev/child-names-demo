/**
 * 儿童识字小报生成器 - 配置文件
 *
 * 使用说明：
 * 1. 访问 https://kie.ai/api-key 获取你的 API Key
 * 2. 将 API Key 填入下面的 CONFIG.API_KEY 中
 * 3. 保存此文件后即可使用
 */

const CONFIG = {
  // API Key - 请替换为你自己的 Key
  API_KEY: 'YOUR_API_KEY',

  // API 基础地址
  API_BASE: 'https://api.kie.ai/api/v1',

  // 图片生成配置
  IMAGE_CONFIG: {
    aspectRatio: '3:4',   // 竖版 A4 比例
    resolution: '2K',     // 分辨率
    outputFormat: 'png'   // 输出格式
  },

  // 轮询配置
  POLL_CONFIG: {
    interval: 2000,       // 轮询间隔（毫秒）
    maxAttempts: 60       // 最大轮询次数（2分钟超时）
  }
};
