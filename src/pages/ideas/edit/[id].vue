<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回链接 -->
    <div class="mb-6">
      <NuxtLink :to="`/ideas/${ideaId}`" class="inline-flex items-center text-tech-gray-600 hover:text-primary-green transition-colors duration-200 transform hover:translate-x-[-2px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-20 animate-pulse">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      <p class="mt-4 text-tech-gray-600">{{ $t('common.loading') }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="max-w-2xl mx-auto text-center py-20 bg-tech-gray-50 rounded-lg shadow-md border border-tech-gray-200 animate-fadeIn">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-2xl font-bold text-tech-gray-800 mb-2">{{ $t('common.error') }}</h2>
      <p class="text-tech-gray-600 mb-6">{{ error }}</p>
      <NuxtLink :to="`/ideas/${ideaId}`" class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-50">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <!-- 编辑表单 -->
    <div v-else-if="idea" class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
      <div class="p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-tech-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {{ $t('idea.editIdea') }}
        </h1>
        
        <form @submit.prevent="saveChanges" class="space-y-5">
          <div class="mb-4">
            <label for="edit-title" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.titleLabel') }} *</label>
            <input 
              type="text" 
              id="edit-title" 
              v-model="editForm.title" 
              required 
              class="shadow-sm appearance-none border border-tech-gray-300 rounded-lg w-full py-3 px-4 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
              :placeholder="$t('idea.titlePlaceholder')"
            />
          </div>
          
          <div class="mb-4">
            <label for="edit-description" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.descriptionLabel') }} *</label>
            <textarea 
              id="edit-description" 
              v-model="editForm.description" 
              required 
              rows="6"
              class="shadow-sm appearance-none border border-tech-gray-300 rounded-lg w-full py-3 px-4 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
              :placeholder="$t('idea.descriptionPlaceholder')"
            ></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.tagsLabel') }}</label>
            <div class="mb-3 flex flex-wrap gap-2">
              <span 
                v-for="(tag, index) in editForm.tags" 
                :key="index"
                class="bg-light-green text-primary-green px-3 py-1 rounded-full text-sm flex items-center transition-all duration-200 transform hover:scale-105"
              >
                {{ tag }}
                <button 
                  type="button" 
                  @click="removeTag(index)"
                  class="ml-2 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              
              <span v-if="editForm.tags.length === 0" class="text-tech-gray-400 text-sm italic">
                {{ $t('idea.noTags') }}
              </span>
            </div>
            <div class="flex">
              <input 
                type="text" 
                v-model="newTag" 
                @keyup.enter="addTag"
                :placeholder="$t('idea.tagsPlaceholder')"
                class="shadow-sm flex-grow appearance-none border border-tech-gray-300 rounded-lg py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
              />
              <button 
                type="button" 
                @click="addTag"
                class="ml-2 bg-tech-gray-100 hover:bg-tech-gray-200 text-tech-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                {{ $t('idea.addTagButton') }}
              </button>
            </div>
            <p class="text-tech-gray-500 text-xs mt-1">{{ $t('idea.tagsHelp') }}</p>
          </div>
          
          <div v-if="updateError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
            <p>{{ updateError }}</p>
          </div>
          
          <div v-if="updateSuccess" class="bg-light-green border-l-4 border-primary-green text-primary-green p-4 rounded-md mb-4">
            <p>{{ updateSuccess }}</p>
          </div>
          
          <div class="flex items-center space-x-4 pt-4 border-t border-tech-gray-100">
            <button 
              type="submit" 
              :disabled="updateLoading"
              class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              <span v-if="updateLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else>{{ $t('idea.updateButton') }}</span>
            </button>
            <button 
              type="button"
              @click="$router.push(`/ideas/${ideaId}`)"
              class="inline-flex items-center px-4 py-2 border border-tech-gray-300 text-sm font-medium rounded-full text-tech-gray-700 bg-white hover:bg-tech-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-200"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '#imports'
import { processTags, normalizeTags } from '~/utils/tagsHelper'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const ideaId = route.params.id
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// 状态
const loading = ref(true)
const error = ref(null)
const idea = ref(null)
const updateLoading = ref(false)
const updateError = ref(null)
const updateSuccess = ref(null)
const newTag = ref('')
const editForm = ref({
  title: '',
  description: '',
  tags: []
})

onMounted(async () => {
  if (!user.value) {
    router.push(`/ideas/${ideaId}`)
    return
  }
  
  await fetchIdea()
})

// 获取点子详情
async function fetchIdea() {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: err } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .single()
    
    if (err) throw err
    if (!data) throw new Error(t('idea.notFound'))
    
    // 检查是否是用户自己的点子
    if (data.user_id !== user.value?.id) {
      throw new Error(t('idea.notOwnIdea'))
    }
    
    idea.value = data
    
    // 初始化编辑表单
    editForm.value = {
      title: data.title,
      description: data.description,
      tags: processTags(data.tags)
    }
    
  } catch (err) {
    console.error('Error fetching idea:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 添加标签
function addTag() {
  const tag = newTag.value.trim()
  if (tag && !editForm.value.tags.includes(tag)) {
    editForm.value.tags.push(tag)
    newTag.value = ''
  }
}

// 删除标签
function removeTag(index) {
  editForm.value.tags.splice(index, 1)
}

// 保存修改
async function saveChanges() {
  if (!user.value) {
    updateError.value = t('idea.loginRequired')
    return
  }
  
  if (!editForm.value.title.trim() || !editForm.value.description.trim()) {
    updateError.value = t('idea.emptyFieldsError')
    return
  }
  
  updateLoading.value = true
  updateError.value = null
  updateSuccess.value = null
  
  try {
    const { data, error: err } = await supabase
      .from('ideas')
      .update({
        title: editForm.value.title.trim(),
        description: editForm.value.description.trim(),
        tags: editForm.value.tags.length > 0 ? normalizeTags(editForm.value.tags) : null
      })
      .eq('id', ideaId)
      .eq('user_id', user.value.id) // 确保只能更新自己的点子
      .select()

    if (err) throw err

    updateSuccess.value = t('idea.updateSuccess')
    
    // 短暂延迟后返回详情页面
    setTimeout(() => {
      router.push(`/ideas/${ideaId}`)
    }, 1500)

  } catch (err) {
    console.error('Error updating idea:', err)
    updateError.value = err.message || t('idea.updateError')
  } finally {
    updateLoading.value = false
  }
}
</script>

<style scoped>
/* 页面淡入效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 脉冲加载动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
