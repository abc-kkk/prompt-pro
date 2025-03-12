<template>
  <div class="edit-prompt-view">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <button class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h1 class="page-title">{{ isEditMode ? '编辑提示词' : '创建提示词' }}</h1>
      </div>
      
      <!-- 提示词表单 -->
      <form @submit.prevent="savePrompt" class="prompt-form">
        <!-- 标题 -->
        <div class="form-group">
          <label for="promptTitle" class="form-label">标题</label>
          <input 
            type="text" 
            id="promptTitle" 
            v-model="formData.title" 
            class="form-control" 
            placeholder="输入提示词标题" 
            required
          />
        </div>
        
        <!-- 内容 -->
        <div class="form-group">
          <label for="promptContent" class="form-label">内容</label>
          <textarea 
            id="promptContent" 
            v-model="formData.content" 
            class="form-control" 
            placeholder="输入提示词内容" 
            rows="8" 
            required
          ></textarea>
        </div>
        
        <!-- 分类 -->
        <div class="form-group">
          <label for="promptCategory" class="form-label">分类</label>
          <select 
            id="promptCategory" 
            v-model="formData.categoryId" 
            class="form-control"
          >
            <option v-for="category in allCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- 标签 -->
        <div class="form-group">
          <label class="form-label">标签</label>
          <div class="tags-input">
            <div class="tags-container">
              <span 
                v-for="(tag, index) in formData.tags" 
                :key="index" 
                class="tag"
              >
                {{ tag }}
                <button type="button" class="remove-tag" @click="removeTag(index)">×</button>
              </span>
            </div>
            <div class="tag-input-container">
              <input 
                type="text" 
                v-model="tagInput" 
                @keydown.enter.prevent="addTag" 
                placeholder="添加标签..." 
                class="tag-input"
              />
              <button type="button" class="add-tag-button" @click="addTag">添加</button>
            </div>
          </div>
        </div>
        
        <!-- 示例图片 -->
        <div class="form-group">
          <label class="form-label">示例图片</label>
          <div class="examples-container">
            <div 
              v-for="(example, index) in formData.examples" 
              :key="index" 
              class="example-item"
            >
              <img :src="example" alt="示例图片" class="example-image" />
              <button type="button" class="remove-example" @click="removeExample(index)">×</button>
            </div>
            <div class="upload-container" v-if="formData.examples.length < 5">
              <input 
                type="file" 
                ref="fileInput" 
                accept="image/*" 
                @change="handleImageUpload" 
                class="file-input" 
              />
              <button type="button" class="upload-button" @click="triggerFileInput">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                上传图片
              </button>
            </div>
          </div>
          <p class="form-note">最多添加5张示例图片</p>
        </div>
        
        <!-- 表单操作 -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="goBack">取消</button>
          <button type="submit" class="btn-save">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/**
 * 编辑/创建提示词视图
 * 用于创建新的提示词或编辑现有提示词
 */
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePromptStore } from '../stores/promptStore';
import { useCategoryStore } from '../stores/categoryStore';

// 路由和存储
const route = useRoute();
const router = useRouter();
const promptStore = usePromptStore();
const categoryStore = useCategoryStore();

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  categoryId: 1,
  tags: [],
  examples: []
});

// 标签输入
const tagInput = ref('');
const fileInput = ref(null);

// 计算属性
const isEditMode = computed(() => !!route.params.id);
const allCategories = computed(() => categoryStore.categories);

// 初始化
onMounted(() => {
  // 如果是编辑模式，加载现有提示词数据
  if (isEditMode.value) {
    const prompt = promptStore.getPromptById(parseInt(route.params.id));
    
    if (prompt) {
      formData.title = prompt.title;
      formData.content = prompt.content;
      formData.categoryId = prompt.categoryId;
      formData.tags = [...prompt.tags];
      formData.examples = [...prompt.examples];
    } else {
      // 如果提示词不存在，跳转到404页面
      router.push({ name: 'not-found' });
    }
  }
});

// 方法
const addTag = () => {
  const trimmedTag = tagInput.value.trim();
  
  if (trimmedTag && !formData.tags.includes(trimmedTag)) {
    formData.tags.push(trimmedTag);
    tagInput.value = '';
  }
};

const removeTag = (index) => {
  formData.tags.splice(index, 1);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  
  if (file && formData.examples.length < 5) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      formData.examples.push(e.target.result);
    };
    
    reader.readAsDataURL(file);
    // 重置文件输入，以便可以多次选择相同的文件
    event.target.value = '';
  }
};

const removeExample = (index) => {
  formData.examples.splice(index, 1);
};

const savePrompt = async () => {
  try {
    if (isEditMode.value) {
      // 更新现有提示词
      promptStore.updatePrompt({
        id: parseInt(route.params.id),
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        tags: formData.tags,
        examples: formData.examples
      });
    } else {
      // 添加新提示词
      promptStore.addPrompt({
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        tags: formData.tags,
        examples: formData.examples
      });
    }
    
    // 使用nextTick确保在DOM更新后执行导航
    await nextTick();
    // 返回首页，添加replace: true确保用户不能通过浏览器返回按钮返回到编辑页面
    router.push({ name: 'home', replace: true });
    
    // 以防上面的路由导航失败，添加一个超时后的备份导航
    setTimeout(() => {
      if (route.name === 'create-prompt' || route.name === 'edit-prompt') {
        window.location.href = '/';
      }
    }, 100);
  } catch (error) {
    console.error('保存提示词时出错:', error);
    // 即使出错也尝试导航到首页
    router.push({ name: 'home' });
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.edit-prompt-view {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 1rem;
  
  &:hover {
    background-color: var(--color-background-mute);
  }
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.prompt-form {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 2rem;
  max-width: 800px;
  box-shadow: var(--shadow-sm);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.form-note {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.tags-input {
  margin-bottom: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-background-tertiary);
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-tag {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.25rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 1rem;
  
  &:hover {
    color: var(--color-danger);
  }
}

.tag-input-container {
  display: flex;
  gap: 0.5rem;
}

.tag-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.add-tag-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-background-mute);
  }
}

.examples-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.example-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.example-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-example {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-danger);
  }
}

.upload-container {
  width: 100px;
  height: 100px;
  position: relative;
}

.file-input {
  display: none;
}

.upload-button {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-background-mute);
  }
}

.btn-save {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
}
</style> 