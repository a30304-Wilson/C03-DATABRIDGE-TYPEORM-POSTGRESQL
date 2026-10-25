import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Libro } from './libro.entity.js';
import { LibrosService } from './libros.service.js';
import { UpdateLibroDto } from './update-libro.dto.js';

@Controller('libros')
export class LibrosController {
 constructor(private readonly service:LibrosService){}

 @Get()
 findAll():Promise<Libro[]>{ return this.service.findAll(); }

 @Delete(':id')
 remove(@Param('id',ParseIntPipe) id:number):Promise<void>{
   return this.service.remove(id);
 }

 @Patch(':id')
  update(@Param('id',ParseIntPipe) id:number, @Body() dto:UpdateLibroDto):Promise<Libro>{
    return this.service.update(id, dto);
  }
}
