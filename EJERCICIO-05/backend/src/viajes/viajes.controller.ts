import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UpdateViajeDto } from './update-viaje.dto.js';
import { Viaje } from './viaje.entity.js';
import { ViajesService } from './viajes.service.js';

@Controller('viajes')
export class ViajesController {
 constructor(private readonly service:ViajesService){}

 @Patch(':id')
 update(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateViajeDto):Promise<Viaje>{
   return this.service.update(id,dto);
 }

 @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Viaje> {
    return this.service.findOne(id);
  }
}
