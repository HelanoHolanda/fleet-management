import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateModelDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;
}
