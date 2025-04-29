<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回链接 -->
    <div class="mb-6">
      <NuxtLink to="/" class="inline-flex items-center text-tech-gray-600 hover:text-primary-green transition-colors duration-200 transform hover:translate-x-[-2px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
      <div class="p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-tech-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ $t('idea.newTitle') }}
        </h1>
        
        <form @submit.prevent="submitIdea" class="space-y-5">
          <div class="mb-4">
            <label for="title" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.titleLabel') }} *</label>
            <input 
              type="text" 
              id="title" 
              v-model="title" 
              required 
              class="shadow-sm appearance-none border border-tech-gray-300 rounded-lg w-full py-3 px-4 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
              :placeholder="$t('idea.titlePlaceholder')"
            />
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.descriptionLabel') }} *</label>
            <textarea 
              id="description" 
              v-model="description" 
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
                v-for="(tag, index) in tags" 
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
              
              <span v-if="tags.length === 0" class="text-tech-gray-400 text-sm italic">
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
          
          <div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
            <p>{{ errorMsg }}</p>
          </div>
          
          <div v-if="successMsg" class="bg-light-green border-l-4 border-primary-green text-primary-green p-4 rounded-md mb-4 animate-pulse-slow">
            <p>{{ successMsg }}</p>
          </div>
          
          <div class="flex items-center space-x-4 pt-4 border-t border-tech-gray-100">
            <button 
              type="submit" 
              :disabled="loading"
              class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else>{{ $t('idea.submitButton') }}</span>
            </button>
            <NuxtLink 
              to="/" 
              class="inline-flex items-center px-4 py-2 border border-tech-gray-300 text-sm font-medium rounded-full text-tech-gray-700 bg-white hover:bg-tech-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-200"
            >
              {{ $t('common.cancel') }}
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'
import type { Database } from '~/types/supabase'
import { normalizeTags } from '~/utils/tagsHelper'

definePageMeta({
  middleware: 'auth' // 确保只有登录用户可以访问此页面
})

const { t } = useI18n()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const router = useRouter()

const title = ref('')
const description = ref('')
const tags = ref<string[]>([])
const newTag = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

// 添加标签
function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    newTag.value = ''
  }
}

// 删除标签
function removeTag(index: number) {
  tags.value.splice(index, 1)
}

const submitIdea = async () => {
  if (!user.value) {
    errorMsg.value = t('idea.loginRequired')
    return
  }
  
  if (!title.value.trim() || !description.value.trim()) {
    errorMsg.value = t('idea.emptyFieldsError')
    return
  }
  
  loading.value = true
  errorMsg.value = null
  successMsg.value = null
  
  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: title.value.trim(),
        description: description.value.trim(),
        user_id: user.value.id,
        tags: tags.value.length > 0 ? normalizeTags(tags.value) : null
      })
      .select()

    if (error) throw error

    console.log('Idea created:', data)
    successMsg.value = t('idea.createSuccess')
    
    // 短暂延迟后跳转到首页或新创建的点子详情页
    setTimeout(() => {
      if (data && data.length > 0) {
        router.push(`/ideas/${data[0].id}`)
      } else {
        router.push('/')
      }
    }, 1500)

  } catch (error: any) {
    console.error('Error creating idea:', error)
    errorMsg.value = error.message || t('idea.createError')
  } finally {
    loading.value = false
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

/* 缓慢脉冲动画 */
@keyframes pulseSlow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
