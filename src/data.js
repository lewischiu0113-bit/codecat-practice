// Supabase Database for Python DateTime Exam Platform
import { supabase } from './lib/supabase';

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
    // 檢查最近 5 秒內是否有完全相同的記錄（防止重複提交）
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    const { data: recentRecords } = await supabase
      .from('exam_records')
      .select('*')
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

// 獲取考試統計資訊
export const getExamStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('exam_records')
      .select('score, total, percentage');

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

// 為了向後兼容，導出一個同步版本的 exams（用於需要立即資料的地方）
// 這將返回一個空陣列，實際資料需要通過 getExams() 異步獲取
export const exams = [];
