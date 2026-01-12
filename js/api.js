/**
 * Nano Banana Pro API 封装
 * API 文档: https://kie.ai
 */

/**
 * 创建图像生成任务
 * @param {string} prompt - 图像生成提示词
 * @param {Object} options - 可选参数
 * @param {string} options.aspectRatio - 宽高比 (默认: '3:4')
 * @param {string} options.resolution - 分辨率 (默认: '2K')
 * @param {string} options.outputFormat - 输出格式 (默认: 'png')
 * @returns {Promise<{taskId: string}>} 返回任务 ID
 */
async function createTask(prompt, options = {}) {
  const {
    aspectRatio = CONFIG.IMAGE_CONFIG.aspectRatio,
    resolution = CONFIG.IMAGE_CONFIG.resolution,
    outputFormat = CONFIG.IMAGE_CONFIG.outputFormat
  } = options;

  const requestBody = {
    model: 'nano-banana-pro',
    input: {
      prompt: prompt,
      aspect_ratio: aspectRatio,
      resolution: resolution,
      output_format: outputFormat
    }
  };

  try {
    const response = await fetch(`${CONFIG.API_BASE}/jobs/createTask`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.code === 200) {
      return { taskId: data.data.taskId };
    } else {
      throw new Error(`创建任务失败: ${data.msg}`);
    }
  } catch (error) {
    if (error.message.includes('401') || error.message.includes('Authentication')) {
      throw new Error('API Key 认证失败，请检查 config.js 中的 API_KEY 是否正确');
    }
    throw error;
  }
}

/**
 * 查询任务状态
 * @param {string} taskId - 任务 ID
 * @returns {Promise<{state: string, resultUrls?: string[]}>} 返回任务状态和结果
 */
async function getTaskStatus(taskId) {
  const response = await fetch(`${CONFIG.API_BASE}/jobs/recordInfo?taskId=${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.API_KEY}`
    }
  });

  const data = await response.json();

  if (data.code === 200) {
    const taskData = data.data;
    const result = {
      state: taskData.state,
      failCode: taskData.failCode,
      failMsg: taskData.failMsg
    };

    // 如果任务成功，解析结果
    if (taskData.state === 'success' && taskData.resultJson) {
      const resultData = JSON.parse(taskData.resultJson);
      result.resultUrls = resultData.resultUrls || [];
    }

    return result;
  } else {
    throw new Error(`查询任务失败: ${data.msg}`);
  }
}

/**
 * 轮询任务状态直到完成
 * @param {string} taskId - 任务 ID
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise<string[]>} 返回图片 URL 列表
 */
async function pollTaskStatus(taskId, onProgress = null) {
  const { interval, maxAttempts } = CONFIG.POLL_CONFIG;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      attempts++;

      try {
        const result = await getTaskStatus(taskId);

        if (onProgress) {
          onProgress({ attempts, state: result.state });
        }

        if (result.state === 'success') {
          resolve(result.resultUrls);
        } else if (result.state === 'fail') {
          reject(new Error(result.failMsg || '图像生成失败'));
        } else {
          // 继续轮询
          if (attempts < maxAttempts) {
            setTimeout(poll, interval);
          } else {
            reject(new Error('请求超时，请稍后重试'));
          }
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

/**
 * 生成儿童识字小报（一站式函数）
 * @param {string} prompt - 图像生成提示词
 * @param {Object} options - 可选参数
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise<string[]>} 返回图片 URL 列表
 */
async function generateImage(prompt, options = {}, onProgress = null) {
  // 第一步：创建任务
  if (onProgress) onProgress({ step: 'creating', message: '正在创建生成任务...' });

  const { taskId } = await createTask(prompt, options);

  if (onProgress) onProgress({ step: 'polling', message: '任务已创建，正在生成图像...' });

  // 第二步：轮询等待结果
  const resultUrls = await pollTaskStatus(taskId, onProgress);

  if (onProgress) onProgress({ step: 'completed', message: '生成完成！' });

  return resultUrls;
}
