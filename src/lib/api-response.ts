export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: any;
}

export function apiSuccess<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta
  };
}

export function apiError(message: string, errorDetails?: any): ApiResponse<null> {
  // Silent structured log
  console.error(`[API_ERROR_RESILIENCE] ${message}`, errorDetails || '');
  return {
    success: false,
    error: message,
    meta: errorDetails
  };
}

export async function safeExecution<T>(fn: () => Promise<T>, fallbackErrorMessage = "An unexpected server error occurred"): Promise<ApiResponse<T>> {
  try {
    const result = await fn();
    return apiSuccess(result);
  } catch (error: any) {
    return apiError(fallbackErrorMessage, error.message) as ApiResponse<T>;
  }
}

/**
 * apiFallback — API Kill-Switch Safety response.
 * Use in any catch block at route level to guarantee
 * { success: false, fallback: true } is always returned.
 * NO uncaught exceptions allowed.
 */
export function apiFallback(message = "Using safe mode response"): { success: false; fallback: true; message: string } {
  console.error(`[API_KILL_SWITCH] ${message}`);
  return { success: false, fallback: true, message };
}

