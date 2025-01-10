import { Body, Controller, Get, HttpException, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { VehicleService } from "./vehicles.service";
import { ListVehiclesQueryDto } from "src/common/dto/vehicle.dto";
import { AuthenticationGuard } from "src/common/guards/auth.guard";
import { AuthenticatedUser } from "src/common/decorators/authenticated-user.decorator";
import { AccessTokenPayload } from "src/auth/dto/login-user.dto";
import { UserService } from "src/users/users.service";
import { Types } from "mongoose";
import { Response } from "express";
import { BookVehicleRequestDto, PaymentSuccessKhaltiCallbackBodyDto } from "./vehicle.dto";
import { BookingTxnService } from "src/booking_txn/booking_txn.service";

@Controller('vehicles')
@UseGuards(AuthenticationGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehicleService,
    private readonly userService: UserService,
    private readonly bookingTxnService: BookingTxnService,
  ) { }

  @Get()
  listAvailableVehicles(@Query() query: ListVehiclesQueryDto) {
    return this.vehiclesService.listAvailableVehicles(query.page || 0, query.limit || 10, query.type)
  }

  @Get('booked')
  async listBookedVehicles(@Query() query: ListVehiclesQueryDto, @AuthenticatedUser() user: AccessTokenPayload) {
    const bookedVehicles = await this.vehiclesService.listBookedVehicles(user.id, query.page || 0, query.limit || 10, query.type)
    return bookedVehicles
  }

  @Get(':id')
  getVehicleById(@Param('id') id: Types.ObjectId) {
    return this.vehiclesService.getVehicleById(id)
  }

  @Post('book/:id')
  async bookVehicle(
    @Param('id') vehicleId: Types.ObjectId,
    @AuthenticatedUser() user: AccessTokenPayload,
    @Body() body: BookVehicleRequestDto,
    @Res() response: Response
  ) {
    // TODO: Move these db specific operations to a service
    const bookingUser = await this.userService.fetchById(user.id)
    if (!bookingUser) throw new HttpException('User not found', 404)

    const vehicleDetails = await this.vehiclesService.getVehicleById(vehicleId)
    if (!vehicleDetails) throw new HttpException('Vehicle not found', 404)

    const price = await this.vehiclesService.calculateVehicleBookingPrice(vehicleDetails, body)

    const khaltiCheckoutSession = await this.vehiclesService.createKhaltiCheckoutSession(bookingUser, vehicleDetails, price)
    if (!khaltiCheckoutSession) throw new HttpException('Could not create Khalti checkout session', 500)

    this.bookingTxnService.create({
      pidx: khaltiCheckoutSession.pidx,
      user: bookingUser._id,
      price,
      from: body.from,
      to: body.to,
      vehicle: vehicleDetails._id,
      status: 'pending',
      pickupCoords: body.pickupCoords
    })

    response.redirect(khaltiCheckoutSession.payment_url)
  }

  @Get('book/:id/confirm')
  async confirmKhaltiCheckout(
    @Param('id') id: Types.ObjectId,
    @AuthenticatedUser() user: AccessTokenPayload,
    @Query() paymentInfo: PaymentSuccessKhaltiCallbackBodyDto
  ) {
    if (!this.vehiclesService.verifyPayment(paymentInfo.pidx)) {
      throw new HttpException('Invalid payment', 400)
    }

    const bookingResponse = await this.vehiclesService.bookVehicle(user.id, id, paymentInfo.pidx)
    if (!bookingResponse) throw new HttpException('Could not book vehicle', 500)

    return { vehicle: bookingResponse.vehicle, bookingInfo: bookingResponse.bookingInfo }
  }
}
