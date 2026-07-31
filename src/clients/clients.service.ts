import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) { }
  //create a new client
  create(createClientDto: CreateClientDto) {
    return this.prisma.tbl_clientes.create({
      data: {
        nombre_c: createClientDto.nombre_c,
        correo_c: createClientDto.correo_c,
        firebase_uid: createClientDto.firebase_uid,
      }
    });
  }

  //find the client by firebase uid
  async findByFirebaseUid(firebaseUid: string) {
    const client = await this.prisma.tbl_clientes.findUnique({
      where: { firebase_uid: firebaseUid },
      select: {
        id_c: true,
        nombre_c: true,
        correo_c: true,
        firebase_uid: true,
      }
    });
    if (!client) return null;
    return {
      id: client.id_c,
      nombre: client.nombre_c,
      correo: client.correo_c,
      firebaseId: client.firebase_uid,
    };
  }
  //find the client by email
  async findByEmail(email: string) {
    return this.prisma.tbl_clientes.findUnique({
      where: { correo_c: email },
    });
  }

  async findClient() {
    const response = await this.prisma.tbl_clientes.findMany();
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
