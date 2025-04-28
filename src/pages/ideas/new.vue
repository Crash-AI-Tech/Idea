<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-tech-gray-800">创建一个新点子</h1>
    <form @submit.prevent="submitIdea" class="bg-white p-6 rounded-lg shadow-sm border border-tech-gray-200">
      <div class="mb-4">
        <label for="title" class="block text-tech-gray-700 text-sm font-medium mb-2">标题</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required 
          class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          placeholder="输入你的点子标题"
        />
      </div>
      
      <div class="mb-4">
        <label for="description" class="block text-tech-gray-700 text-sm font-medium mb-2">描述</label>
        <textarea 
          id="description" 
          v-model="description" 
          required 
          rows="5"
          class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          placeholder="详细描述你的点子..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-tech-gray-700 text-sm font-medium mb-2">标签</label>
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
            placeholder="添加标签 (回车确认)"
            class="shadow-sm flex-grow appearance-none border border-tech-gray-300 rounded-md py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          />
          <button 
            type="button" 
            @click="addTag"
            class="ml-2 bg-tech-gray-100 hover:bg-tech-gray-200 text-tech-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            添加
          </button>
        </div>
        <p class="text-tech-gray-500 text-xs mt-1">添加相关标签，帮助其他人更容易找到你的点子</p>
      </div>
      
      <div class="flex items-center justify-between">
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition duration-200 ease-in-out disabled:opacity-50"
        >
          {{ loading ? '提交中...' : '发布点子' }}
        </button>
        <NuxtLink to="/" class="inline-block align-baseline font-medium text-sm text-tech-gray-600 hover:text-tech-gray-800">
          取消
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
import type { Database } from '~/types/supabase'

definePageMeta({
  middleware: 'auth' // 确保只有登录用户可以访问此页面
})

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
    errorMsg.value = '请先登录'
    return
  }
  
  if (!title.value.trim() || !description.value.trim()) {
    errorMsg.value = '标题和描述都不能为空'
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
    successMsg.value = '点子创建成功！'
    
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
    errorMsg.value = error.message || '创建点子时出错'
  } finally {
    loading.value = false
  }
}
</script>
