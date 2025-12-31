// Supabase Database for Python DateTime Exam Platform
import { supabase } from './lib/supabase';
import { getCurrentUser } from './utils/auth';

// 統一的答案驗證函數（確保計算分數和顯示結果使用相同邏輯）
export const checkAnswer = (question, userAnswer, debug = false) => {
  if (question.type === 'MCQ') {
    const result = userAnswer === question.correctAnswer;
    if (debug) {
      console.log(`[MCQ] 題目 ${question.id}:`, {
        userAnswer,
        correctAnswer: question.correctAnswer,
        result
      });
    }
    return result;
  } else if (question.type === 'Input') {
    if (!userAnswer) {
      if (debug) {
        console.log(`[Input] 題目 ${question.id}: 用戶答案為空`);
      }
      return false;
    }
    
    // 兩層驗證：先標準比對，失敗後再移除所有空格比對（大小寫必須一致）
    const normalizeBasic = (str) => {
      if (!str) return '';
      return str.trim();
    };
    
    const normalizeAllSpaces = (str) => {
      if (!str) return '';
      return str.replace(/\s+/g, '');
    };
    
    // 第一層：標準比對（只移除首尾空格，保留大小寫）
    const userBasic = normalizeBasic(userAnswer);
    const correctBasic = normalizeBasic(question.correctAnswer);
    
    if (userBasic === correctBasic) {
      if (debug) {
        console.log(`[Input] 題目 ${question.id}: 第一層驗證通過`, {
          userAnswer,
          correctAnswer: question.correctAnswer,
          userBasic,
          correctBasic
        });
      }
      return true;
    }
    
    // 第二層：移除所有空格後比對（保留大小寫）
    const userNoSpaces = normalizeAllSpaces(userAnswer);
    const correctNoSpaces = normalizeAllSpaces(question.correctAnswer);
    const result = userNoSpaces === correctNoSpaces;
    
    if (debug) {
      console.log(`[Input] 題目 ${question.id}: 驗證結果`, {
        userAnswer,
        correctAnswer: question.correctAnswer,
        userBasic,
        correctBasic,
        firstLayerMatch: userBasic === correctBasic,
        userNoSpaces,
        correctNoSpaces,
        secondLayerMatch: result,
        finalResult: result
      });
    }
    
    return result;
  }
  return false;
};

// 獲取所有考試
export const getExams = async () => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('id');

    if (error) {
      console.error('獲取考試列表錯誤:', error);
      return [];
    }

    // 為每個考試獲取問題
    const examsWithQuestions = await Promise.all(
      data.map(async (exam) => {
        const questions = await getQuestionsByExamId(exam.id);
        return {
          ...exam,
          questions: questions.sort((a, b) => a.question_order - b.question_order),
        };
      })
    );

    return examsWithQuestions;
  } catch (err) {
    console.error('獲取考試錯誤:', err);
    return [];
  }
};

// 根據考試 ID 獲取問題
const getQuestionsByExamId = async (examId) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId)
      .order('question_order');

    if (error) {
      console.error('獲取問題錯誤:', error);
      return [];
    }

    // 轉換資料格式以符合組件需求
    return data.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    }));
  } catch (err) {
    console.error('獲取問題錯誤:', err);
    return [];
  }
};

// 根據 ID 獲取單個考試（包含問題）
export const getExamById = async (id) => {
  try {
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (examError) {
      console.error('獲取考試錯誤:', examError);
      return null;
    }

    const questions = await getQuestionsByExamId(exam.id);

    return {
      ...exam,
      questions: questions.sort((a, b) => a.question_order - b.question_order),
    };
  } catch (err) {
    console.error('獲取考試錯誤:', err);
    return null;
  }
};

// 計算分數
export const calculateScore = (exam, answers) => {
  let correct = 0;
  console.log('=== 開始計算分數 ===');
  console.log('考試:', exam.title);
  console.log('總題數:', exam.questions.length);
  console.log('用戶答案:', answers);
  
  exam.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = checkAnswer(question, userAnswer, true);
    
    if (isCorrect) {
      correct++;
    }
    
    console.log(`題目 ${index + 1} (ID: ${question.id}):`, {
      類型: question.type,
      用戶答案: userAnswer,
      正確答案: question.correctAnswer,
      是否正確: isCorrect,
      目前得分: `${correct}/${index + 1}`
    });
  });
  
  const result = {
    correct,
    total: exam.questions.length,
    percentage: Math.round((correct / exam.questions.length) * 100),
  };
  
  console.log('=== 分數計算完成 ===');
  console.log('最終得分:', result);
  console.log('正確題數:', result.correct);
  console.log('總題數:', result.total);
  console.log('正確率:', result.percentage + '%');
  
  return result;
};

// 儲存考試記錄
export const saveExamRecord = async (examId, score, answers) => {
  try {
    // 獲取當前用戶
    const user = getCurrentUser();
    if (!user) {
      console.error('用戶未登入');
      return null;
    }

    // 檢查最近 5 秒內是否有完全相同的記錄（防止重複提交）
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    const { data: recentRecords } = await supabase
      .from('exam_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('exam_id', parseInt(examId))
      .eq('score', score.correct)
      .eq('total', score.total)
      .eq('percentage', score.percentage)
      .gte('completed_at', fiveSecondsAgo)
      .order('completed_at', { ascending: false })
      .limit(1);

    // 如果有完全相同的記錄在最近 5 秒內，則不重複保存
    if (recentRecords && recentRecords.length > 0) {
      console.log('檢測到重複記錄，跳過保存');
      return recentRecords[0];
    }

    const { data, error } = await supabase
      .from('exam_records')
      .insert({
        user_id: user.id, // 關聯當前用戶
        exam_id: parseInt(examId),
        score: score.correct,
        total: score.total,
        percentage: score.percentage,
        answers: answers, // 儲存為 JSONB
      })
      .select()
      .single();

    if (error) {
      console.error('儲存考試記錄錯誤:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('儲存考試記錄錯誤:', err);
    return null;
  }
};

// 獲取所有考試記錄（包含考試資訊）
export const getExamRecords = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('用戶未登入，無法獲取考試記錄');
      return [];
    }

    const { data, error } = await supabase
      .from('exam_records')
      .select(`
        *,
        exams (
          id,
          title,
          difficulty
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('獲取考試記錄錯誤:', error);
      return [];
    }

    // 格式化資料
    return data.map((record) => ({
      id: record.id,
      examId: record.exam_id,
      examTitle: record.exams?.title || '未知考試',
      difficulty: record.exams?.difficulty || '',
      score: record.percentage,
      correct: record.score,
      total: record.total,
      date: new Date(record.completed_at).toLocaleString('zh-TW'),
      completedAt: record.completed_at,
    }));
  } catch (err) {
    console.error('獲取考試記錄錯誤:', err);
    return [];
  }
};

// 獲取最近的考試記錄（限制數量）
export const getRecentExamRecords = async (limit = 5) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('用戶未登入，無法獲取最近考試記錄');
      return [];
    }

    const { data, error } = await supabase
      .from('exam_records')
      .select(`
        *,
        exams (
          id,
          title,
          difficulty
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('獲取最近考試記錄錯誤:', error);
      return [];
    }

    return data.map((record) => ({
      id: record.id,
      examId: record.exam_id,
      examTitle: record.exams?.title || '未知考試',
      difficulty: record.exams?.difficulty || '',
      score: record.percentage,
      correct: record.score,
      total: record.total,
      date: new Date(record.completed_at).toLocaleString('zh-TW'),
      completedAt: record.completed_at,
    }));
  } catch (err) {
    console.error('獲取最近考試記錄錯誤:', err);
    return [];
  }
};

// 獲取考試統計資訊（只統計當前用戶的記錄）
export const getExamStatistics = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('用戶未登入，無法獲取統計資訊');
      return {
        totalCompleted: 0,
        averageScore: 0,
      };
    }

    const { data, error } = await supabase
      .from('exam_records')
      .select('score, total, percentage')
      .eq('user_id', user.id);

    if (error) {
      console.error('獲取統計資訊錯誤:', error);
      return {
        totalCompleted: 0,
        averageScore: 0,
      };
    }

    if (!data || data.length === 0) {
      return {
        totalCompleted: 0,
        averageScore: 0,
      };
    }

    const totalCompleted = data.length;
    const averageScore = Math.round(
      data.reduce((sum, record) => sum + record.percentage, 0) / totalCompleted
    );

    return {
      totalCompleted,
      averageScore,
    };
  } catch (err) {
    console.error('獲取統計資訊錯誤:', err);
    return {
      totalCompleted: 0,
      averageScore: 0,
    };
  }
};

// 刪除所有考試記錄（只刪除當前用戶的記錄）
export const deleteAllExamRecords = async () => {
  console.log('[刪除記錄] 開始執行刪除操作...');
  
  try {
    // 獲取當前用戶
    const user = getCurrentUser();
    if (!user) {
      console.error('[刪除記錄] ❌ 用戶未登入');
      return { success: false, error: '用戶未登入' };
    }

    // 步驟1: 獲取當前用戶所有記錄的 ID
    console.log('[刪除記錄] 步驟1: 獲取當前用戶所有記錄 ID...');
    const { data: allRecords, error: fetchError } = await supabase
      .from('exam_records')
      .select('id')
      .eq('user_id', user.id);

    if (fetchError) {
      console.error('[刪除記錄] ❌ 獲取記錄錯誤:', fetchError);
      console.error('[刪除記錄] 錯誤詳情:', JSON.stringify(fetchError, null, 2));
      return { success: false, error: fetchError };
    }

    const recordCount = allRecords ? allRecords.length : 0;
    console.log('[刪除記錄] ✓ 當前記錄數量:', recordCount);
    console.log('[刪除記錄] 記錄 ID 列表:', allRecords?.map(r => r.id) || []);

    if (recordCount === 0) {
      console.log('[刪除記錄] ⚠️ 沒有記錄需要刪除');
      return { success: true, deletedCount: 0 };
    }

    // 步驟2: 逐個刪除每個記錄（更可靠的方式）
    console.log('[刪除記錄] 步驟2: 執行逐個刪除操作...');
    const ids = allRecords.map(r => r.id);
    console.log('[刪除記錄] 將刪除的 ID:', ids);
    
    let successCount = 0;
    let failCount = 0;
    const failedIds = [];
    
    for (const record of allRecords) {
      console.log(`[刪除記錄] 正在刪除 ID ${record.id}...`);
      
      const { data: deleteData, error: deleteError } = await supabase
        .from('exam_records')
        .delete()
        .eq('id', record.id)
        .select(); // 添加 select() 以獲取被刪除的記錄
      
      console.log(`[刪除記錄] ID ${record.id} 刪除結果:`);
      console.log(`[刪除記錄]   - data:`, deleteData);
      console.log(`[刪除記錄]   - error:`, deleteError);
      
      if (deleteError) {
        console.error(`[刪除記錄] ❌ 刪除 ID ${record.id} 失敗:`, deleteError);
        console.error(`[刪除記錄]   錯誤詳情:`, JSON.stringify(deleteError, null, 2));
        failCount++;
        failedIds.push(record.id);
      } else {
        // 檢查是否真的刪除了（data 應該包含被刪除的記錄）
        if (deleteData && deleteData.length > 0) {
          console.log(`[刪除記錄] ✓ 刪除 ID ${record.id} 成功，已刪除記錄:`, deleteData);
          successCount++;
        } else {
          console.warn(`[刪除記錄] ⚠️ 刪除 ID ${record.id} 沒有返回數據，可能未成功`);
          // 驗證這個 ID 是否還存在
          const { data: verifyData } = await supabase
            .from('exam_records')
            .select('id')
            .eq('id', record.id)
            .single();
          
          if (verifyData) {
            console.error(`[刪除記錄] ❌ ID ${record.id} 仍然存在於資料庫中！`);
            failCount++;
            failedIds.push(record.id);
          } else {
            console.log(`[刪除記錄] ✓ ID ${record.id} 已成功刪除（驗證通過）`);
            successCount++;
          }
        }
      }
    }
    
    console.log(`[刪除記錄] 刪除結果總結: 成功 ${successCount} 個，失敗 ${failCount} 個`);
    if (failedIds.length > 0) {
      console.error(`[刪除記錄] 失敗的 ID:`, failedIds);
    }
    
    if (failCount > 0) {
      return { 
        success: false, 
        error: `部分刪除失敗，成功: ${successCount}, 失敗: ${failCount}，失敗的 ID: ${failedIds.join(', ')}` 
      };
    }

    // 步驟3: 驗證刪除是否成功
    console.log('[刪除記錄] 步驟3: 驗證刪除結果...');
    const { count: afterCount, error: verifyError } = await supabase
      .from('exam_records')
      .select('*', { count: 'exact', head: true });

    if (verifyError) {
      console.error('[刪除記錄] ⚠️ 驗證刪除結果時發生錯誤:', verifyError);
    } else {
      console.log('[刪除記錄] ✓ 刪除後記錄數量:', afterCount);
      if (afterCount > 0) {
        console.error('[刪除記錄] ❌ 警告：刪除後仍有記錄存在！刪除可能未成功');
        // 獲取剩餘記錄以便調試
        const { data: remaining } = await supabase
          .from('exam_records')
          .select('id');
        console.error('[刪除記錄] 剩餘記錄 ID:', remaining?.map(r => r.id) || []);
      } else {
        console.log('[刪除記錄] ✓ 刪除成功，所有記錄已清除');
      }
    }

    console.log('[刪除記錄] ✓ 操作完成');
    return { success: true, deletedCount: recordCount };
  } catch (err) {
    console.error('[刪除記錄] ❌ 刪除考試記錄異常:', err);
    console.error('[刪除記錄] 異常詳情:', JSON.stringify(err, null, 2));
    return { success: false, error: err };
  }
};

// 為了向後兼容，導出一個同步版本的 exams（用於需要立即資料的地方）
// 這將返回一個空陣列，實際資料需要通過 getExams() 異步獲取
export const exams = [];
