import { Module } from "@nestjs/common";
import { AdminVehicleModule } from "./vehicle/admin-vehicle.module";

@Module({
  imports: [AdminVehicleModule],
})
export class AdminModule { }
