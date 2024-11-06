import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
  ) { }

  // Metodo crear cliente
  async create(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto)
      await this.clientRepository.save(client);

      // Mensaje de exito tipo cliente con estado 201
      return {
        ok: true,
        message: 'Cliente creado con exito',
        status: 201,
      };

    } catch (error) {
      // Mensaje de error al crear el cliente
      return {
        ok: false,
        message: 'Ocurrio un error al guardar el cliente',
        status: 500,
      };
    }
  }

  // Metodo para encontrar todos los registros que hay en la tabla cliente
  async findAll() {
    try {
      // para buscar los productos verifico si estan activos
      const client = await this.clientRepository.find({ where: { isActive: true } });

      // Verifico si la longitud de cliente es mayor a cero
      if (client.length > 0)
        // Si es mayor a cero retornar true, devolver los clientes y el estado 200
        return { ok: true, client, status: 200 };

      // Si no se encontro nada retornar mensaje de error y el estado 400
      return { ok: false, message: 'No se encontraron clientes', status: 400 };
    } catch (error) {
      // Mensaje de error al obtener clientes estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al obtener los clientes',
        status: 500,
      };

    }
  }

  // Metodo para buscar un cliente por su Id
  async findOne(id: number) {
    try { 

      const client = await this.clientRepository.findOne({ where: { id } })

      // Verifico si cliente es diferente a null
      if (!client)
        // Si se cumple la condicion retorno un mensaje de error con estado 404
        return {
          ok: false,
          message: 'No se encontro el clienteee',
          status: 404,
        };

      // Si el cliente si se encontro retorno verdadero y devuelvo los clientes
      // con estado 200
      return { ok: true, client, status: 200 };

    } catch (error) {
      // Mensaje de error al obtener el cliente con estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al obtener el cliente',
        status: 500,
      };

    }
  }

  async findByDui(dui: number) {
    try {
      const client = await this.clientRepository.find({ where: { dui } })

      // Verifico si el client(dui) es null
      if (!client || client.length === 0)
        // Mensaje de error con estado 404
        return { ok: false, message: 'No se encontro el dui', status: 404 };

      // Si se econtro el dui retorno verdadero y devuelvo el dui con codigo 200
      return { ok: true, client, status: 200 }
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener el dui',
        satus: 500,
      };
    }

  }

  // Metodo para modificar un ciente por medio del id con findOne
  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.clientRepository.findOne({ where: { id } });

      // Establesco el nuevo valor a cada uno 
      client.name = updateClientDto.name;
      client.phone = updateClientDto.phone;
      client.dui = updateClientDto.dui;
      // Guardo los valores en la base de datos
      await this.clientRepository.save(client);

      // Retorno mensaje de exito al actualizar los datos con estado 200
      return {
        ok: true,
        message: 'Cliente actualizado con exito',
        status: 200,
      };
    } catch (error) {
      // Mensaje de error al actualizar los datos con estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al actualizar el cliente',
        status: 500,
      };
    }
  }

  // Metodo eliminar por medio del Id con findOne
  async remove(id: number) {
    try {
      // Busco el cliente por el id y verifico que este activo
      const client = await this.clientRepository.findOne({ where: { id, isActive: true } });

      // Verifico si el cliente es null
      if (!client)
        // Mesnsaje de error si se cumple la condicion con estado 400
        return { ok: false, message: 'No se encontro el cliente', status: 400 }

      // Paso el estado activo del cliente a falso
      client.isActive = false;

      // Guardo en la base 
      await this.clientRepository.save(client);

      // Mensaje de exito al eliminar el cliente con estado 200
      return {
        ok: true,
        message: 'Cliente eliminado con exito',
        status: 200,
      };
    } catch (error) {
      // Mensaje de error al eliminar el cliente con estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al eliminar el cliente',
        status: 500,
      };
    }
  }
}
