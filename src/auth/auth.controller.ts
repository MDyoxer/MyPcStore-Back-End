import { Body, Controller, Post, Req, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/auth-google.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminEmailGuard } from './guard/admin-email.guard';
import { FirebaseAuthGuard } from './guard/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("me") 
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  me(@Req() req: { user: unknown }) {
  return req.user;  
}
  @Post('login')
  login(@Body() GoogleLoginDto: GoogleLoginDto) {
    return this.authService.login(GoogleLoginDto);
  }
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
