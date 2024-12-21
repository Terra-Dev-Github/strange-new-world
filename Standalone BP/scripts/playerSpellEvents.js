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
            const equipment = player.getComponent('minecraft:equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const offhandWand = equipment.getEquipment('Offhand');

            // run a command if the condition (i.e. item held in mainhand and offhand) is met
            if (selectedItem?.typeId === 'terra:spell_cloudscape' && offhandWand?.typeId === 'terra:wand') {
                player.runCommandAsync(`particle terra:ring_purple ${player.location.x} ${player.location.y} ${player.location.z}`);
                player.runCommandAsync("effect @s levitation 4 1 false");
            };

            if (selectedItem?.typeId === 'terra:spell_lunar_wrath' && offhandWand?.typeId === 'terra:wand') {
                if (dimension === 'minecraft:overworld') {
                    if (TimeOfDay.Night || TimeOfDay.Midnight) {
                        player.runCommandAsync("effect @s strength 300 4 false ");
                        player.runCommandAsync("effect @s resistance 300 1 false ");
                    }
                }
            };

            if (selectedItem?.typeId === 'terra:spell_windwake' && offhandWand?.typeId === 'terra:wand') {
                player.clearVelocity();
                player.runCommandAsync(`particle terra:ring_green ${player.location.x} ${player.location.y} ${player.location.z}`);
                player.applyKnockback(0, 0, 0, 3);
                player.runCommandAsync("effect @s slow_falling 7 3 false");
            };

            if (selectedItem?.typeId === 'terra:spell_puffborne' && offhandWand?.typeId === 'terra:wand') {
                // get all entities in a 12 block radius from the player
                const infestingRadius = player.dimension.getEntities({location: player.location, maxDistance: 12,});
                // define the aquatic mobs affected by the spell
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
                        entity.runCommandAsync(`particle terra:chestlock_open ${entity.location.x} ${entity.location.y} ${entity.location.z}`);
                        entity.dimension.spawnEntity('minecraft:pufferfish', entity.location);
                        entity.remove() // despawn the mob
                    }
                }
            };

            // get the durability component of the wand and decrease it unless the player is in creative
            const durability = offhandWand.getComponent('durability');
            if (player.getGameMode() !== "creative") {
                // check if the item has a durability component and if its damage is less than the max
                if (durability && durability.damage < durability.maxDurability) {
                    // increment the damage of the item, reducing its durability
                    durability.damage++;
                    equipment.setEquipment(`Offhand`, offhandWand);
                }

                // check if the item has a durability component and if its damage is greater than or equal to the max
                if (durability && durability.damage >= durability.maxDurability) {
                    // play sound effect and remove the item from the offhand
                    player.playSound('random.break');
                    equipment.setEquipment(`Offhand`, new ItemStack('minecraft:air', 1));
                }
            }
        }
    });
});