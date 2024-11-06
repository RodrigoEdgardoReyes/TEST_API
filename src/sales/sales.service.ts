import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { CreateDetailSaleDto } from 'src/detail-sale/dto/create-detail-sale.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private readonly salesRepository: Repository<Sale>,
    @InjectRepository(DetailSale) private readonly detailSaleRepository: Repository<DetailSale>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) { }

  async create(createSaleDto: CreateSaleDto, createDetailSaleDto: CreateDetailSaleDto) {  
    try {
      // Busco el usuario en la base de datos usando el userId proporcionado en el DTO
      const user = await this.userRepository.findOne({
        where: { id: createSaleDto.userId }
      });
  
      // Busco el cliente en la base de datos usando el clientId proporcionado en el DTO
      const client = await this.clientRepository.findOne({
        where: { id: createSaleDto.clientId }
      });
  
      // Verifico si usuario y cliente no son null
      if (!user || !client) {
        // Si no se encuentra el usuario o el cliente, retornar un mensaje de error con estado 404
        return {
          ok: false,
          message: 'Usuario y Cliente no encontrado',
          status: 404,
        };
      }
  
      // Variable para acumular puntos cuando un cliente compra ciertos productos
      let puntos = 0;
  
      // Instancia de la entidad Sale
      const sale = new Sale();
  
      // Asignacion de la fecha de la venta. Si no se proporciona, uso la fecha actual
      sale.date = createSaleDto.date || new Date();
  
      // Asignacion de la hora de la venta. Si no se proporciona, uso la hora actual
      sale.time = createSaleDto.time || new Date();
  
      // Asigno el descuento proporcionado en el DTO
      sale.discount =  0;
  
      // Total
      sale.total = 0;
  
      // Asigno el usuario a la venta
      sale.user = user;
  
      // Asigno el cliente a la venta
      sale.client = client;
  
      // sale.client = client.accumulatedPoint;
  
      // Guardo la nueva venta en la base de datos y se almacena la venta guardada en la variable datasale
      const datasale = await this.salesRepository.save(sale);
  
      // Variable para almacenar el total de producto
      let totalSale = 0;
      let totalDiscount = 0;
  
      // Itero sobre cada producto en la lista de productos del DTO de creación de venta
      for (const detail of createSaleDto.Products) {
  
        // Busco el producto en la base de datos utilizando el ID del producto
        const products = await this.productRepository.findOne({
          where: { id: detail.productId }
        });
  
        // Si el producto no se encuentra en la base de datos
        if (!products) { 
          return {
            ok: false, 
            // Mensaje de error Indica que el producto no se encontro
            message: `Producto con ID ${detail.productId} no encontrado`, 
            status: 404,
          };
        }
  
         // Instancia de Detalle de venta
        const detailSalee = new DetailSale();
        // Asocio la venta actual a este detalle de venta
        detailSalee.sale = datasale; 
        // Asigno el ID del producto al detalle de venta
        detailSalee.productId = detail.productId; 
        // Asigno la cantidad del producto al detalle de venta
        detailSalee.quantity = detail.quantity; 
        // Asigno el descuento del producto al detalle de venta
        detailSalee.discount = detail.discount; 
        // Calculo del total de Detalle de venta
        detailSalee.total = (products.unitCost * detail.quantity) - detail.discount; 
  
        // Acumula el total de la venta sumando el total de este detalle de venta
        totalSale += detailSalee.total; 
  
        // Acumula el total del descuento 
        totalDiscount += detail.discount;
  
        // Guardo el detalle de venta en la base de datos
        await this.detailSaleRepository.save(detailSalee); 
      }
  
      // Acumula los puntos del cliente
      client.accumulatedPoint += Math.floor(totalSale);
  
      // Aplicar descuentos de 5 dólares por cada 100 puntos acumulados
      while (client.accumulatedPoint >= 100) {
        sale.discount += 5; // Incrementar descuento en $5 por cada 100 puntos
        client.accumulatedPoint -= 100; // Restar 100 puntos del cliente
        totalSale -= 5; // Reducir el total de la venta por el monto del descuento
      }
  
      // Asignacion del total acumulado de la venta a la entidad Sale
      datasale.total = totalSale; 
      // Guardo la venta actualizada en la base de datos
      await this.salesRepository.save(sale); 
  
      // Actualizo los puntos acumulados del cliente en la base de datos
      await this.clientRepository.save(client);
  
      // Mensaje de éxito con estado 201
      return {
        ok: true, 
        message: 'Venta y detalles de venta creados con éxito',
        status: 201,
      };
  
    } catch (error) {
      // Si ocurre un error, retorna un mensaje de error con estado 500
      return {
        ok: false, 
        // message: 'Ocurrió un error al guardar la venta',
        message: error.message,
        status: 500,
      };
    }
  }
  

  

  /*async create(createSaleDto: CreateSaleDto) {
    try {
      // Busco el usuario en la base de datos usando el userId proporcionado en el DTO
      const user = await this.userRepository.findOne({
        where: { id: createSaleDto.userId }
      });
  
      // Busco el cliente en la base de datos usando el clientId proporcionado en el DTO
      const client = await this.clientRepository.findOne({
        where: { id: createSaleDto.clientId }
      });
  
      // Verifico si usuario y cliente no son null
      if (!user || !client) {
        // Si no se encuentra el usuario o el cliente, retornar un mensaje de error con estado 404
        return {
          ok: false,
          message: 'Usuario y Cliente no encontrado',
          status: 404,
        };
      }
  
      // Instancia de la entidad Sale
      const sale = new Sale();
  
      // Asignacion de la fecha de la venta. Si no se proporciona, uso la fecha actual
      sale.date = createSaleDto.date || new Date();
  
      // Asignacion de la hora de la venta. Si no se proporciona, uso la hora actual
      sale.time = createSaleDto.time || new Date();
  
      // Asigno el descuento proporcionado en el DTO, por defecto 0
      sale.discount = createSaleDto.discount;
  
      // Asigno el usuario a la venta
      sale.user = user;
  
      // Asigno el cliente a la venta
      sale.client = client;
  
      // Variable para almacenar el total de la venta y el total del descuento
      let totalSale = 0;
      let totalDiscount = 0;
  
      // Itero sobre cada producto en la lista de productos del DTO de creación de venta
      for (const detail of createSaleDto.Products) {
        // Busco el producto en la base de datos utilizando el ID del producto
        const product = await this.productRepository.findOne({
          where: { id: detail.productId }
        });
  
        // Si el producto no se encuentra en la base de datos
        if (!product) {
          return {
            ok: false,
            // Mensaje de error Indica que el producto no se encontro
            message: `Producto con ID ${detail.productId} no encontrado`,
            status: 404,
          };
        }
  
        // Instancia de Detalle de venta
        const detailSale = new DetailSale();
        // Asocio la venta actual a este detalle de venta
        detailSale.sale = sale;
        // Asigno el ID del producto al detalle de venta
        detailSale.productId = detail.productId;
        // Asigno la cantidad del producto al detalle de venta
        detailSale.quantity = detail.quantity;
        // Asigno el descuento del producto al detalle de venta
        detailSale.discount = detail.discount;
        // Calculo del total de Detalle de venta
        detailSale.total = (product.unitCost * detail.quantity) - detail.discount;
  
        // Acumula el total de la venta sumando el total de este detalle de venta
        totalSale += detailSale.total;
  
        // Acumula el total del descuento
        totalDiscount += detail.discount;
  
        // Guardo el detalle de venta en la base de datos
        await this.detailSaleRepository.save(detailSale);
      }
  
      // Asignacion del total acumulado de la venta a la entidad Sale
      sale.total = totalSale;
      // Asignacion del total acumulado del descuento a la entidad Sale
      sale.discount = totalDiscount;
      // Guardo la venta actualizada en la base de datos
      await this.salesRepository.save(sale);
  
      // Mensaje de éxito con estado 201
      return {
        ok: true,
        message: 'Venta y detalles de venta creados con éxito',
        status: 201,
      };
  
    } catch (error) {
      // Si ocurre un error, retornar un mensaje de error con estado 500
      return {
        ok: false,
        message: 'Ocurrió un error al guardar la venta',
        status: 500,
      };
    }
  }*/
  


  /* async create(createSaleDto: CreateSaleDto) {
     try {
       const user = await this.userRepository.findOne({ where: { id: createSaleDto.userId } });
       const client = await this.clientRepository.findOne({ where: { id: createSaleDto.clientId } });
   
       if (!user || !client) {
         return { ok: false, message: 'Usuario y Cliente no encontrado', status: 404 };
       }
   
       const sale = new Sale();
       sale.date = createSaleDto.date || new Date();
       sale.time = createSaleDto.time || new Date();
       sale.discount = createSaleDto.discount;
       sale.user = user;
       sale.client = client;
   
       // Variable para almacenar el total de la venta
       let totalSale = 0;
   
       // Primero guarda la venta para obtener su ID
       const savedSale = await this.salesRepository.save(sale);
   
       for (const detail of createSaleDto.Products) {
         const product = await this.productRepository.findOne({ where: { id: detail.productId } });
   
         if (!product) {
           return { ok: false, message: `Producto con ID ${detail.productId} no encontrado`, status: 404 };
         }
   
         const detailSale = new DetailSale();
         detailSale.sale = savedSale; // Asociar la venta al detalle de venta
         detailSale.productId = detail.productId;
         detailSale.quantity = detail.quantity;
         detailSale.discount = detail.discount;
         detailSale.total = (product.unitCost * detail.quantity) - detail.discount;
   
         totalSale += detailSale.total;
   
         await this.detailSaleRepository.save(detailSale);
       }
   
       // Actualiza el total calculado a la venta y guárdalo en la base de datos
       savedSale.total = totalSale;
       await this.salesRepository.save(savedSale);
   
       return { ok: true, message: 'Venta y detalles de venta creados con éxito', status: 201 };
   
     } catch (error) {
       return { ok: false, message: 'Ocurrió un error al guardar la venta', status: 500 };
     }
   }*/






  async findAll() {
    try {
      // Verifico si ventas esta activo
      const sales = await this.salesRepository.find({ where: { isActive: true } });

      // Verifico si la longitud de ventas es mayor a cero
      if (sales.length > 0)
        // Si es mayor a cero retornar true, devolver las ventas con estado 200
        return { ok: true, sales, status: 200 };

      // Si no se encontro nada retornar mensaje de error y el estado 400
      return { ok: false, message: 'No se encontraron ventas', status: 400 };


    } catch (error) {
      // Mensaje de error al obtener las ventas estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al obtener las ventas',
        status: 500,
      };
    }
  }

  async findOne(id: number) {
    try {
      const sales = await this.salesRepository.findOne({ where: { id } })

      // Verifico si ventas es diferente a null
      if (!sales)
        /* Si se cumple la condicion retorno un mensaje
       de error con estado 404*/
        return { ok: false, message: 'No se encontro la venta', status: 404 };

      /*Si el usuario si se encontro retorno true y devuelvo el cliente
       con estado 200 */
      return { ok: true, sales, status: 200 };
    } catch (error) {
      // Mensaje de error al obtener la venta con estado 500
      return {
        ok: false,
        message: 'Ocurrio un error al obtener la venta',
        status: 500,
      };
    }
  }

  /* Metodo actualizar 
    async update(id: number, updateSaleDto: UpdateSaleDto) {
      try {
        const sales = await this.salesRepository.findOne({ where: { id } });
  
        sales.userId = updateSaleDto.userId;
        sales.clientId = updateSaleDto.clientId;
        sales.date = updateSaleDto.date;
        sales.time = updateSaleDto.date;
        sales.discount = updateSaleDto.discount;
        sales.total = updateSaleDto.total;
        await this.salesRepository.save(sales);
  
        // Mensaje de exito al actualizar los datos 
        // con estado 200
        return {
          ok: true,
          messge: 'Venta actualizada con exito',
          status: 200
        };
  
      } catch (error) {
        return {
          ok: false,
          message: 'Ocurrio un error al actualizar la venta',
          status: 500,
        };
      }
    }
  
    async remove(id: number) {
      try {
        const sales = await this.salesRepository.findOne({ where: { id, isActive: true } })
  
        // Verifico si venta es null
        if (!sales)
          // Si es null retorno falso con estado 400
          return { ok: false, message: 'No se encontro la venta a eliminar', status: 400 };
  
        // Si no es null paso el estado de la venta a falso
        sales.isActive = false;
  
        // Guardo el estado activo en la base
        await this.salesRepository.save(sales);
  
        // Mensaje de exito al eliminar la venta con estado 200
        return {
          ok: true,
          message: 'Venta eliminada con exito',
          status: 200,
        };
      } catch (error) {
        return {
          ok: false,
          message: 'Ocurrio un error al intentar eliminar la venta',
          status: 500,
        };
      }
    }*/

}
