import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Get status code from response
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Get custom message from metadata if exists
        const message =
          this.reflector.get<string>("responseMessage", context.getHandler()) ||
          "Operation completed successfully";

        // If data already has status and message, use that
        if (data && data.status && data.message) {
          return data;
        }

        // If data is paginated
        if (data && data.data && data.meta) {
          return {
            status: "success",
            message: message,
            data: data.data,
            meta: data.meta,
          };
        }

        // If data is an array (list)
        if (Array.isArray(data)) {
          return {
            status: "success",
            message: message,
            data: data,
            total: data.length,
          };
        }

        // Default response
        return {
          status: "success",
          message: message,
          data: data,
        };
      }),
    );
  }
}
