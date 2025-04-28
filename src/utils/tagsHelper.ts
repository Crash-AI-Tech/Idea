/**
 * 标签处理工具函数
 * 用于确保标签始终以字符串数组形式处理，无论其在数据库中的存储格式
 */

/**
 * 处理标签数据，确保它总是一个字符串数组
 * @param tags 需要处理的标签数据
 * @returns 处理后的标签数组
 */
export function processTags(tags: any): string[] {
  if (!tags) return [];
  
  // 如果已经是数组，直接返回
  if (Array.isArray(tags)) return tags;
  
  // 如果是字符串，尝试解析为JSON
  if (typeof tags === 'string') {
    try {
      const parsedTags = JSON.parse(tags);
      if (Array.isArray(parsedTags)) return parsedTags;
      
      // 如果解析成功但不是数组，可能是单个标签
      return [tags];
    } catch (e) {
      // 如果解析失败，说明可能是单个标签或使用特殊分隔符的字符串
      // 尝试使用常见分隔符分割
      if (tags.includes(',')) return tags.split(',').map(tag => tag.trim());
      if (tags.includes(';')) return tags.split(';').map(tag => tag.trim());
      if (tags.includes('|')) return tags.split('|').map(tag => tag.trim());
      
      // 如果都不是，则可能是单个标签
      return [tags];
    }
  }
  
  // 如果是其他类型，尝试转换为字符串
  return [String(tags)];
}

/**
 * 确保标签数据在存储到数据库前是规范化的
 * @param tags 需要规范化的标签数组或标签字符串
 * @returns 规范化后的标签数组
 */
export function normalizeTags(tags: string[] | string | null): string[] | null {
  if (!tags) return null;
  
  // 处理成数组
  const processedTags = processTags(tags);
  
  // 移除空标签并去重
  return processedTags
    .filter(tag => tag.trim() !== '')
    .filter((tag, index, self) => self.indexOf(tag) === index);
}

/**
 * 将标签数组格式化为显示用的字符串
 * @param tags 标签数组或标签数据
 * @param separator 分隔符，默认为逗号加空格
 * @returns 格式化后的字符串
 */
export function formatTagsToString(tags: any, separator: string = ', '): string {
  const processedTags = processTags(tags);
  return processedTags.join(separator);
}
