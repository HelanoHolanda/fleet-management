import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateModelsTable1717600001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'models',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'GETDATE()',
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'GETDATE()',
          },
          {
            name: 'created_by',
            type: 'uniqueidentifier',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('models');
  }
}
