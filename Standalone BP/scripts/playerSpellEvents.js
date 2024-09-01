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
                player.runCommandAsync(`particle terra:ring_purple ${location.x} ${location.y} ${location.z}`);
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
                player.runCommandAsync(`particle terra:ring_green ${location.x} ${location.y} ${location.z}`);
                player.applyKnockback(0, 0, 0, 3);
                player.runCommandAsync("effect @s slow_falling 7 3 false");
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