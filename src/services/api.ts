import axios from "axios";

const baseURL = "http://192.168.1.33:3000";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para logar erros apenas no terminal (não aparece no Expo)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("Erro de resposta:", {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (error.request) {
      console.log("Erro de rede - sem resposta do servidor");
    } else {
      console.log("Erro na configuração da requisição:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
