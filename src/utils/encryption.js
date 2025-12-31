// 簡單的加密/解密工具（用於保護清除歷史記錄的密碼）
// 注意：這是前端加密，主要用於防止誤觸，不是真正的安全加密

// 加密函數：使用 base64 編碼 + 簡單的字符替換
const encrypt = (text) => {
  // 先進行簡單的字符替換
  const replaced = text
    .split('')
    .map((char, index) => {
      const code = char.charCodeAt(0);
      // 根據位置進行簡單的偏移
      return String.fromCharCode(code + (index % 3) + 1);
    })
    .join('');
  
  // 然後進行 base64 編碼
  return btoa(replaced);
};

// 解密函數：反向操作
const decrypt = (encrypted) => {
  try {
    // 先解碼 base64
    const decoded = atob(encrypted);
    
    // 然後還原字符替換
    return decoded
      .split('')
      .map((char, index) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code - (index % 3) - 1);
      })
      .join('');
  } catch (error) {
    return null;
  }
};

// 加密後的密碼（原始密碼：c....8）
// 使用 encrypt('c....8') 生成
export const ENCRYPTED_PASSWORD = 'ZHFnZmVkdTM5OQ==';

// 驗證密碼
export const verifyPassword = (inputPassword) => {
  try {
    const decrypted = decrypt(ENCRYPTED_PASSWORD);
    return decrypted === inputPassword;
  } catch (error) {
    return false;
  }
};

