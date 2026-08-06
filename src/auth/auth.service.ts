import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { ClientsService } from 'src/clients/clients.service';
import { GoogleLoginDto } from './dto/auth-google.dto';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from 'generated/prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly clientsService: ClientsService,
  ) {}

  async login(googleLoginDto: GoogleLoginDto) {
    let decodedToken;
    try {
      decodedToken = await this.firebaseAdminService.verifyIdToken(
        googleLoginDto.idToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    const client = await this.clientsService.findByFirebaseUid(
      decodedToken.uid,
    );

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async register(registerDto: RegisterDto) {
    let decodedToken;
    try {
      decodedToken = await this.firebaseAdminService.verifyIdToken(
        registerDto.idToken,
      );
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const existing = await this.clientsService.findByFirebaseUid(uid);
    if (existing) {
      return existing; // idempotente: ya estaba registrado
    }

    const nombre =
      registerDto.nombre ||
      decodedToken.name ||
      email?.split('@')[0] ||
      'Cliente';

    try {
      return await this.clientsService.create({
        nombre_c: nombre,
        correo_c: email,
        firebase_uid: uid,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const byEmail = await this.clientsService.findByEmail(email);
        if (byEmail) return byEmail;
      }
      throw error;
    }
  }
}
