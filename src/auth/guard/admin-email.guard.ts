import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminEmailGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const user = context.switchToHttp().getRequest().user as { correo?: string } | undefined;
        const allowedEmails = this.configService
            .get<string>('ADMIN_EMAILS', '')
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);

        if (!user?.correo || !allowedEmails.includes(user.correo.toLowerCase())) {
            throw new ForbiddenException('Access denied: admin only');
        }
        return true;
    }
}