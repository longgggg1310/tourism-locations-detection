import {MigrationInterface, QueryRunner} from "typeorm";

export class s31690812548212 implements MigrationInterface {
    name = 's31690812548212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "cid" character varying NOT NULL, "storage" character varying NOT NULL, "originalname" character varying NOT NULL, "filename" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" character varying NOT NULL, "cdnUrl" character varying, "attribute" json DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL, "resizeThumbnail" character varying, "smallThumbnail" character varying, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_18a0ad156828b598fcef570209" ON "file" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_5442bef23f87a3ef603b658add" ON "file" ("resizeThumbnail") `);
        await queryRunner.query(`CREATE INDEX "IDX_8c1f51416dd3e4e66b680155ae" ON "file" ("smallThumbnail") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8c1f51416dd3e4e66b680155ae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5442bef23f87a3ef603b658add"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18a0ad156828b598fcef570209"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
