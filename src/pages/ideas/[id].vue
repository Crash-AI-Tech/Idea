<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回链接 -->
    <div class="mb-6">
      <NuxtLink to="/" class="inline-flex items-center text-tech-gray-600 hover:text-primary-green transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-green"></div>
      <p class="mt-2 text-tech-gray-600">{{ $t('common.loading') }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-20 bg-tech-gray-50 rounded-lg shadow-sm border border-tech-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-2xl font-bold text-tech-gray-800 mb-2">{{ $t('common.error') }}</h2>
      <p class="text-tech-gray-600 mb-6">{{ error }}</p>
      <NuxtLink to="/" class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 ease-in-out">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>
    
    <!-- 点子详情内容 -->
    <template v-else-if="idea">
      <!-- 点子卡片 -->
      <IdeaCard 
        :idea="idea" 
        :user="user" 
        :like-count="likeCount" 
        :is-liked="isLiked" 
        :like-loading="likeLoading"
        :comment-count="comments.length"
        :creator-name="creatorName"
        :format-date="formatDate"
        @like="toggleLike"
        @comment="focusCommentInput"
        @delete="confirmDeleteIdea"
      />
      
      <!-- 评论区 -->
      <CommentSection
        ref="commentSectionRef"
        :comments="comments"
        :user="user"
        :comment-loading="commentLoading"
        :format-date="formatDate"
        @submit="handleCommentSubmit"
      />
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
  formatDate
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

// 新增处理函数
async function handleCommentSubmit(content: string) {
  console.log('[id].vue: handleCommentSubmit received content:', content); // 添加日志
  await submitComment(content); // 调用 composable 中的函数并传递内容
}
</script>
