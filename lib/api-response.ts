import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | any;
}

export function successResponse<T>(
  data: T,
  paginationOrMessage?: PaginationMeta | string,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  if (paginationOrMessage) {
    if (typeof paginationOrMessage === "object") {
      body.pagination = paginationOrMessage;
    }
  }

  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  errors?: any,
  status = 400
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    body.errors = errors;
  }

  return NextResponse.json(body, { status });
}
