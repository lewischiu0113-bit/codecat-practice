// 這個腳本用於在 Node.js 環境中初始化 Supabase 資料庫
// 執行方式: node init-database.js
// 注意：您需要在 Supabase Dashboard 的 SQL Editor 中執行 supabase-init.sql

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://tumnkqggbyvjzwrffuao.supabase.co';
const supabaseAnonKey = 'sb_publishable_tGgKUMW-rZe7U1zZUflBxQ_O0eQ9fXu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initDatabase() {
  console.log('開始初始化 Supabase 資料庫...');

  try {
    // 測試連線
    const { data, error } = await supabase.from('exams').select('count').limit(1);

    if (error) {
      console.error('❌ Supabase 連線失敗:', error.message);
      console.log('\n📝 請按照以下步驟操作：');
      console.log('1. 前往 Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. 選擇您的專案');
      console.log('3. 點擊左側選單的 "SQL Editor"');
      console.log('4. 複製 supabase-init.sql 檔案的內容');
      console.log('5. 貼上並執行 SQL 腳本');
      console.log('6. 執行完成後，重新運行此腳本驗證');
      return;
    }

    console.log('✅ Supabase 連線成功！');

    // 檢查是否有資料
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('*');

    if (examsError) {
      console.error('❌ 讀取資料錯誤:', examsError.message);
      return;
    }

    if (exams && exams.length > 0) {
      console.log(`✅ 資料庫已初始化，找到 ${exams.length} 個考試`);
      
      // 檢查問題
      const { data: questions } = await supabase
        .from('questions')
        .select('*');
      
      console.log(`✅ 找到 ${questions?.length || 0} 個問題`);
    } else {
      console.log('⚠️  資料庫表格已建立，但沒有資料');
      console.log('請在 Supabase Dashboard 的 SQL Editor 中執行 supabase-init.sql');
    }
  } catch (err) {
    console.error('❌ 初始化失敗:', err);
  }
}

initDatabase();

