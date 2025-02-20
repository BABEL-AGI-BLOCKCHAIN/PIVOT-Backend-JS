-- AlterTable
CREATE SEQUENCE topic_id_seq;
ALTER TABLE "Topic" ALTER COLUMN "id" SET DEFAULT nextval('topic_id_seq');
ALTER SEQUENCE topic_id_seq OWNED BY "Topic"."id";
