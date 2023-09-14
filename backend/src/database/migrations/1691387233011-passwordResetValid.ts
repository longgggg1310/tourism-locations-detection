import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordResetValid1691387233011 implements MigrationInterface {
    name = 'passwordResetValid1691387233011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastPasswordResetRequest" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastPasswordResetRequest"`);
    }

}
