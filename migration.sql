-- 查询当前所有没有昵称信息的用户
-- 创建临时表来保存 idea 的创建者昵称，以便我们可以将它们添加到用户元数据中
CREATE TEMP TABLE users_without_nickname AS
SELECT DISTINCT i.user_id, i.creator_nickname 
FROM ideas i
WHERE i.creator_nickname IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = i.user_id 
    AND u.raw_user_meta_data->>'nickname' IS NOT NULL
);

-- 添加从评论中找到的用户昵称
INSERT INTO users_without_nickname
SELECT DISTINCT c.user_id, c.user_nickname 
FROM comments c
WHERE c.user_nickname IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM users_without_nickname u 
    WHERE u.user_id = c.user_id
)
AND NOT EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id = c.user_id 
    AND u.raw_user_meta_data->>'nickname' IS NOT NULL
);

-- 检索需要更新的用户ID和昵称（这些需要通过管理API更新）
SELECT user_id, creator_nickname as nickname 
FROM users_without_nickname;

-- 修改 ideas 表结构，删除冗余的 creator_nickname 列
ALTER TABLE public.ideas DROP COLUMN IF EXISTS creator_nickname;

-- 修改 comments 表结构，删除冗余的 user_nickname 列
ALTER TABLE public.comments DROP COLUMN IF EXISTS user_nickname;

-- 最后删除临时表
DROP TABLE IF EXISTS users_without_nickname;
