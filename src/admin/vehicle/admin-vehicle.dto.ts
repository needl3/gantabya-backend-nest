import { Types } from "mongoose";

export class CreateVehicleRequestDto {
  name: string;
  type: string;
  description: string;
  fuelType: string;
  pricePerDay: number;
  modelYear: number;
  seatingCapacity: number;
  images: string[];
}

export class CreateVehicleResponseDto extends CreateVehicleRequestDto {
  _id: Types.ObjectId;
}


export class UpdateVehicleRequestDto {
  name?: string;
  type?: string;
  description?: string;
  fuelType?: string;
  pricePerDay?: number;
  modelYear?: number;
  seatingCapacity?: number;
  images?: string[];
}

export class UpdateVehicleResponseDto extends CreateVehicleResponseDto {
  _id: Types.ObjectId;
}

export class DeleteVehicleRequestDto {
  id: string;
}

export class DeleteVehicleResponseDto extends CreateVehicleResponseDto {
  _id: Types.ObjectId;
}

export class ListVehiclesQueryDto {
  page: number;
  limit: number;
}
