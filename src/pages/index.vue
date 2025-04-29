<template>
  <div class="container mx-auto px-4 py-8 bg-gray-50">
    <!-- 头部区域 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-tech-gray-800">{{ $t('home.title') }}</h1>
      <NuxtLink 
        to="/ideas/new" 
        class="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 flex items-center shadow-md"
        v-if="user"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ $t('idea.newTitle') }}
      </NuxtLink>
    </div>
    
    <!-- 标签和筛选区域 -->
    <div class="mb-6 bg-white p-4 rounded-xl border border-tech-gray-200 shadow-sm">
      <div class="mb-4">
        <h3 class="text-sm font-medium text-tech-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          {{ $t('home.filterByTag') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedTag = ''"
            class="px-3 py-1 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow"
            :class="!selectedTag ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : 'bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200'"
          >
            {{ $t('home.allTags') }}
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = tag"
            class="px-3 py-1 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow"
            :class="selectedTag === tag ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : 'bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200'"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      
      <div>
        <h3 class="text-sm font-medium text-tech-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {{ $t('home.sortBy') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            @click="sortBy = 'newest'"
            class="px-3 py-1 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow"
            :class="sortBy === 'newest' ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white' : 'bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200'"
          >
            {{ $t('home.sortOptions.newest') }}
          </button>
          <button
            @click="sortBy = 'popular'"
            class="px-3 py-1 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow"
            :class="sortBy === 'popular' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' : 'bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200'"
          >
            {{ $t('home.sortOptions.mostLiked') }}
          </button>
          <button
            @click="sortBy = 'comments'"
            class="px-3 py-1 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow"
            :class="sortBy === 'comments' ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' : 'bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200'"
          >
            {{ $t('home.sortOptions.mostCommented') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-300 border-t-pink-600 border-b-pink-600"></div>
      <p class="mt-4 text-tech-gray-600 font-medium">{{ $t('common.loading') }}</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredIdeas.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-tech-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-pink-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <h3 class="text-xl font-semibold text-tech-gray-800 mb-2">
        {{ selectedTag ? $t('home.noIdeasWithTag', { tag: selectedTag }) : $t('home.noIdeas') }}
      </h3>
      <p class="text-tech-gray-600 mb-6">{{ selectedTag ? $t('home.tryOtherTag') : $t('home.beFirst') }}</p>
      
      <div class="space-x-3">
        <button 
          v-if="selectedTag"
          @click="selectedTag = ''"
          class="inline-block bg-tech-gray-100 hover:bg-tech-gray-200 text-tech-gray-700 font-medium py-2 px-6 rounded-xl transition-colors duration-200 shadow-sm"
        >
          {{ $t('home.clearFilter') }}
        </button>
        
        <NuxtLink 
          to="/ideas/new" 
          class="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-2 px-6 rounded-xl transition-colors duration-200 shadow-md"
          v-if="user"
        >
          {{ $t('home.addFirstIdea') }}
        </NuxtLink>
        
        <NuxtLink 
          to="/login" 
          class="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-2 px-6 rounded-xl transition-colors duration-200 shadow-md"
          v-else
        >
          {{ $t('home.loginToAdd') }}
        </NuxtLink>
      </div>
    </div>
    
    <!-- Pinterest风格的瀑布流布局 -->
    <div v-else class="masonry-grid">
      <NuxtLink 
        v-for="(idea, index) in filteredIdeas" 
        :key="idea.id" 
        :to="`/ideas/${idea.id}`"
        class="idea-card bg-white rounded-xl shadow-sm hover:shadow-xl border border-tech-gray-200 overflow-hidden transform hover:-translate-y-1 mb-6 relative"
        :style="{ '--index': index }"
      >
        <div class="p-4">
          <h2 class="text-xl font-bold text-tech-gray-800 mb-2 hover:text-primary-green transition-colors">{{ idea.title }}</h2>
          
          <!-- 标签 -->
          <div v-if="processTags(idea.tags).length > 0" class="flex flex-wrap gap-1 mb-3">
            <span 
              v-for="(tag, tagIndex) in processTags(idea.tags)" 
              :key="tag" 
              :class="[
                'inline-block px-2 py-1 text-xs rounded-full shadow-sm transition-all duration-200 hover:shadow', 
                tagIndex % 4 === 0 ? 'bg-gradient-to-r from-pink-100 to-red-100 text-red-600' : 
                tagIndex % 4 === 1 ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600' :
                tagIndex % 4 === 2 ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-600' :
                'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-600'
              ]"
            >
              {{ tag }}
            </span>
          </div>
          
          <p class="text-tech-gray-700 line-clamp-3 mb-3">{{ idea.description }}</p>
          
          <div class="flex justify-between items-center mt-2 text-sm text-tech-gray-500">
            <div class="flex items-center space-x-3">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {{ idea.likes_count || 0 }}
              </span>
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {{ idea.comments_count || 0 }}
              </span>
            </div>
            
            <span class="text-xs text-tech-gray-400">{{ formatDate(idea.created_at) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-tech-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold text-tech-gray-800 mb-3">{{ $t('idea.deleteConfirmTitle') }}</h3>
        <p class="text-tech-gray-600 mb-4">{{ $t('idea.deleteConfirmText', { title: ideaToDelete?.title }) }}</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelDelete"
            class="px-4 py-2 rounded-lg bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200 transition-colors"
          >
            {{ $t('idea.cancelButton') }}
          </button>
          <button 
            @click="deleteIdea"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transition-colors shadow-md"
          >
            {{ $t('idea.deleteButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '#imports'
import type { Database } from '~/types/supabase'
import { processTags } from '~/utils/tagsHelper'

const { t, locale } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const loading = ref(true)
const ideas = ref<any[]>([])

// 排序和筛选变量
const selectedTag = ref('')
const sortBy = ref('newest') // 'newest', 'popular', 'comments'
const allTags = ref<string[]>([])

// 删除相关变量
const showDeleteConfirm = ref(false)
const ideaToDelete = ref<any>(null)

// 筛选后的点子列表
const filteredIdeas = computed(() => {
  let result = [...ideas.value]
  
  // 标签筛选
  if (selectedTag.value) {
    result = result.filter(idea => {
      const tags = processTags(idea.tags);
      return tags.includes(selectedTag.value);
    });
  }
  
  // 排序
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
  } else if (sortBy.value === 'comments') {
    result.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0))
  }
  
  return result
})

onMounted(async () => {
  await fetchIdeas()
  collectAllTags()
})

// 获取所有点子
async function fetchIdeas() {
  try {
    loading.value = true
    
    // 通过SQL查询统计每个点子的点赞和评论数
    const { data, error } = await supabase
      .from('ideas')
      .select('id, title, description, user_id, created_at, tags, likes:likes(count), comments:comments(count)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    if (data) {
      // 转换数据，提取点赞和评论计数
      ideas.value = data.map(idea => ({
        ...idea,
        likes_count: idea.likes?.[0]?.count || 0,
        comments_count: idea.comments?.[0]?.count || 0,
        // 确保tags是正确的格式
        tags: idea.tags // 标签将由processTags函数处理
      }))
      
      collectAllTags()
    }
  } catch (error) {
    console.error('Error fetching ideas:', error)
  } finally {
    loading.value = false
  }
}

// 收集所有标签
function collectAllTags() {
  const tagSet = new Set<string>()
  
  ideas.value.forEach(idea => {
    const tags = processTags(idea.tags);
    tags.forEach(tag => tagSet.add(tag));
  })
  
  allTags.value = Array.from(tagSet)
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 删除相关函数
function confirmDeleteIdea(idea: any) {
  ideaToDelete.value = idea
  showDeleteConfirm.value = true
}

function cancelDelete() {
  showDeleteConfirm.value = false
  ideaToDelete.value = null
}

async function deleteIdea() {
  if (!ideaToDelete.value) return
  
  try {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', ideaToDelete.value.id)
      .eq('user_id', user.value?.id) // 确保只能删除自己的点子
    
    if (error) throw error
    
    // 从本地列表中移除
    ideas.value = ideas.value.filter(idea => idea.id !== ideaToDelete.value.id)
    
    // 更新标签
    collectAllTags()
    
    // 关闭对话框
    showDeleteConfirm.value = false
    ideaToDelete.value = null
    
  } catch (error) {
    console.error('Error deleting idea:', error)
    alert(t('idea.deleteError'))
  }
}
</script>

<style>
/* Pinterest风格的瀑布流布局 */
.masonry-grid {
  column-count: 1;
  column-gap: 1rem;
}

@media (min-width: 640px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    column-count: 4;
  }
}

.idea-card {
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  position: relative;
}

/* 卡片悬停效果 */
.idea-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.02);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 0.75rem;
}

.idea-card:hover::after {
  opacity: 1;
}

/* 新增活力色彩 */
.idea-card:nth-child(4n+1) {
  border-top: 3px solid #E60023;
}

.idea-card:nth-child(4n+2) {
  border-top: 3px solid #0076E3;
}

.idea-card:nth-child(4n+3) {
  border-top: 3px solid #5F27CD;
}

.idea-card:nth-child(4n+4) {
  border-top: 3px solid #FF9800;
}

/* 添加淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.idea-card {
  animation: fadeIn 0.6s ease forwards;
  animation-delay: calc(var(--index) * 0.1s);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 标签增加渐变色彩 */
.idea-card:nth-child(4n+1) .bg-light-green {
  background: linear-gradient(to right, #FFE2E2, #FFC0CB);
  color: #C72C41;
}

.idea-card:nth-child(4n+2) .bg-light-green {
  background: linear-gradient(to right, #E0F7FA, #B2EBF2);
  color: #0277BD;
}

.idea-card:nth-child(4n+3) .bg-light-green {
  background: linear-gradient(to right, #E8EAFC, #D4DAFF);
  color: #4834D4;
}

.idea-card:nth-child(4n+4) .bg-light-green {
  background: linear-gradient(to right, #FFF4E6, #FFE2B7);
  color: #E67E22;
}
</style>
