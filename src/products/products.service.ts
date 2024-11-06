import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) { }

  // Metodo crear producto
  async create(createProductDto: CreateProductDto) {
    try {
      const role = this.productRepository.create(createProductDto)
      await this.productRepository.save(role)

      // Mensaje de exito tipo producto
      return {
        ok: true,
        message: 'Producto creado con exito',
        status: 201,
      };

    } catch (error) {
      return {
        // Mensaje de error al crear el producto
        ok: false,
        message: 'Ocurrio un error al guardar el producto',
        status: 500,
      };
    }
  }

  // Metodo para encontrar todos los registros que hay en la tabla 
  async findAll() {
    try {
      const product = await this.productRepository.find(
        {
          where: { isActive: true },
        });

      if (product.length > 0) {
        return { ok: true, product, status: 200 };
      }

      return { ok: false, message: 'No se encontraron productos', status: 400 };

    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener los productos',
        status: 500,
      }
    }
  }

  async findOneByCode(code: number) {
    try {
      const product = await this.productRepository.findOne({ where: { code } })

      if (!product)
        return { ok: false, 
      message: 'ocurrio un error al encontrar el producto', 
      status: 404 }

      // Si el usuario si se encontro
      return { ok: true, product, status: 200 }
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al obtener el producto',
        status: 500,
      };
    }
  }


  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id }
      })

      // Si producto es diferente de null
      if (!product)
        return { ok: false, message: 'No se encontro el producto', status: 404 }

      // Si el usuario si se encontro
      return { ok: true, product, status: 200 };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un erro',
        status: 500,
      };

    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      product.name = updateProductDto.name;
      await this.productRepository.save(product);

      return {
        ok: true,
        message: 'Producto actualizado con exito',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al acualizar el producto',
        status: 500,
      };
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id, isActive: true } });

      if (!product) {
        return { ok: false, status: 400 }
      }
      product.isActive = false;

      await this.productRepository.save(product);

      return {
        ok: true,
        message: 'Producto eliminado con exito',
        status: 200,
      }
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrio un error al intentar eliminar el producto',
        status: 500,
      };
    }
  }
}
