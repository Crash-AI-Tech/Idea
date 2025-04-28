<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-tech-gray-800">{{ $t('idea.newTitle') }}</h1>
    <form @submit.prevent="submitIdea" class="bg-white p-6 rounded-lg shadow-sm border border-tech-gray-200">
      <div class="mb-4">
        <label for="title" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.titleLabel') }}</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required 
          class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          :placeholder="$t('idea.titlePlaceholder')"
        />
      </div>
      
      <div class="mb-4">
        <label for="description" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.descriptionLabel') }}</label>
        <textarea 
          id="description" 
          v-model="description" 
          required 
          rows="5"
          class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          :placeholder="$t('idea.descriptionPlaceholder')"
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.tagsLabel') }}</label>
        <div class="mb-2 flex flex-wrap gap-2">
          <span 
            v-for="(tag, index) in tags" 
            :key="index"
            class="bg-light-green text-primary-green px-3 py-1 rounded-full text-sm flex items-center"
          >
            {{ tag }}
            <button 
              type="button" 
              @click="removeTag(index)"
              class="ml-2 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
        <div class="flex">
          <input 
            type="text" 
            v-model="newTag" 
            @keyup.enter="addTag"
            :placeholder="$t('idea.tagsPlaceholder')"
            class="shadow-sm flex-grow appearance-none border border-tech-gray-300 rounded-md py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          />
          <button 
            type="button" 
            @click="addTag"
            class="ml-2 bg-tech-gray-100 hover:bg-tech-gray-200 text-tech-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            {{ $t('idea.addTagButton') }}
          </button>
        </div>
        <p class="text-tech-gray-500 text-xs mt-1">{{ $t('idea.tagsHelp') }}</p>
      </div>
      
      <div class="flex items-center justify-between">
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition duration-200 ease-in-out disabled:opacity-50"
        >
          {{ loading ? $t('common.loading') : $t('idea.submitButton') }}
        </button>
        <NuxtLink to="/" class="inline-block align-baseline font-medium text-sm text-tech-gray-600 hover:text-tech-gray-800">
          {{ $t('common.cancel') }}
        </NuxtLink>
      </div>
      
      <div class="mt-4">
        <p v-if="errorMsg" class="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-primary-green text-sm py-2 px-3 bg-light-green rounded-md">{{ successMsg }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'
import type { Database } from '~/types/supabase'

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
        tags: tags.value.length > 0 ? tags.value : null
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
