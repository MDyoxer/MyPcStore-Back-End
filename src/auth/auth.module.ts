import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class AuthModule {}
