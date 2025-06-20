-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "applicationMaterialIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
