export class ListVehiclesQueryDto {
  page: number;
  limit: number;
  type?: string;
  searchQuery?: string;
}
