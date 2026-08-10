import { Controller, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('findClient')
  async findClient() {
    return await this.clientsService.findClient();
  }
}
