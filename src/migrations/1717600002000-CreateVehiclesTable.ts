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
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'license_plate',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'chassis',
            type: 'varchar',
            length: '17',
            isNullable: false,
          },
          {
            name: 'renavam',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'model_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'uuid',
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
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicles', 'FK_VEHICLES_MODEL');
    await queryRunner.dropTable('vehicles');
  }
}
