// 自定義認證工具函數
import { supabase } from '../lib/supabase';

// 註冊用戶
export const registerUser = async (username, password) => {
  try {
    const { data, error } = await supabase.rpc('register_user', {
      p_username: username,
      p_password: password,
    });

    if (error) {
      console.error('註冊錯誤:', error);
      return {
        success: false,
        error: error.message || '註冊失敗，請稍後再試',
      };
    }

    if (data && data.success) {
      return {
        success: true,
        user: {
          id: data.user_id,
          username: data.username,
        },
      };
    } else {
      return {
        success: false,
        error: data?.error || '註冊失敗，請稍後再試',
      };
    }
  } catch (err) {
    console.error('註冊異常:', err);
    return {
      success: false,
      error: '註冊時發生錯誤，請稍後再試',
    };
  }
};

// 登入用戶
export const loginUser = async (username, password) => {
  try {
    const { data, error } = await supabase.rpc('verify_user_login', {
      p_username: username,
      p_password: password,
    });

    if (error) {
      console.error('登入錯誤:', error);
      return {
        success: false,
        error: error.message || '登入失敗，請檢查您的帳號密碼',
      };
    }

    if (data && data.success) {
      // 將用戶資訊存儲到 localStorage
      const userSession = {
        user_id: data.user_id,
        username: data.username,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('user_session', JSON.stringify(userSession));

      return {
        success: true,
        user: {
          id: data.user_id,
          username: data.username,
        },
      };
    } else {
      return {
        success: false,
        error: data?.error || '使用者名稱或密碼錯誤',
      };
    }
  } catch (err) {
    console.error('登入異常:', err);
    return {
      success: false,
      error: '登入時發生錯誤，請稍後再試',
    };
  }
};

// 登出用戶
export const logoutUser = () => {
  localStorage.removeItem('user_session');
  return { success: true };
};

// 獲取當前用戶 session
export const getCurrentUser = () => {
  try {
    const sessionStr = localStorage.getItem('user_session');
    if (!sessionStr) {
      return null;
    }

    const session = JSON.parse(sessionStr);
    return {
      id: session.user_id,
      username: session.username,
    };
  } catch (err) {
    console.error('獲取用戶 session 錯誤:', err);
    return null;
  }
};

// 檢查用戶是否已登入
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

