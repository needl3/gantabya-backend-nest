import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateVehicleRequestDto, UpdateVehicleRequestDto } from "./admin-vehicle.dto";
import { AdminVehicleService } from "./admin-vehicle.service";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { AuthenticationGuard } from "src/common/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { ListVehiclesQueryDto } from "src/common/dto/vehicle.dto";

@Controller('/admin/vehicle')
@UseGuards(AuthenticationGuard, RolesGuard)
export class AdminVehicleController {
  constructor(
    private readonly adminVehicleService: AdminVehicleService,
  ) { }
  @Post()
  @Roles(['admin'])
  @UseInterceptors(FileInterceptor('images'))
  async createVehicle(@Body() body: CreateVehicleRequestDto, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.adminVehicleService.createVehicle(body)
  }

  @Patch(":id")
  @Roles(['admin'])
  async updateVehicle(@Param("id") id: Types.ObjectId, @Body() body: UpdateVehicleRequestDto) {
    return await this.adminVehicleService.updateVehicle(id, body)
  }

  // Delete a vehicle
  @Delete(":id")
  @Roles(['admin'])
  async deleteVehicle(@Param("id") id: string) {
    return await this.adminVehicleService.deleteVehicle(id)
  }

  @Get()
  @Roles(['admin'])
  async listVehicles(@Query() query: ListVehiclesQueryDto) {
    return await this.adminVehicleService.listVehicles(query.page || 0, query.limit || 10, query.type)
  }

  @Get(":id")
  @Roles(['admin'])
  async getVehicle(@Param("id") id: string) {
    return await this.adminVehicleService.getVehicle(id)
  }
}
