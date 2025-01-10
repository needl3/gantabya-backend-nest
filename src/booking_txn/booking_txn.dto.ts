import { Types } from "mongoose";

export class CreateBookingTxnDto {
  pidx: string;
  user: Types.ObjectId;
  vehicle: Types.ObjectId;
  from: Date;
  to: Date;
  price: number;
  status: 'pending' | 'booked' | 'cancelled'
  pickupCoords: string;
}
