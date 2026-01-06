import { HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs';

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {} as any);
}

function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {} as any);
}

function transformUrlToSnakeCase(url: string): string {
  return url.replace(/([?&][^=&]*)=([^&]*)/g, (match: string, param: string, value: string) => {
    const snakeParam = param.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
    const snakeValue = value.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    return `${snakeParam}=${snakeValue}`;
  });
}

export const caseTransformInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req;

  const transformedUrl = transformUrlToSnakeCase(req.url);

  if (req.body) {
    modifiedReq = req.clone({
      url: transformedUrl,
      body: toSnakeCase(req.body),
    });
  } else if (transformedUrl !== req.url) {
    modifiedReq = req.clone({
      url: transformedUrl,
    });
  }

  return next(modifiedReq).pipe(
    map((event) => {
      if (event.type === 4 && event.body) {
        return event.clone({ body: toCamelCase(event.body) });
      }
      return event;
    })
  );
};
