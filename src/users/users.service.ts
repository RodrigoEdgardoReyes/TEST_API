import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) { }

  // Crear usuario 
  async create(creaateUserDto: CreateUserDto) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: creaateUserDto.roleId }
      })

      if (!role) {
        return {
          ok: false,
          message: 'rol no encontrado',
          status: 404,
        };
      }

      const user = new User();
      user.userName = creaateUserDto.userName;
      user.password = creaateUserDto.password;
      user.dui = creaateUserDto.dui;
      user.email = "";
      user.address = creaateUserDto.address;
      user.role = role;
      
      user.hashPassword();

      // Guardo el usuario en la base de datos
      await this.userRepository.save(user)

      // Mensaje de exito si el usuario se creo correctamente con estado 201
      return {
        ok: true,
        message: 'Usuario creado con exito',
        status: 201,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al guardar el usuario',
        status: 500,
      };
    }
  }

  // Metodo para encontrar todos los registros que hay en la tabla 
  async findAll() {
    try {
      const user = await this.userRepository.find(
        {
          where: { isActive: true },
        });

      if (user.length > 0) {
        return { ok: true, user, status: 200 };
      }

      return { ok: false, message: 'No se encontraron usuarios', status: 404 };

    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener los usuarios',
        status: 500,
      };
    }
  }

  // Metodo para encontrar un registro en especifico por medio del id
  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      })
      // Si usuario es diferente de null
      if (!user)
        return { ok: false, message: 'No se encontro el usuario', status: 404 }

      // Si el usuario si se encontro
      return { ok: true, user, status: 200 };

    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error',
        status: 500,
      };
    }
  }

  // Metodo para actualizar
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      user.userName = updateUserDto.userName;
      user.password = updateUserDto.password;
      user.dui = updateUserDto.dui;
      user.email = updateUserDto.email;
      user.address = updateUserDto.address;
      await this.userRepository.save(user);

      return {
        ok: true,
        message: 'Usuario actualizado con exito',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al actualizar el usuario',
        staus: 500,
      };
    }
  }

  // Metodo eliminar
  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id, isActive: true } });
      // Verifico si usuario es null 
      if (!user) {
        // Si es null retorno falso con estado 400
        return { ok: false, status: 400 }
      }
      user.isActive = false;

      await this.userRepository.save(user);

      return {
        ok: true,
        message: 'Usuario eliminado con exito',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al intentar eliminar el usuario',
        satus: 500,
      };  
    }
  }
}
