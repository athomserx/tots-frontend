import { HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs';

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
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
    return obj.map(item => toSnakeCase(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {} as any);
}


export const caseTransformInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req;
  if (req.body) {
    modifiedReq = req.clone({
      body: toSnakeCase(req.body)
    });
  }

  return next(modifiedReq).pipe(
    map(event => {
      if (event.type === 4 && event.body) {
        return event.clone({ body: toCamelCase(event.body) });
      }
      return event;
    })
  );
};
