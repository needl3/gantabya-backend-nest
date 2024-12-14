import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./users.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto)

    return user.save()
  }

  async fetchByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email })
  }

  async fetchByEmailAndPassword(email: string, password: string): Promise<User | null> {
    return this.userModel.findOne({ email, password })
  }
}
