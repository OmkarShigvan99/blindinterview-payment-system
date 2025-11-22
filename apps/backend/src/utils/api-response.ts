// src/utils/ApiResponse.ts

type Meta = Record<string, string | number> | null;

export class ApiResponse<T> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly data: T | null;
    public readonly meta: Meta;

    constructor(success: boolean, message: string, data: T | null = null, meta: Meta = null) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }

    static success<T>(data: T, message = 'Success', meta: Meta = null): ApiResponse<T> {
        return new ApiResponse<T>(true, message, data, meta);
    }

    static error(message = 'Something went wrong', meta: Meta = null): ApiResponse<null> {
        return new ApiResponse<null>(false, message, null, meta);
    }
}
