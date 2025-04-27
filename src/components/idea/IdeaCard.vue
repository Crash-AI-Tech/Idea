<template>
  <div class="bg-white rounded-lg shadow-sm border border-tech-gray-200 p-8 mb-8 relative">
    <!-- 删除按钮 (如果是用户自己的点子) -->
    <div v-if="user && idea.user_id === user.id" class="absolute top-4 right-4 flex space-x-2">
      <button 
        @click="onDeleteClick"
        class="bg-tech-gray-100 hover:bg-tech-gray-200 p-2 rounded-full text-tech-gray-600 hover:text-red-500 transition-colors duration-200"
        title="删除点子"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    
    <h1 class="text-3xl font-bold text-tech-gray-800 mb-4">{{ idea.title }}</h1>
    
    <!-- 标签 -->
    <div v-if="idea.tags && idea.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
      <span 
        v-for="tag in idea.tags" 
        :key="tag" 
        class="inline-block px-3 py-1 text-sm bg-light-green text-primary-green rounded-full"
      >
        {{ tag }}
      </span>
    </div>
    
    <div class="flex items-center text-sm text-tech-gray-500 mb-6">
      <span>{{ formatDate(idea.created_at) }}</span>
      <span class="mx-2">•</span>
      <span>创建者: {{ creatorName }}</span>
    </div>
    
    <div class="space-y-4 text-tech-gray-700 mb-8 leading-relaxed whitespace-pre-line">
      {{ idea.description }}
    </div>
    
    <div class="flex items-center space-x-4">
      <button 
        @click="onLikeClick"
        class="flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-200"
        :class="isLiked ? 'border-primary-green text-primary-green bg-opacity-10 bg-light-green' : 'border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green'"
        :disabled="!user || likeLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span>{{ likeCount }} {{ isLiked ? '已点赞' : '点赞' }}</span>
      </button>
      
      <button 
        @click="onCommentClick"
        class="flex items-center space-x-2 px-4 py-2 rounded-full border border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span>{{ commentCount }} 评论</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  idea: {
    type: Object,
    required: true
  },
  user: {
    type: [Object, null] as PropType<any | null>,
    default: null
  },
  likeCount: {
    type: Number,
    default: 0
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  likeLoading: {
    type: Boolean,
    default: false
  },
  commentCount: {
    type: Number,
    default: 0
  },
  creatorName: {
    type: String,
    default: '未知用户'
  },
  formatDate: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['like', 'comment', 'delete'])

function onLikeClick() {
  emit('like')
}

function onCommentClick() {
  emit('comment')
}

function onDeleteClick() {
  emit('delete')
}
</script>
