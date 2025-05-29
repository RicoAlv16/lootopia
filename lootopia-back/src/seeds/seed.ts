import 'reflect-metadata';
import { AppDataSource } from '../data-source';

import { UsersEntity } from '../shared/entities/users.entity';
import { ProfileEntity } from '../shared/entities/profile.entity';
import { Artefact } from '../shared/entities/artefact.entity';
import { Auction } from '../shared/entities/auction.entity';
import { LootTable } from '../shared/entities/loot-table.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Connexion établie.');

  const userRepo = AppDataSource.getRepository(UsersEntity);
  const profileRepo = AppDataSource.getRepository(ProfileEntity);
  const lootRepo = AppDataSource.getRepository(LootTable);
  const artefactRepo = AppDataSource.getRepository(Artefact);
  const auctionRepo = AppDataSource.getRepository(Auction);

  const users: UsersEntity[] = [];

  // 👤 Création des utilisateurs + profils
  for (let i = 1; i <= 2; i++) {
    const user = userRepo.create({
      nickname: `user${i}`,
      email: `user${i}@treasure.com`,
      password: 'hashed_password',
      isVerified: true,
    });
    await userRepo.save(user);

    const profile = profileRepo.create({
      compte: `Compte user${i}`,
      telephone: `060000000${i}`,
      bio: `Chasseur de trésor #${i}`,
      user,
      balance: 1000,
    });
    await profileRepo.save(profile);

    users.push(user);
  }

  // 🧱 Loots avec image selon leur ID
  const lootItems = [
    { name: 'Carte au trésor', rarity: 'Rare' },
    { name: 'Pelle en or', rarity: 'Épique' },
    { name: 'Compas ancien', rarity: 'Commun' },
    { name: 'Jumelles de l’aigle', rarity: 'Rare' },
    { name: 'Longue vue pirate', rarity: 'Épique' },
    { name: 'Clé du coffre maudit', rarity: 'Légendaire' },
    { name: 'Parchemin crypté', rarity: 'Rare' },
    { name: 'Grimoire de navigation', rarity: 'Épique' },
    { name: 'Boussole enchantée', rarity: 'Légendaire' },
    { name: 'Talisman du capitaine', rarity: 'Commun' },
    { name: 'Miroir d’orientation', rarity: 'Rare' },
    { name: 'Statue d’obsidienne', rarity: 'Légendaire' },
    { name: 'Étoile de mer dorée', rarity: 'Épique' },
    { name: 'Fragment de carte', rarity: 'Commun' },
    { name: 'Coffre rouillé', rarity: 'Rare' },
    { name: 'Lanterne des abysses', rarity: 'Épique' },
    { name: 'Perle maudite', rarity: 'Légendaire' },
    { name: 'Crâne chuchoteur', rarity: 'Légendaire' },
    { name: 'Pièce ancienne', rarity: 'Commun' },
    { name: 'Médaille des mers', rarity: 'Épique' },
  ];

  const savedLoots: LootTable[] = [];

  for (let i = 0; i < lootItems.length; i++) {
    const item = lootItems[i];
    const loot = lootRepo.create({
      name: item.name,
      description: 'Un objet mystérieux lié à la chasse au trésor.',
      rarity: item.rarity as 'Commun' | 'Rare' | 'Épique' | 'Légendaire',
    });

    const saved = await lootRepo.save(loot);
    saved.image = `/static/artefacts/${i + 1}.png`; // image ID = index + 1
    await lootRepo.save(saved);
    savedLoots.push(saved);
  }

  // 🎯 Création d’artefacts & enchères (1 par loot)
  for (let i = 0; i < savedLoots.length; i++) {
    const loot = savedLoots[i];
    const owner = users[i % users.length];

    const artefact = artefactRepo.create({
      loot,
      owner,
      isInAuction: true,
    });
    await artefactRepo.save(artefact);

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 + (i % 5)) * 60 * 60 * 1000);

    const auction = auctionRepo.create({
      artefact,
      seller: owner,
      startingPrice: 100 + i * 20,
      currentBid: 0,
      currentBidder: null,
      status: 'active',
      startTime,
      endTime,
    });
    await auctionRepo.save(auction);

    console.log(`✅ Artefact ${loot.name} (image ${loot.image}) attribué à ${owner.nickname}`);
  }

  console.log('🎯 Seeding terminé avec succès.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur pendant le seeding :', err);
  process.exit(1);
});