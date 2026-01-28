import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL, // use .env var for base url
    withCredentials:true, // imp for cookies thst handled by BE
    // timeout:10000,
    // headers:{
    //     'Content-Type':'application/json'
    // }
});

axiosInstance.interceptors.request.use((config) => {
    console.log(`📤 إرسال: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
},
(error) => {
    console.error('❌ خطأ في الطلب:', error);
    return Promise.reject(error);
}
);
axiosInstance.interceptors.response.use((response) => {
    console.log(`📥 استلام: ${response.status} ${response.config.url}`);
    return response;
},
(error) => {
    console.error('❌ خطأ في الرد:', error.response?.status, error.config.url);
    
    // إذا كان خطأ 401 (غير مصرح)
    if (error.response?.status === 401) {
      console.log('🔐 خطأ 401 - غير مصرح');
      // توجيه لصفحة الدخول
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    if(error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.replace("/dashboard") // note: make sure this work 
      }
    }
    
    return Promise.reject(error);
}
);

export default axiosInstance;
