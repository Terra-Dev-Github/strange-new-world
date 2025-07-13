// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world, ItemStack, TimeOfDay } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:spell_events' for item behavior (conditioned events on item use)
    eventData.itemComponentRegistry.registerCustomComponent('terra:spell_events', {
        onUse(e) {
            // destructure event data for easier access
            const player = e.source
            const dimension = e.source.dimension.id

            // define the player's equipment
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const offhandWand = equipment.getEquipment('Offhand');

            // run a command if the condition (i.e. item held in mainhand and offhand) is met

            // ignis
            if (selectedItem?.typeId === 'terra:scroll_ignis' || (selectedItem?.typeId === 'terra:tome_ignis' && (offhandWand?.typeId === 'terra:druidic_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('entity.blaze.shoot');
                // define and adjust spawn location
                const { x, y, z } = player.getHeadLocation();
                const spawnLoc = { x: x, y: y, z: z }
                const viewDir = player.getViewDirection();
                // define projectile to shoot and projectile owner (to prevent being damaged)
                const projectile = player.dimension.spawnEntity("terra:ignis_projectile", spawnLoc);
                const projectileCheck = projectile.getComponent("projectile");
                projectileCheck.owner = player;
                // shoot
                projectileCheck?.shoot(viewDir);
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // blizzard
            if (selectedItem?.typeId === 'terra:scroll_blizzard' || (selectedItem?.typeId === 'terra:tome_blizzard' && (offhandWand?.typeId === 'terra:druidic_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('item.spell_blizzard.use');
                // define and adjust spawn location
                const { x, y, z } = player.getHeadLocation();
                const spawnLoc = { x: x, y: y, z: z }
                const viewDir = player.getViewDirection();
                // define projectile to shoot and projectile owner (to prevent being damaged)
                const projectile = player.dimension.spawnEntity("terra:blizzard_projectile", spawnLoc);
                const projectileCheck = projectile.getComponent("projectile");
                projectileCheck.owner = player;
                // shoot
                projectileCheck?.shoot(viewDir);
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // cloudscape
            if (selectedItem?.typeId === 'terra:scroll_cloudscape' || (selectedItem?.typeId === 'terra:tome_cloudscape' && (offhandWand?.typeId === 'terra:reinforced_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('mob.enderdragon.flap');
                player.spawnParticle('terra:cloudscape_particle', player.location);
                player.addEffect('levitation', 80, {amplifier: 1, showParticles: false});
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // puffborne
            if (selectedItem?.typeId === 'terra:scroll_puffborne' || (selectedItem?.typeId === 'terra:tome_puffborne' && (offhandWand?.typeId === 'terra:reinforced_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('item.spell_puffborne.use');
                player.spawnParticle('terra:puffborne_player_particle', player.location);
                // get all entities in a 12 block radius from the player
                const infestingRadius = player.dimension.getEntities({ location: player.location, maxDistance: 12, });
                // define the aquatic mobs affected by the tome
                const infestArray = [
                    'minecraft:cod',
                    'minecratf:drowned',
                    'minecraft:guardian',
                    'minecraft:glow_squid',
                    'minecraft:salmon',
                    'minecraft:squid',
                    'minecraft:tropical_fish'
                ];
                for (const entity of infestingRadius) {
                    if (infestArray.includes(entity?.typeId)) {
                        // for each target, summon a pufferfish at the infested mob's location
                        entity.dimension.spawnParticle('terra:chestlock_open', entity.location);
                        entity.dimension.spawnEntity('minecraft:pufferfish', entity.location);
                        entity.remove() // despawn the mob
                    }
                };
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // lunar wrath
            if (selectedItem?.typeId === 'terra:scroll_lunar_wrath' || (selectedItem?.typeId === 'terra:tome_lunar_wrath' && (offhandWand?.typeId === 'terra:ancient_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('item.spell_lunar_wrath.use');
                if (dimension === 'minecraft:overworld') {
                    if (TimeOfDay.Night || TimeOfDay.Midnight) {
                        player.runCommand("effect @s strength 4 300 false ");
                        player.runCommand("effect @s resistance 4 300 false ");
                    } else {
                        player.runCommand("effect @s strength 1 30 false ");
                        player.runCommand("effect @s resistance 1 30 false ");
                    }
                };
                if (dimension === 'minecraft:nether' || 'minecraft:the_end') {
                    player.runCommand("effect @s strength 4 300 false ");
                    player.runCommand("effect @s resistance 4 300 false ");
                };
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // windwake
            if (selectedItem?.typeId === 'terra:scroll_windwake' || (selectedItem?.typeId === 'terra:tome_windwake' && (offhandWand?.typeId === 'terra:ancient_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('item.spell_windwake.use');
                player.spawnParticle('terra:windwake_particle', player.location);
                player.applyKnockback(0, 0, 0, 1.5);
                player.addEffect('slow_falling', 140, {amplifier: 3, showParticles: false});
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // deathsong
            const deathsongMobs = [
                "minecraft:bat",
                "minecraft:bogged",
                "minecraft:drowned",
                "minecraft:silverfish",
                "minecraft:skeleton",
                "minecraft:vex",
                "minecraft:wither_skeleton"
            ];
            // choose a random element from the array
            const random = Math.floor(Math.random() * deathsongMobs.length)

            if (selectedItem?.typeId === 'terra:scroll_deathsong' || (selectedItem?.typeId === 'terra:tome_deathsong' && (offhandWand?.typeId === 'terra:archimage_wand' || 'terra:supreme_wand'))) {
                player.dimension.playSound('item.spell_deathsong.use');
                player.spawnParticle('terra:deathsong_particle', player.location);
                // summon four entities on the player's dimension
                player.dimension.spawnEntity(deathsongMobs[random], player.location).triggerEvent('terra:deathsong_binding');
                player.dimension.spawnEntity(deathsongMobs[random], player.location).triggerEvent('terra:deathsong_binding');
                player.dimension.spawnEntity(deathsongMobs[random], player.location).triggerEvent('terra:deathsong_binding');
                player.dimension.spawnEntity(deathsongMobs[random], player.location).triggerEvent('terra:deathsong_binding');
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // coagulate
            if (selectedItem?.typeId === 'terra:scroll_coagulate' || (selectedItem?.typeId === 'terra:tome_coagulate' && (offhandWand?.typeId === 'terra:archimage_wand' || 'terra:supreme_wand'))) {
                // multiple sounds to mimic blood
                player.dimension.playSound('random.drink_honey');
                player.dimension.playSound('random.mob.player.hurt_freeze');
                // define and adjust spawn location
                const { x, y, z } = player.getHeadLocation();
                const spawnLoc = { x: x, y: y, z: z }
                const viewDir = player.getViewDirection();
                // define projectile to shoot and projectile owner (to prevent being damaged)
                const projectile = player.dimension.spawnEntity("terra:coagulate_projectile", spawnLoc);
                const projectileCheck = projectile.getComponent("projectile");
                projectileCheck.owner = player;
                // shoot
                projectileCheck?.shoot(viewDir);
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // umbra
            if (selectedItem?.typeId === 'terra:scroll_umbra' || (selectedItem?.typeId === 'terra:tome_umbra' && offhandWand?.typeId === 'terra:supreme_wand')) {
                player.dimension.playSound('item.trident.thunder');
                // define and adjust spawn location
                const { x, y, z } = player.getHeadLocation();
                const spawnLoc = { x: x, y: y, z: z }
                const viewDir = player.getViewDirection();
                // define projectile to shoot and projectile owner (to prevent being damaged)
                const projectile = player.dimension.spawnEntity("terra:umbra_projectile", spawnLoc);
                const projectileCheck = projectile.getComponent("projectile");
                projectileCheck.owner = player;
                // shoot
                projectileCheck?.shoot(viewDir);
                // start cooldown
                selectedItem.getComponent('cooldown').startCooldown(player);
            };

            // define tome and scroll arrays
            const tomeArray = [
                'terra:tome_blizzard',
                'terra:tome_cloudscape',
                'terra:tome_coagulate',
                'terra:tome_deathsong',
                'terra:tome_ignis',
                'terra:tome_lunar_wrath',
                'terra:tome_puffborne',
                'terra:tome_umbra',
                'terra:tome_windwake'
            ];
            const scrollArray = [
                'terra:scroll_blizzard',
                'terra:scroll_cloudscape',
                'terra:scroll_coagulate',
                'terra:scroll_deathsong',
                'terra:scroll_ignis',
                'terra:scroll_lunar_wrath',
                'terra:scroll_puffborne',
                'terra:scroll_umbra',
                'terra:scroll_windwake'
            ];
            // get the durability component of the scroll or wand and decrease it unless the player is in creative
            const durability = scrollArray.includes(selectedItem?.typeId) ? selectedItem.getComponent('durability') : offhandWand.getComponent('durability');
            if (player.getGameMode() !== "creative") {
                // check if the item has a durability component and if its damage is less than the max
                if (durability && durability.damage < durability.maxDurability) {
                    // increment the damage of the item, reducing its durability
                    durability.damage++;
                    equipment.setEquipment(`Offhand`, offhandWand);
                }

                // check if the item has a durability component and if its damage is greater than or equal to the max
                if (durability && durability.damage >= durability.maxDurability) {
                    // play sound effect and remove the corresponding item
                    player.playSound('random.break');
                    if (scrollArray.includes(selectedItem?.typeId)) {
                        equipment.setEquipment(`Mainhand`, new ItemStack('minecraft:air', 1));
                    };
                    if (tomeArray.includes(selectedItem?.typeId)) {
                        equipment.setEquipment(`Offhand`, new ItemStack('minecraft:air', 1));
                    }
                }
            }
        }
    });
});