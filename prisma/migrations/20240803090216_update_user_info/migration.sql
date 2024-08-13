/*
  Warnings:

  - A unique constraint covering the columns `[countryCode,name]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isoCode]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isoCode,countryCode]` on the table `states` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cities_countryCode_name_key" ON "cities"("countryCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_isoCode_key" ON "countries"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "states_isoCode_countryCode_key" ON "states"("isoCode", "countryCode");
