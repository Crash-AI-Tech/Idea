<template>
  <div class="bg-white rounded-lg shadow-sm border border-tech-gray-200 p-8 mb-8 relative">
    <!-- 编辑和删除按钮 (如果是用户自己的点子) -->
    <div v-if="user && idea.user_id === user.id" class="absolute top-4 right-4 flex space-x-2">
      <button 
        @click="toggleEditMode"
        class="bg-tech-gray-100 hover:bg-tech-gray-200 p-2 rounded-full text-tech-gray-600 hover:text-primary-green transition-colors duration-200"
        :title="$t('idea.editButton')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button 
        @click="onDeleteClick"
        class="bg-tech-gray-100 hover:bg-tech-gray-200 p-2 rounded-full text-tech-gray-600 hover:text-red-500 transition-colors duration-200"
        :title="$t('idea.deleteButton')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
    
    <!-- 显示模式 -->
    <template v-if="!isEditing">
      <h1 class="text-3xl font-bold text-tech-gray-800 mb-4">{{ idea.title }}</h1>
      
      <!-- 标签 -->
      <div v-if="processedTags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in processedTags" 
          :key="tag" 
          class="inline-block px-3 py-1 text-sm bg-light-green text-primary-green rounded-full"
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
    </template>
    
    <!-- 编辑模式 -->
    <template v-else>
      <form @submit.prevent="saveChanges" class="space-y-4">
        <div class="mb-4">
          <label for="edit-title" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.titleLabel') }}</label>
          <input 
            type="text" 
            id="edit-title" 
            v-model="editForm.title" 
            required 
            class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            :placeholder="$t('idea.titlePlaceholder')"
          />
        </div>
        
        <div class="mb-4">
          <label for="edit-description" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.descriptionLabel') }}</label>
          <textarea 
            id="edit-description" 
            v-model="editForm.description" 
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
              v-for="(tag, index) in editForm.tags" 
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
        
        <div class="flex items-center space-x-4">
          <button 
            type="submit" 
            :disabled="updateLoading"
            class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition duration-200 ease-in-out disabled:opacity-50"
          >
            {{ updateLoading ? $t('common.loading') : $t('idea.updateButton') }}
          </button>
          <button 
            type="button"
            @click="cancelEdit"
            class="inline-block align-baseline font-medium text-sm text-tech-gray-600 hover:text-tech-gray-800 py-2 px-4"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>
        
        <div v-if="updateError" class="mt-4 text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md">
          {{ updateError }}
        </div>
        <div v-if="updateSuccess" class="mt-4 text-primary-green text-sm py-2 px-3 bg-light-green rounded-md">
          {{ updateSuccess }}
        </div>
      </form>
    </template>
    
    <div v-if="!isEditing" class="flex items-center space-x-4">
      <button 
        @click="onLikeClick"
        class="flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-200"
        :class="isLiked ? 'border-primary-green text-primary-green bg-opacity-10 bg-light-green' : 'border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green'"
        :disabled="!user || likeLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span>{{ likeCount }} {{ isLiked ? $t('idea.unlikeButton') : $t('idea.likeButton') }}</span>
      </button>
      
      <button 
        @click="onCommentClick"
        class="flex items-center space-x-2 px-4 py-2 rounded-full border border-tech-gray-300 text-tech-gray-600 hover:border-primary-green hover:text-primary-green transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span>{{ commentCount }} {{ $t('idea.commentButton') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n, computed, ref } from '#imports'
import { processTags, normalizeTags } from '~/utils/tagsHelper'

const { t } = useI18n()
const supabase = useSupabaseClient()

const props = defineProps({
  idea: {
    type: Object,
    required: true
  },
  user: {
    type: [Object, null],
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
    default: '未知用户' // 硬编码默认值，避免在props定义中使用t函数
  },
  formatDate: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['like', 'comment', 'delete', 'update'])

// 计算属性：处理标签数据，确保它总是一个字符串数组
const processedTags = computed(() => {
  return processTags(props.idea.tags);
});

// 编辑相关状态
const isEditing = ref(false)
const updateLoading = ref(false)
const updateError = ref(null)
const updateSuccess = ref(null)
const newTag = ref('')
const editForm = ref({
  title: '',
  description: '',
  tags: []
})

// 编辑相关方法
function toggleEditMode() {
  if (isEditing.value) {
    cancelEdit()
  } else {
    // 初始化编辑表单
    editForm.value = {
      title: props.idea.title,
      description: props.idea.description,
      tags: [...processedTags.value]
    }
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
  updateError.value = null
  updateSuccess.value = null
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !editForm.value.tags.includes(tag)) {
    editForm.value.tags.push(tag)
    newTag.value = ''
  }
}

function removeTag(index) {
  editForm.value.tags.splice(index, 1)
}

async function saveChanges() {
  if (!props.user) {
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
    const { data, error } = await supabase
      .from('ideas')
      .update({
        title: editForm.value.title.trim(),
        description: editForm.value.description.trim(),
        tags: editForm.value.tags.length > 0 ? normalizeTags(editForm.value.tags) : null
      })
      .eq('id', props.idea.id)
      .eq('user_id', props.user.id) // 确保只能更新自己的点子
      .select()

    if (error) throw error

    updateSuccess.value = t('idea.updateSuccess')
    
    // 通知父组件更新成功
    emit('update', data[0])
    
    // 短暂延迟后退出编辑模式
    setTimeout(() => {
      isEditing.value = false
      updateSuccess.value = null
    }, 1500)

  } catch (error) {
    console.error('Error updating idea:', error)
    updateError.value = error.message || t('idea.updateError')
  } finally {
    updateLoading.value = false
  }
}

// 交互事件
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
