import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { VehicleService } from "./vehicles.service";
import { ListVehiclesQueryDto } from "src/common/dto/vehicle.dto";
import { AuthenticationGuard } from "src/common/guards/auth.guard";
import { AuthenticatedUser } from "src/common/decorators/authenticated-user.decorator";
import { AccessTokenPayload } from "src/auth/dto/login-user.dto";

@Controller('vehicles')
@UseGuards(AuthenticationGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehicleService,
  ) { }

  @Get()
  listAvailableVehicles(@Query() query: ListVehiclesQueryDto) {
    return this.vehiclesService.listAvailableVehicles(query.page || 0, query.limit || 10, query.type)
  }

  @Get('booked')
  listBookedVehicles(@Query() query: ListVehiclesQueryDto, @AuthenticatedUser() user: AccessTokenPayload) {
    return this.vehiclesService.listBookedVehicles(user.id, query.page || 0, query.limit || 10, query.type)
  }
}
