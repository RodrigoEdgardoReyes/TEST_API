import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { CreaateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchRoleDto } from './dto/search-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) { }

  // Metodo crear 
  async create(creaateRoleDto: CreaateRoleDto) {
    try {
      const role = this.roleRepository.create(creaateRoleDto)
      await this.roleRepository.save(role)

      return {
        ok: true,
        message: 'Creado con exito',
        status: 201,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al guardar el rol',
        status: 500,
      };
    }
  }

  // Metodo para encontrar todos los registros que hay en la tabla 
  /*async findAll() {
    try {
      const roles = await this.roleRepository.find(
        {
          where: { isActive: true },
        });

      if (roles.length > 0) {
        return { ok: true, roles, status: 200 };
      }

      return { ok: false, message: 'No se encontraron roles', status: 404 };

    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener los roles',
        status: 500,
      };
    }
  }*/

    async findAll({name, limit, page}: SearchRoleDto): Promise<object>{
      try {
        const [role, total] = await this.roleRepository.findAndCount({
          where: {
            name: Like(`%${name}%`),
            isActive: true,
          },
          order: {id: 'DESC'},
          skip: (page - 1) * limit,
          take: limit,
        });

        // Evaluo si la longitud de role es mayor a cero
        if(role.length > 0){
          // Calculo del total de paginas
          let totalPag: number = Math.ceil(total / limit);
          let nextPag: number = page >= totalPag ? page : page + 1;
          let prevPag: number = page <= 1 ? page : page - 1;

        return{
          ok: true,
          role,
          total,
          totalPag,
          currentPag: page,
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }

      return{
        ok: false,
        message: 'Role no encontrado',
        status: HttpStatus.NOT_FOUND,
      };
      } catch (error) {
        throw new InternalServerErrorException('Ocurrio un error al obtener los roles.', error)
      }
    }

  // Metodo para encontrar un registro en especifico por medio del id
  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id }
      })
      // Si role es diferente de null
      if (!role)
        return { ok: false, message: 'No se encontro el rol', status: 404 }

      // Si el rol si se encontro
      return { ok: true, role, status: 200 };

    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error',
        status: 500,
      };
    }
  }

  async findPaginated({page, limit }: SearchRoleDto){
    try {
      const [roles, total] = await this.roleRepository.findAndCount({
        where: { isActive: true},
        skip: (page -1) * limit,
        take: limit,
      });

      if(roles.length > 0){
        let totalPag: number = total / limit;
        if (totalPag % 1 !== 0){
          totalPag = Math.trunc(totalPag) + 1;
        }

        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return{
          ok: true,
          roles,
          total,
          totalPag,
          currentPag: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }

      return{
        ok: false,
        message: 'Roles no encontrados',
        status: 400,
      };
    } catch (error) {
      return {
        ok: false,
        message:`Error: $(error.message)`,
        status: 400,
      };
    }
  }
  // Metodo para actualizar
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const rol = await this.roleRepository.findOne({ where: { id } });

      rol.name = updateRoleDto.name;
      await this.roleRepository.save(rol);

      return {
        ok: true,
        message: 'Actualizado con exito',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al actualizar',
        staus: 500,
      };
    }
  }

  // Metodo eliminar
  async remove(id: number) {
    try {
      const rol = await this.roleRepository.findOne({ where: { id } });

      rol.isActive = false;

      await this.roleRepository.save(rol);

      return {
        ok: true,
        message: 'Eliminado con exito',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al intentar eliminar el registro',
        satus: 500,
      };
    }
  }

}