// backend/src/seeding/dto/update-seed-user.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateSeedUserDto } from "./create-seed-user.dto";

export class UpdateSeedUserDto extends PartialType(CreateSeedUserDto) {}
