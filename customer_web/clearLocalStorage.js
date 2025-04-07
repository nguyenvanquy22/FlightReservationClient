// clearLocalStorage.js
if (process.env.NODE_ENV === 'development') {
    localStorage.clear();
    console.log('LocalStorage đã được xóa.');
  }
  