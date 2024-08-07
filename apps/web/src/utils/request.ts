import { ResponseCode } from '@/constants/code';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { refresh } from '@/apis/auth/refresh';
import { queryClient } from '@/utils/queryClient';
import { QUERY_KEYS } from '@/constants';
import { toast } from 'ui';
import { CONFIG } from '@/utils/config';

interface ApiResponse<T> {
  data: T;
  code: ResponseCode;
  message?: string;
}
const UNAUTHORIZED_STATUS_CODE = [401, 403];

const request = axios.create({
  baseURL: '/resume-generator-api',
  timeout: 1000 * 10, // 10s,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

request.interceptors.response.use(
  function (response: AxiosResponse<ApiResponse<any>>) {
    const { data } = response;

    switch (data.code) {
      case ResponseCode.Success: {
        return data.data;
      }
      case ResponseCode.Fail: {
        return Promise.reject(data);
      }
      // Todo: handle jwt token expired situation
      case ResponseCode.InvalidCredentials: {
        return window.history.replaceState(
          null,
          '',
          `${CONFIG.basePath}/auth/login?redirect=${window.location.pathname}`,
        );
      }
      default: {
        return data.data;
      }
    }
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
  },
  // Tip: handle status code >= 400
  function (error: AxiosError<ApiResponse<any>>) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Request Failed';
    const statusCode = error.response?.status;
    if (statusCode && !UNAUTHORIZED_STATUS_CODE.includes(+statusCode)) {
      toast({
        title: 'Oops, something wrong on the server',
        description: errorMsg,
        variant: 'destructive',
      });
    }

    // Do something with response error
    return Promise.reject(error);
  },
);

const requestForRefresh = axios.create({
  baseURL: '/resume-generator-api',
  timeout: 1000 * 10, // 10s,
});

const handleAuthError = async () => {
  try {
    // Tip: 这里如果调用 refresh 接口出现403 Forbidden 返回则会进入catch
    // 出现403的情况： cookie中的refresh token 和存储在user中的refreshToken不一样导致，暂时没找到原因
    // 出现的原因：
    // 1. 在 Postman Debug 接口的时候需要login 一下，而login的时候会重新设置 refreshToken，此时就会出现 user 的refreshToken与当前浏览器的refreshToken冲突的问题
    await refresh(requestForRefresh);
    return Promise.resolve();
  } catch (e) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    toast({
      title: 'Oops, something wrong on the server',
      description: 'Login please',
      variant: 'warning',
    });
    // FixBug: 这里的跳转由问题 不会自动跳转 需要手动刷新一下
    window.history.replaceState(
      null,
      '',
      `${CONFIG.basePath}/auth/login?redirect=${window.location.pathname}`,
    );

    return Promise.reject(e);
  }
};

// Interceptor to handle expired refresh token errors
const handleRefreshFailed = async () => {
  try {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    window.history.replaceState(
      null,
      '',
      `${CONFIG.basePath}/auth/login?redirect=${window.location.pathname}`,
    );
    return Promise.resolve();
  } catch (e) {
    window.history.replaceState(
      null,
      '',
      `${CONFIG.basePath}/auth/login?redirect=${window.location.pathname}`,
    );
    return Promise.reject(e);
  }
};

createAuthRefreshInterceptor(request, handleAuthError, {
  statusCodes: [401, 403],
});
createAuthRefreshInterceptor(requestForRefresh, handleRefreshFailed);

export default request;
