import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddBrandIdToModels1780715435520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'models',
      new TableColumn({
        name: 'brand_id',
        type: 'uniqueidentifier',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'models',
      new TableForeignKey({
        name: 'FK_MODELS_BRAND',
        columnNames: ['brand_id'],
        referencedTableName: 'brands',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('models', 'FK_MODELS_BRAND');
    await queryRunner.dropColumn('models', 'brand_id');
  }
}
