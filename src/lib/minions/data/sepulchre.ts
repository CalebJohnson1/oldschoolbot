import { randInt } from 'e';
import { Bank } from 'oldschooljs';
import LootTable from 'oldschooljs/dist/structures/LootTable';

import { Time } from '../../constants';
import { ItemBank } from '../../types';
import { roll } from '../../util';

const LowTierCoffin = new LootTable()
	.add("Monk's robe top")
	.add("Monk's robe")
	.add('Holy symbol')
	.add('Air rune', [500, 750])
	.add('Fire rune', [500, 750])
	.add('Chaos rune', [25, 50])
	.add('Mithril bolts', [50, 150])
	.add('Prayer potion(2)')
	.add('White lily')
	.add('Coins', [1500, 3000]);

const MidTierCoffin = new LootTable()
	.add('Adamant 2h sword')
	.add('Adamant platebody')
	.add('Cosmic rune', [60, 100])
	.add('Death rune', [60, 100])
	.add('Nature rune', [60, 100])
	.add('Adamant bolts', [50, 200])
	.add('Monkfish', [1, 3])
	.add('Prayer potion(4)')
	.add('Grimy ranarr weed', [1, 2])
	.add('Coins', [7500, 12_500]);

const HighTierCoffin = new LootTable()
	.add('Rune 2h sword')
	.add('Rune platebody')
	.add('Law rune', [150, 250])
	.add('Blood rune', [150, 250])
	.add('Soul rune', [150, 250])
	.add('Runite bolts', [100, 300])
	.add('Monkfish', [2, 6])
	.add('Sanfew serum(4)', [1, 2])
	.add('Ranarr seed', [1, 2])
	.add('Coins', [17_500, 25_000]);

export const sepulchreFloors = [
	{
		number: 1,
		petChance: 35_000,
		agilityLevel: 52,
		xp: 500,
		time: Time.Minute * 0.9,
		lockpickCoffinChance: 200,
		coffinTable: new LootTable()
			.add(LowTierCoffin, 1, 60)
			.add(MidTierCoffin, 1, 35)
			.add(HighTierCoffin, 1, 5),
		numCoffins: 1,
		marksRange: [1, 1]
	},
	{
		number: 2,
		petChance: 16_000,
		agilityLevel: 62,
		xp: 850,
		time: Time.Minute * 1.1,
		lockpickCoffinChance: 120,
		coffinTable: new LootTable()
			.add(LowTierCoffin, 1, 30)
			.add(MidTierCoffin, 1, 60)
			.add(HighTierCoffin, 1, 10),
		numCoffins: 2,
		marksRange: [2, 3]
	},
	{
		number: 3,
		petChance: 8000,
		agilityLevel: 72,
		xp: 1425,
		time: Time.Minute * 1.5,
		lockpickCoffinChance: 90,
		coffinTable: new LootTable()
			.add(LowTierCoffin, 1, 15)
			.add(MidTierCoffin, 1, 65)
			.add(HighTierCoffin, 1, 20),
		numCoffins: 2,
		marksRange: [3, 5]
	},
	{
		number: 4,
		petChance: 4000,
		agilityLevel: 82,
		xp: 2625,
		time: Time.Minute * 2,
		lockpickCoffinChance: 60,
		coffinTable: new LootTable().add(MidTierCoffin, 1, 60).add(HighTierCoffin, 1, 40),
		numCoffins: 2,
		marksRange: [3, 6]
	},
	{
		number: 5,
		petChance: 2000,
		agilityLevel: 92,
		xp: 5850,
		time: Time.Minute * 4,
		lockpickCoffinChance: 40,
		coffinTable: new LootTable().add(MidTierCoffin, 1, 20).add(HighTierCoffin, 1, 80),
		numCoffins: 3,
		marksRange: [4, 6]
	}
];

export function openCoffin(floor: 1 | 2 | 3 | 4 | 5): ItemBank {
	const loot = new Bank();
	const floorObj = sepulchreFloors[floor - 1];
	if (roll(floorObj.lockpickCoffinChance)) {
		loot.add('Strange old lockpick');
	}
	loot.add(floorObj.coffinTable.roll());
	loot.add(randInt(floorObj.marksRange[0], floorObj.marksRange[1]));
	return loot.bank;
}