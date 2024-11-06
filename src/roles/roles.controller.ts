import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreaateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { jwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { SearchRoleDto } from './dto/search-role.dto';

@UseGuards(jwtAuthGuard) 
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() createRoleDto: CreaateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    findAll(@Query() searchRoleDto: SearchRoleDto) {
        return this.rolesService.findAll(searchRoleDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.rolesService.findOne(id)
    }


    @Patch(':id')
    update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete('id')
    remove(@Param('id') id: number) {
        return this.rolesService.remove(id);
    }
}