import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  providers: [FileService],
  exports: [FileService]
})

export class FileModule { }
