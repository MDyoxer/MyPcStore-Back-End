import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { ClientsModule } from '../clients/clients.module';
import { AdminEmailGuard } from './guard/admin-email.guard';

@Module({
  imports: [ClientsModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdminService,AdminEmailGuard],
  exports: [FirebaseAdminService,AdminEmailGuard],
})
export class AuthModule {}
