<template>
  <div id="comments" class="bg-white rounded-xl shadow-md border border-tech-gray-200 p-6 sm:p-8 animate-fadeIn">
    <h2 class="text-xl font-bold text-tech-gray-800 mb-6 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      {{ $t('idea.commentsTitle') }} 
      <span class="text-base font-normal text-tech-gray-500 ml-2">({{ comments.length }})</span>
    </h2>
    
    <!-- 评论输入框 -->
    <div v-if="user" class="mb-8 border-b border-tech-gray-100 pb-8">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="comment" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.addComment') }}</label>
          <textarea 
            id="comment" 
            ref="commentInputRef"
            v-model="commentContent" 
            rows="3" 
            class="shadow-sm appearance-none border border-tech-gray-300 rounded-lg w-full py-3 px-4 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
            :placeholder="$t('idea.addCommentPlaceholder')"
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            :disabled="commentLoading"
          >
            <span v-if="commentLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('common.loading') }}
            </span>
            <span v-else>{{ $t('idea.submitCommentButton') }}</span>
          </button>
        </div>
      </form>
    </div>
    
    <div v-else class="text-center py-6 bg-tech-gray-50 rounded-lg mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-tech-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <p class="text-tech-gray-600 mb-3">{{ $t('idea.loginToComment') }}</p>
      <NuxtLink to="/login" class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all duration-300 transform hover:-translate-y-1">
        {{ $t('app.header.login') }}
      </NuxtLink>
    </div>
    
    <div v-if="comments.length === 0" class="text-center py-10 px-6 bg-tech-gray-50 rounded-lg flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-tech-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p class="text-tech-gray-500 text-lg">{{ $t('idea.noComments') }}</p>
      <p class="text-tech-gray-400 mt-1">{{ $t('idea.beFirstComment') }}</p>
    </div>
    
    <div v-else class="space-y-6">
      <div 
        v-for="(comment, index) in comments" 
        :key="comment.id" 
        class="py-4 px-5 border-l-4 border-light-green rounded-r-lg hover:bg-tech-gray-50 transition-all duration-200"
        :style="{
          animationDelay: `${index * 0.05}s`,
          opacity: 0
        }"
        :class="['comment-item']"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="font-semibold text-tech-gray-800 flex items-center">
            <span class="inline-block h-6 w-6 rounded-full bg-primary-green text-white text-xs flex items-center justify-center mr-2">
              {{ (comment.user_id === user?.id ? $t('idea.you') : $t('idea.user')).charAt(0) }}
            </span>
            {{ comment.user_id === user?.id ? $t('idea.you') : $t('idea.user') }}
          </div>
          <div class="text-sm text-tech-gray-500">{{ formatDate(comment.created_at) }}</div>
        </div>
        <p class="text-tech-gray-700 pl-8">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '#imports'
import type { PropType } from 'vue'

const { t } = useI18n()

const props = defineProps({
  comments: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  user: {
    type: [Object, null] as PropType<any | null>,
    default: null
  },
  commentLoading: {
    type: Boolean,
    default: false
  },
  formatDate: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['submit'])
const commentContent = ref('')
const commentInputRef = ref<HTMLTextAreaElement | null>(null)

defineExpose({
  commentInputRef
})

function onSubmit() {
  console.log('CommentSection: onSubmit triggered. Emitting content:', commentContent.value);
  if (!commentContent.value.trim()) return;
  emit('submit', commentContent.value)
  commentContent.value = '';
}

onMounted(() => {
  // 初始化评论动画
  if (typeof document !== 'undefined') {
    const commentItems = document.querySelectorAll('.comment-item');
    
    setTimeout(() => {
      commentItems.forEach(item => {
        (item as HTMLElement).style.opacity = '1';
        (item as HTMLElement).style.transition = 'opacity 0.3s ease';
      });
    }, 100);
  }
})
</script>

<style scoped>
/* 评论淡入动画 */
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

.comment-item {
  transition: all 0.3s ease;
}
</style>
