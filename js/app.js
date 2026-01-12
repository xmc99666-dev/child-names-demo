/**
 * 儿童识字小报生成器 - 主应用逻辑
 */

// 应用状态
const appState = {
  selectedTemplate: null,
  currentImageUrls: [],
  apiKey: null
};

// LocalStorage key
const STORAGE_KEY = 'nano_banana_api_key';

/**
 * 从 localStorage 加载 API Key
 */
function loadApiKey() {
  const savedKey = localStorage.getItem(STORAGE_KEY);
  if (savedKey) {
    appState.apiKey = savedKey;
    // 更新全局 CONFIG
    CONFIG.API_KEY = savedKey;
  }
  return savedKey || null;
}

/**
 * 保存 API Key 到 localStorage
 */
function saveApiKey(apiKey) {
  localStorage.setItem(STORAGE_KEY, apiKey);
  appState.apiKey = apiKey;
  CONFIG.API_KEY = apiKey;
}

/**
 * 清除 API Key
 */
function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
  appState.apiKey = null;
  CONFIG.API_KEY = 'YOUR_API_KEY';
}

// 模板图标映射
const templateIcons = {
  supermarket: '🛒',
  hospital: '🏥',
  park: '🌳',
  school: '🏫'
};

// 初始化应用
function initApp() {
  loadApiKey();
  initApiKeySection();
  renderTemplateCards();
  bindEvents();
}

/**
 * 初始化 API Key 配置区
 */
function initApiKeySection() {
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveBtn = document.getElementById('saveApiKeyBtn');

  // 加载已保存的 API Key
  const savedKey = loadApiKey();
  if (savedKey) {
    apiKeyStatus.textContent = '已配置';
    apiKeyStatus.classList.remove('not-configured');
    apiKeyStatus.classList.add('configured');
    apiKeyInput.value = savedKey;
    saveBtn.textContent = '更新密钥';
  } else {
    apiKeyStatus.textContent = '未配置';
    apiKeyStatus.classList.add('not-configured');
    saveBtn.textContent = '保存密钥';
  }

  // 绑定保存按钮事件
  saveBtn.addEventListener('click', handleSaveApiKey);
}

/**
 * 处理保存 API Key
 */
function handleSaveApiKey() {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const saveBtn = document.getElementById('saveApiKeyBtn');

  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    alert('请输入 API Key');
    return;
  }

  // 保存 API Key
  saveApiKey(apiKey);

  // 更新 UI
  apiKeyStatus.textContent = '已配置';
  apiKeyStatus.classList.remove('not-configured');
  apiKeyStatus.classList.add('configured');
  saveBtn.textContent = '更新密钥';

  // 启用生成按钮（如果已填写主题和标题）
  updateGenerateButtonState();
}

/**
 * 渲染模板卡片
 */
function renderTemplateCards() {
  const grid = document.getElementById('templateGrid');
  const templates = getTemplateList();

  grid.innerHTML = templates.map(template => `
    <div class="template-card" data-key="${template.key}">
      <div class="icon">${templateIcons[template.key] || '📄'}</div>
      <div class="name">${template.name}</div>
      <div class="title">${template.title}</div>
    </div>
  `).join('');
}

/**
 * 绑定事件
 */
function bindEvents() {
  // 模板卡片点击事件
  document.getElementById('templateGrid').addEventListener('click', handleTemplateClick);

  // 输入框变化事件
  document.getElementById('themeInput').addEventListener('input', handleInputChange);
  document.getElementById('titleInput').addEventListener('input', handleInputChange);

  // 生成按钮点击事件
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);

  // 下载按钮点击事件
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);

  // 新建按钮点击事件
  document.getElementById('newBtn').addEventListener('click', handleNew);
}

/**
 * 处理模板卡片点击
 */
function handleTemplateClick(e) {
  const card = e.target.closest('.template-card');
  if (!card) return;

  const key = card.dataset.key;

  // 移除之前的选中状态
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));

  // 添加选中状态
  card.classList.add('selected');

  // 更新应用状态
  appState.selectedTemplate = key;

  // 填充表单
  const template = getTemplate(key);
  if (template) {
    document.getElementById('themeInput').value = template.name;
    document.getElementById('titleInput').value = template.title;
    document.getElementById('coreVocab').value = template.vocabulary.core.join(', ');
    document.getElementById('itemsVocab').value = template.vocabulary.items.join(', ');
    document.getElementById('envVocab').value = template.vocabulary.env.join(', ');

    // 启用生成按钮
    updateGenerateButtonState();
  }
}

/**
 * 处理输入框变化
 */
function handleInputChange() {
  // 如果用户手动修改了输入，取消模板选中状态
  if (appState.selectedTemplate) {
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    appState.selectedTemplate = null;
  }
  updateGenerateButtonState();
}

/**
 * 更新生成按钮状态
 */
function updateGenerateButtonState() {
  const theme = document.getElementById('themeInput').value.trim();
  const title = document.getElementById('titleInput').value.trim();
  const generateBtn = document.getElementById('generateBtn');

  // 需要同时满足：API Key 已配置、主题和标题都已填写
  const hasApiKey = appState.apiKey && appState.apiKey !== 'YOUR_API_KEY';
  generateBtn.disabled = !hasApiKey || !theme || !title;
}

/**
 * 处理生成按钮点击
 */
async function handleGenerate() {
  // 隐藏之前的结果和错误
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('errorSection').classList.add('hidden');

  // 显示进度
  const progressSection = document.getElementById('progressSection');
  const progressText = document.getElementById('progressText');
  const progressDetail = document.getElementById('progressDetail');
  progressSection.classList.remove('hidden');
  progressText.textContent = '正在准备生成...';
  progressDetail.textContent = '';

  try {
    // 获取表单数据
    const theme = document.getElementById('themeInput').value.trim();
    const title = document.getElementById('titleInput').value.trim();
    const coreVocab = parseVocabularyInput(document.getElementById('coreVocab').value);
    const itemsVocab = parseVocabularyInput(document.getElementById('itemsVocab').value);
    const envVocab = parseVocabularyInput(document.getElementById('envVocab').value);

    // 验证数据
    if (!theme || !title) {
      throw new Error('请填写主题和标题');
    }

    // 生成提示词
    const vocabulary = {
      core: coreVocab,
      items: itemsVocab,
      env: envVocab
    };
    const prompt = generatePrompt(theme, title, vocabulary);

    // 验证提示词长度
    if (isPromptTooLong(prompt)) {
      throw new Error('提示词过长，请减少词汇数量');
    }

    // 调用 API 生成图像
    progressText.textContent = '正在生成图像...';
    progressDetail.textContent = '这可能需要 30-60 秒，请耐心等待...';

    const imageUrls = await generateImage(prompt, {}, (progress) => {
      if (progress.step === 'creating') {
        progressText.textContent = progress.message;
      } else if (progress.step === 'polling') {
        progressText.textContent = '正在生成图像...';
        progressDetail.textContent = `已请求 ${progress.attempts} 次，请耐心等待...`;
      } else if (progress.step === 'completed') {
        progressText.textContent = progress.message;
        progressDetail.textContent = '';
      }
    });

    // 保存结果
    appState.currentImageUrls = imageUrls;

    // 显示结果
    displayResult(imageUrls);

  } catch (error) {
    console.error('生成失败:', error);
    displayError(error.message);
  }
}

/**
 * 显示生成结果
 */
function displayResult(imageUrls) {
  const progressSection = document.getElementById('progressSection');
  const resultSection = document.getElementById('resultSection');
  const imageContainer = document.getElementById('imageContainer');

  // 隐藏进度
  progressSection.classList.add('hidden');

  // 显示图片
  imageContainer.innerHTML = imageUrls.map(url => `
    <img src="${url}" alt="生成的儿童识字小报">
  `).join('');

  // 显示结果区域
  resultSection.classList.remove('hidden');

  // 滚动到结果区域
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 显示错误信息
 */
function displayError(message) {
  const progressSection = document.getElementById('progressSection');
  const errorSection = document.getElementById('errorSection');
  const errorText = document.getElementById('errorText');

  // 隐藏进度
  progressSection.classList.add('hidden');

  // 显示错误
  errorText.textContent = message;
  errorSection.classList.remove('hidden');
}

/**
 * 处理下载按钮点击
 */
async function handleDownload() {
  if (appState.currentImageUrls.length === 0) {
    alert('没有可下载的图片');
    return;
  }

  // 下载第一张图片
  const url = appState.currentImageUrls[0];

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `识字小报_${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载失败:', error);
    // 如果直接下载失败，尝试在新窗口打开
    window.open(url, '_blank');
  }
}

/**
 * 处理新建按钮点击
 */
function handleNew() {
  // 清空表单
  document.getElementById('themeInput').value = '';
  document.getElementById('titleInput').value = '';
  document.getElementById('coreVocab').value = '';
  document.getElementById('itemsVocab').value = '';
  document.getElementById('envVocab').value = '';

  // 清除模板选中状态
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  appState.selectedTemplate = null;

  // 隐藏结果
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('errorSection').classList.add('hidden');

  // 禁用生成按钮
  document.getElementById('generateBtn').disabled = true;

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);
