import { Module } from "@nestjs/common";
import { AdminBookingService } from "./booking.service";
import { AdminBookingController } from "./booking.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingTxn, BookingTxnSchema } from "src/booking_txn/booking_txn.schema";
import { Vehicle, VehicleSchema } from "src/vehicles/vehicle.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookingTxn.name, schema: BookingTxnSchema }]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [AdminBookingController],
  providers: [AdminBookingService],
  exports: []
})
export class AdminBookingModule { }
