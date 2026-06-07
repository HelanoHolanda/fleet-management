import { IsUUID } from 'class-validator';

export class AssociateModelToBrandDto {
  @IsUUID('4', { message: 'brandId deve ser um UUID válido.' })
  brandId!: string;

  @IsUUID('4', { message: 'modelId deve ser um UUID válido.' })
  modelId!: string;
}
