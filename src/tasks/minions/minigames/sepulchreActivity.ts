import { Task } from 'klasa';
import { Bank, Openables } from 'oldschooljs';

import { sepulchreFloors } from '../../../lib/minions/data/sepulchre';
import { SkillsEnum } from '../../../lib/skilling/types';
import { SepulchreActivityTaskOptions } from '../../../lib/types/minions';
import { roll } from '../../../lib/util';
import { handleTripFinish } from '../../../lib/util/handleTripFinish';

export default class extends Task {
	async run({ channelID, quantity, floors, duration, userID }: SepulchreActivityTaskOptions) {
		const user = await this.client.users.fetch(userID);
		user.incrementMinionDailyDuration(duration);

		const completedFloors = sepulchreFloors.filter(fl => floors.includes(fl.number));
		const loot = new Bank();
		let agilityXP = 0;
		let numCoffinsOpened = 0;

		for (let i = 0; i < quantity; i++) {
			for (const floor of completedFloors) {
				if (roll(floor.petChance)) {
					loot.add('Giant squirrel');
				}

				if (floor.number === 5) {
					loot.add(Openables.GrandHallowedCoffin.open());
				}

				const numCoffinsToOpen = 1;
				numCoffinsOpened += numCoffinsToOpen;
				for (let i = 0; i < numCoffinsToOpen; i++) {
					loot.add(floor.coffinTable.roll());
				}

				agilityXP += floor.xp;
			}
		}

		await user.addItemsToBank(loot.bank, true);
		const currentLevel = user.skillLevel(SkillsEnum.Agility);
		await user.addXP(SkillsEnum.Agility, agilityXP);
		const nextLevel = user.skillLevel(SkillsEnum.Agility);

		let str = `<:Hamstare:685036648089780234> You did the Hallowed Sepulchre ${quantity}x times (floor ${
			floors[0]
		}-${
			floors[floors.length - 1]
		}), you received ${agilityXP.toLocaleString()} Agility XP. You opened ${numCoffinsOpened}x coffins.`;

		if (nextLevel > currentLevel) {
			str += `\n\n${user.minionName}'s Agility level is now ${nextLevel}!`;
		}

		const image = await this.client.tasks
			.get('bankImage')!
			.generateBankImage(
				loot.bank,
				`Loot From ${quantity}x Hallowed Sepulchre:`,
				true,
				{ showNewCL: 1 },
				user
			);

		handleTripFinish(
			this.client,
			user,
			channelID,
			str,
			res => {
				user.log(`continued trip of ${quantity}x sepulchre`);
				return this.client.commands.get('sepulchre')!.run(res, []);
			},
			image
		);
	}
}