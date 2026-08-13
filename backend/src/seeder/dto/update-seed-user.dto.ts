import { PartialType } from '@nestjs/mapped-types';
import { CreateSeedUserDto } from './create-seed-user.dto';

export class UpdateSeedUserDto extends PartialType(CreateSeedUserDto) {}
