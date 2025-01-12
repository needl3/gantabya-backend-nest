import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class FileService {
  constructor(
    private readonly fileService: CloudinaryService
  ) { }
  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return await Promise.all(files.map(file => this.uploadFile(file)))
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const response = await this.fileService.uploadImage(file)
    return response.url
  }
}
