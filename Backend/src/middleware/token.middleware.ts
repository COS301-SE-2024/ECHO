import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as url from 'url';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestUrl = url.parse(req.url.valueOf());
        console.log("URL: " + requestUrl.href);
        const fragment = requestUrl.hash?.substring(1);
        if (fragment) {
            const params = new URLSearchParams(fragment);
            req.query.access_token = params.get('access_token');
            req.query.refresh_token = params.get('refresh_token');
        }
        next();
    }
}
