import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableLoot1748426563467 implements MigrationInterface {
    name = 'CreateTableLoot1748426563467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artefacts" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "artefacts" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "artefacts" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "artefacts" ADD "lootId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "artefacts" ADD CONSTRAINT "FK_ae2a839a4cf97ac7ff448d74329" FOREIGN KEY ("lootId") REFERENCES "loot_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artefacts" DROP CONSTRAINT "FK_ae2a839a4cf97ac7ff448d74329"`);
        await queryRunner.query(`ALTER TABLE "artefacts" DROP COLUMN "lootId"`);
        await queryRunner.query(`ALTER TABLE "artefacts" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "artefacts" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "artefacts" ADD "name" character varying NOT NULL`);
    }

}
