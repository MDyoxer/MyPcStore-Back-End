import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin.service';
import { ClientsService } from 'src/clients/clients.service';
import type { Request } from 'express';
import type { AuthenticatedClient } from '../types/authenticated-client';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly clientsService: ClientsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedClient }>();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const idToken = authHeader.slice(7);
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await this.firebaseAdminService.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    const client = await this.clientsService.findByFirebaseUid(
      decodedToken.uid,
    );
    if (!client) {
      throw new UnauthorizedException('Client not registered');
    }
    request.user = client;
    return true;
  }
}
