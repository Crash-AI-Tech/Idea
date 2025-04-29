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
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-20 animate-pulse">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      <p class="mt-4 text-tech-gray-600">{{ $t('common.loading') }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-20 bg-tech-gray-50 rounded-lg shadow-md border border-tech-gray-200 animate-fadeIn">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-2xl font-bold text-tech-gray-800 mb-2">{{ $t('common.error') }}</h2>
      <p class="text-tech-gray-600 mb-6">{{ error }}</p>
      <NuxtLink to="/" class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-50">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <!-- 点子详情内容 -->
    <template v-else-if="idea">
      <div class="max-w-4xl mx-auto">
        <!-- 点子卡片 - Pinterest风格 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 animate-fadeIn">
          <div class="p-6 sm:p-8">
            <!-- 编辑和删除按钮 (如果是用户自己的点子) -->
            <div v-if="user && idea.user_id === user.id" class="float-right flex space-x-2 ml-4">
              <NuxtLink 
                :to="`/ideas/edit/${idea.id}`"
                class="bg-tech-gray-100 hover:bg-tech-gray-200 p-2 rounded-full text-tech-gray-600 hover:text-primary-green transition-all duration-200 transform hover:scale-110"
                :title="$t('idea.editButton')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <button 
                @click="confirmDeleteIdea"
                class="bg-tech-gray-100 hover:bg-tech-gray-200 p-2 rounded-full text-tech-gray-600 hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                :title="$t('idea.deleteButton')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <h1 class="text-3xl font-bold text-tech-gray-800 mb-4">{{ idea.title }}</h1>
            
            <!-- 标签 -->
            <div v-if="processTags(idea.tags).length > 0" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in processTags(idea.tags)" 
                :key="tag" 
                class="inline-block px-3 py-1 text-sm bg-light-green text-primary-green rounded-full hover:shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="flex items-center text-sm text-tech-gray-500 mb-6">
              <span>{{ formatDate(idea.created_at) }}</span>
              <span class="mx-2">•</span>
              <span>{{ $t('idea.by') }}: {{ creatorName }}</span>
            </div>
            
            <div class="space-y-4 text-tech-gray-700 mb-8 leading-relaxed whitespace-pre-line">
              {{ idea.description }}
            </div>
            
            <div class="flex flex-wrap gap-3 pt-4 border-t border-tech-gray-100">
              <button 
                @click="toggleLike"
                class="flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 hover:-translate-y-1"
                :class="isLiked ? 'border-primary-green text-primary-green bg-opacity-10 bg-light-green' : 'border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green'"
                :disabled="!user || likeLoading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{{ likeCount }} {{ isLiked ? $t('idea.unlikeButton') : $t('idea.likeButton') }}</span>
              </button>
              
              <button 
                @click="focusCommentInput"
                class="flex items-center space-x-2 px-4 py-2 rounded-full border border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green transition-all duration-200 hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{{ comments.length }} {{ $t('idea.commentButton') }}</span>
              </button>
              
              <button 
                @click="shareIdea"
                class="flex items-center space-x-2 px-4 py-2 rounded-full border border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green transition-all duration-200 hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>{{ $t('idea.shareButton') }}</span>
              </button>
            </div>
          </div>
        </div>
      
        <!-- 评论区 -->
        <CommentSection
          ref="commentSectionRef"
          :comments="comments"
          :user="user"
          :comment-loading="commentLoading"
          :format-date="formatDate"
          @submit="handleCommentSubmit"
        />
      </div>
    </template>
    
    <!-- 删除确认对话框 -->
    <DeleteConfirmDialog
      :show="showDeleteConfirm"
      :idea-title="idea?.title || ''"
      @cancel="cancelDelete"
      @confirm="deleteIdea"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '#imports'
import { useIdeaDetail } from '~/composables/useIdeaDetail'
import IdeaCard from '~/components/idea/IdeaCard.vue'
import CommentSection from '~/components/idea/CommentSection.vue'
import DeleteConfirmDialog from '~/components/idea/DeleteConfirmDialog.vue'
import { processTags } from '~/utils/tagsHelper'

// 获取i18n
const { t } = useI18n()

// 获取路由参数
const route = useRoute()
const ideaId = computed(() => route.params.id as string)

// 使用组合式API获取点子详情数据
const {
  loading,
  error,
  idea,
  comments,
  likeCount,
  isLiked,
  commentLoading,
  likeLoading,
  showDeleteConfirm,
  creatorName,
  user,
  toggleLike,
  submitComment,
  confirmDeleteIdea,
  cancelDelete,
  deleteIdea,
  formatDate,
  updateIdea
} = useIdeaDetail(ideaId.value)

// 评论区组件引用
const commentSectionRef = ref<any>(null)

// 聚焦到评论输入框
function focusCommentInput() {
  if (commentSectionRef.value?.commentInputRef) {
    commentSectionRef.value.commentInputRef.focus()
    
    // 滚动到评论区
    document.getElementById('comments')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

// 处理点子更新
function handleIdeaUpdate(updatedIdea: any) {
  console.log('[id].vue: handleIdeaUpdate received:', updatedIdea);
  updateIdea(updatedIdea);
}

// 新增处理函数
async function handleCommentSubmit(content: string) {
  console.log('[id].vue: handleCommentSubmit received content:', content);
  await submitComment(content);
}

// 分享功能
function shareIdea() {
  if (navigator.share) {
    navigator.share({
      title: idea.value.title,
      text: idea.value.description.substring(0, 100) + '...',
      url: window.location.href,
    })
    .catch((error) => console.log('分享失败:', error));
  } else {
    // 复制链接到剪贴板的备用方案
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    
    alert(t('idea.linkCopied'));
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
