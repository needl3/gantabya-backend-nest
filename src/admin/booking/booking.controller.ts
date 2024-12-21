import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { AdminBookingService } from "./booking.service";
import { ListBookingsQueryDto } from "./booking.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Types } from "mongoose";

@Controller("/admin/booking")
@UseGuards(AuthenticationGuard, RolesGuard)
export class AdminBookingController {
  constructor(
    private readonly adminBookingService: AdminBookingService,
  ) { }

  @Get("list")
  @Roles(['admin'])
  async listBookings(@Query() query: ListBookingsQueryDto) {
    return await this.adminBookingService.listBookings(
      query.page || 0,
      query.limit || 0,
      query?.vehicleType,
      query?.bookingStatus
    )
  }

  @Post(":bookingId/unbook")
  @Roles(['admin'])
  async unbook(
    @Param("bookingId") bookingId: Types.ObjectId,
  ) {
    return await this.adminBookingService.unbook(bookingId)
  }

}
