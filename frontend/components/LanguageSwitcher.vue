<template>
  <div class="language-dropdown">
    <!-- 当前语言显示 -->
    <div class="selected-language" @click="toggleDropdown">
      <span class="current-language">{{ currentLocaleName }}</span>
      <span class="dropdown-arrow">▼</span>
    </div>
    
    <!-- 下拉菜单 -->
    <div class="dropdown-menu" v-if="isDropdownOpen">
      <button
        v-for="lang in availableLocales"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="language-option"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

// 控制下拉菜单显示状态
const isDropdownOpen = ref(false);

// 获取当前语言名称
const currentLocaleName = computed(() => {
  const current = locales.value.find(l => l.code === locale.value);
  return current ? current.name : locale.value;
});

// 获取其他可用语言
const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value);
});

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 关闭下拉菜单的函数 (点击文档其他区域时使用)
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// 切换语言
const changeLanguage = (langCode) => {
  // 先关闭下拉菜单
  isDropdownOpen.value = false;
  
  // 尝试获取路径（用于调试）
  const path = switchLocalePath(langCode);
  console.log(`切换到语言: ${langCode}, 路径: ${path}`);
  
  // 直接设置语言
  setLocale(langCode);
};

// 点击页面其他地方关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (event) => {
    // 如果点击的不是下拉菜单区域，则关闭下拉菜单
    if (!event.target.closest('.language-dropdown')) {
      closeDropdown();
    }
  });
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.language-dropdown {
  position: relative;
  display: inline-block;
  min-width: 120px;
}

.selected-language {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(37, 117, 252, 0.3);
}

.selected-language:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 117, 252, 0.4);
}

.dropdown-arrow {
  margin-left: 8px;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.language-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.current-language {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  width: 100%;
  z-index: 1000;
  transform-origin: top center;
  animation: dropdownAppear 0.2s ease;
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-option {
  display: block;
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

/* 为不同语言设置不同的悬停颜色 */
.language-option:nth-child(1):hover {
  background-color: rgba(255, 99, 71, 0.1);
  color: #ff6347; /* 西红柿色 */
}

.language-option:nth-child(2):hover {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71; /* 翡翠绿 */
}

.language-option:nth-child(3):hover {
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db; /* 闪光蓝 */
}

.language-option:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style>