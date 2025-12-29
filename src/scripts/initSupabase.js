// 初始化 Supabase 資料庫的腳本
// 在 Supabase Dashboard 的 SQL Editor 中執行 supabase-init.sql 檔案

import { supabase } from '../lib/supabase.js';

// 這個函數可以用來驗證連線和測試資料
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase 連線錯誤:', error);
      return false;
    }

    console.log('Supabase 連線成功！', data);
    return true;
  } catch (err) {
    console.error('連線測試失敗:', err);
    return false;
  }
}

// 執行測試（可選）
// testSupabaseConnection();

