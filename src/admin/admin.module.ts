import { Module } from "@nestjs/common";
import { AdminVehicleModule } from "./vehicle/admin-vehicle.module";
import { AdminBookingModule } from "./booking/booking.module";

@Module({
  imports: [AdminVehicleModule, AdminBookingModule],
})
export class AdminModule { }
