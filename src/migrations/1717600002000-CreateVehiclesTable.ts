import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVehiclesTable1717600002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'license_plate',
            type: 'nvarchar',
            length: '10',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'chassis',
            type: 'nvarchar',
            length: '17',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'renavam',
            type: 'nvarchar',
            length: '11',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'model_id',
            type: 'uniqueidentifier',
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'vehicles',
      new TableForeignKey({
        name: 'FK_VEHICLES_MODEL',
        columnNames: ['model_id'],
        referencedTableName: 'models',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicles', 'FK_VEHICLES_MODEL');
    await queryRunner.dropTable('vehicles');
  }
}
