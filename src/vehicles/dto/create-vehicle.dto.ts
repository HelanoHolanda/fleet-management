import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Length(7, 10)
  licensePlate!: string;

  @IsString()
  @IsNotEmpty()
  @Length(17, 17)
  chassis!: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  renavam!: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsUUID()
  @IsNotEmpty()
  modelId!: string;
}
