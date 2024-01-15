import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1705287086855 implements MigrationInterface {
    name = 'Migrations1705287086855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "auth0Id" character varying NOT NULL, "username" character varying(30) NOT NULL, "bio" character varying(128) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_49c08de80c2fd2f6a7ba5ce97c4" UNIQUE ("auth0Id"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_471ff2ddd009928e0501b75a4b6" UNIQUE ("bio"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
