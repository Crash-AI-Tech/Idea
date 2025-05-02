import { ref, onMounted, computed } from 'vue'
import type { Database } from '~/types/supabase'
import { processTags } from '~/utils/tagsHelper'

/**
 * 提供点子详情页面所需的数据和方法
 * @param ideaId 点子ID
 */
export function useIdeaDetail(ideaId: string) {
  const router = useRouter()
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const commentInputRef = ref<HTMLTextAreaElement | null>(null)

  // 状态变量
  const loading = ref(true)
  const error = ref<string | null>(null)
  const idea = ref<any>(null)
  const comments = ref<any[]>([])
  const likeCount = ref(0)
  const isLiked = ref(false)
  const commentLoading = ref(false)
  const likeLoading = ref(false)

  // 删除相关变量
  const showDeleteConfirm = ref(false)

  // 显示的创建者名称
  const creatorName = computed(() => {
    if (!idea.value) return '未知用户'
    if (idea.value.user_id === user.value?.id) return '你'
    
    // 使用从用户表中查询到的创建者信息
    if (idea.value.creator) {
      return idea.value.creator.nickname || '用户'
    }
    
    return '用户' // 默认值
  })

  onMounted(async () => {
    await Promise.all([
      fetchIdeaDetails(),
      fetchComments()
    ])
    
    if (user.value) {
      await checkIfLiked()
    }
  })

  // 获取点子详情
  async function fetchIdeaDetails() {
    try {
      loading.value = true
      error.value = null
      
      // 先获取点子信息
      const { data, error: err } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single()
      
      if (err) throw err
      if (!data) throw new Error('未找到该点子')
      
      // 确保标签被正确处理
      if (data.tags) {
        data.tags = processTags(data.tags);
      }
      
      // 再获取创建者信息
      if (data.user_id) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('raw_user_meta_data')
            .eq('id', data.user_id)
            .single()
          
          if (userData && userData.raw_user_meta_data) {
            data.creator = {
              nickname: userData.raw_user_meta_data.nickname
            }
          }
        } catch (userErr) {
          console.error('Error fetching creator info:', userErr)
        }
      }
      
      idea.value = data
      
      // 获取点赞数
      await fetchLikeCount()
    } catch (err: any) {
      console.error('Error fetching idea:', err)
      error.value = err.message || '获取点子详情失败'
    } finally {
      loading.value = false
    }
  }

  // 获取该点子的评论列表
  async function fetchComments() {
    try {
      // 获取评论信息
      const { data, error: err } = await supabase
        .from('comments')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false })
      
      if (err) throw err
      
      // 如果有评论，获取每个评论者的信息
      if (data && data.length > 0) {
        // 收集所有评论者ID
        const userIds = [...new Set(data.map(comment => comment.user_id))];
        
        // 批量获取用户信息
        const { data: usersData } = await supabase
          .from('users')
          .select('id, raw_user_meta_data')
          .in('id', userIds);
        
        // 用户ID -> 昵称的映射
        const userNicknames: Record<string, string | null> = {};
        if (usersData) {
          usersData.forEach(user => {
            if (user.id && user.raw_user_meta_data) {
              userNicknames[user.id] = user.raw_user_meta_data.nickname || null;
            }
          });
        }
        
        // 将用户昵称添加到评论数据中
        data.forEach(comment => {
          comment.commenter = {
            nickname: comment.user_id && userNicknames[comment.user_id] || null
          };
        });
      }
      
      comments.value = data || []
    } catch (err: any) {
      console.error('Error fetching comments:', err)
    }
  }

  // 获取点赞数量
  async function fetchLikeCount() {
    try {
      const { count, error: err } = await supabase
        .from('likes')
        .select('id', { count: 'exact' })
        .eq('idea_id', ideaId)
      
      if (err) throw err
      
      likeCount.value = count || 0
    } catch (err) {
      console.error('Error fetching like count:', err)
    }
  }

  // 检查当前用户是否已点赞
  async function checkIfLiked() {
    if (!user.value) return
    
    try {
      const { data, error: err } = await supabase
        .from('likes')
        .select('id')
        .eq('idea_id', ideaId)
        .eq('user_id', user.value.id)
        .maybeSingle()
      
      if (err) throw err
      
      isLiked.value = !!data
    } catch (err) {
      console.error('Error checking like status:', err)
    }
  }

  // 切换点赞状态
  async function toggleLike() {
    if (!user.value) return
    if (likeLoading.value) return
    
    try {
      likeLoading.value = true
      
      if (isLiked.value) {
        // 取消点赞
        const { error: err } = await supabase
          .from('likes')
          .delete()
          .eq('idea_id', ideaId)
          .eq('user_id', user.value.id)
        
        if (err) throw err
        
        isLiked.value = false
        likeCount.value = Math.max(0, likeCount.value - 1)
      } else {
        // 添加点赞
        const { error: err } = await supabase
          .from('likes')
          .insert({
            idea_id: ideaId,
            user_id: user.value.id
          })
        
        if (err) throw err
        
        isLiked.value = true
        likeCount.value += 1
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    } finally {
      likeLoading.value = false
    }
  }

  // 提交评论
  async function submitComment(content: string) {
    console.log('useIdeaDetail: submitComment called with content:', content);
    if (!user.value || !content.trim()) {
      console.log('useIdeaDetail: submitComment aborted. User:', !!user.value, 'Content:', content.trim());
      return
    }
    if (commentLoading.value) return

    try {
      commentLoading.value = true
      console.log('useIdeaDetail: Submitting comment to Supabase...');

      const { data, error: err } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          idea_id: ideaId,
          user_id: user.value.id
        })
        .select(`
          *,
          commenter:user_id (
            nickname:raw_user_meta_data->nickname
          )
        `)
        .single()

      if (err) {
        console.error('useIdeaDetail: Supabase error:', err);
        throw err
      }

      console.log('useIdeaDetail: Supabase response data:', data);

      if (data) {
        comments.value = [data, ...comments.value]
        console.log('useIdeaDetail: Comment added successfully.');
      } else {
         console.warn('useIdeaDetail: No data returned after insert.');
      }
    } catch (err: any) {
      console.error('Error submitting comment:', err)
      alert('提交评论失败：' + err.message)
    } finally {
      commentLoading.value = false
      console.log('useIdeaDetail: submitComment finished.');
    }
  }

  // 聚焦到评论输入框
  function focusCommentInput() {
    if (commentInputRef.value) {
      commentInputRef.value.focus()
      
      // 滚动到评论区
      document.getElementById('comments')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  // 删除点子相关函数
  function confirmDeleteIdea() {
    showDeleteConfirm.value = true
  }

  function cancelDelete() {
    showDeleteConfirm.value = false
  }

  async function deleteIdea() {
    if (!user.value || !idea.value) return
    
    try {
      // 首先删除相关的点赞和评论
      await Promise.all([
        // 删除点赞
        supabase
          .from('likes')
          .delete()
          .eq('idea_id', ideaId),
        
        // 删除评论
        supabase
          .from('comments')
          .delete()
          .eq('idea_id', ideaId)
      ])
      
      // 然后删除点子本身
      const { error: err } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', user.value.id) // 确保只能删除自己的点子
      
      if (err) throw err
      
      // 关闭对话框
      showDeleteConfirm.value = false
      
      // 跳转到首页
      router.push('/')
      
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('删除点子时出错')
      showDeleteConfirm.value = false
    }
  }

  // 格式化日期
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 更新点子
  function updateIdea(updatedIdea: any) {
    if (!updatedIdea) return
    
    // 确保标签被正确处理
    if (updatedIdea.tags) {
      updatedIdea.tags = processTags(updatedIdea.tags);
    }
    
    // 更新本地状态
    idea.value = updatedIdea
  }

  return {
    // 状态
    loading,
    error,
    idea,
    comments,
    likeCount,
    isLiked,
    commentLoading,
    likeLoading,
    showDeleteConfirm,
    commentInputRef,
    creatorName,
    user,

    // 方法
    fetchIdeaDetails,
    fetchComments,
    toggleLike,
    submitComment,
    focusCommentInput,
    confirmDeleteIdea,
    cancelDelete,
    deleteIdea,
    formatDate,
    updateIdea
  }
}
