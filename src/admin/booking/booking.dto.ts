export class ListBookingsQueryDto {
  page: number;
  limit: number;
  vehicleType?: string;
  bookingStatus?: string;
}
