// supabase/functions/log-user-action/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"; // 使用 esm.sh 获取最新版本

// CORS Headers - 允许从任何源访问，实际生产中应配置为你的前端域名
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 处理 OPTIONS 预检请求 (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 从环境变量中获取 Supabase URL 和 Service Role Key
    // Service Role Key 拥有完全权限，可以绕过 RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Supabase URL or Service Key not found in environment variables."
      );
    }

    // 创建 Supabase Admin 客户端
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 解析请求体中的数据
    const { userId, title, content } = await req.json();

    if (!userId || !title || !content) {
      return new Response(
        JSON.stringify({ error: "Missing userId, title or content" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // 插入数据到 user_actions 表
    const { data, error } = await supabaseAdmin
      .from("contents")
      .insert([{ user_id: userId, title: title, content: content , created_at: new Date().toISOString() }])
      .select(); // 返回插入的数据

    if (error) {
      console.error("Error inserting data:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ message: "Action logged successfully", data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal Server Error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
