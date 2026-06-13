import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ADMIN_API_KEY_HEADER } from '../../domain/constants';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const key = this.config.get<string>('ADMIN_API_KEY');
    if (!key) {
      if (this.config.get('NODE_ENV') === 'development') return true;
      throw new UnauthorizedException();
    }

    const req = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    if (req.headers[ADMIN_API_KEY_HEADER] === key) return true;
    throw new UnauthorizedException();
  }
}
