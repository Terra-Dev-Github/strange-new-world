// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world, ItemStack } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:is_spell' for item behavior (conditioned events on item use)
    eventData.itemComponentRegistry.registerCustomComponent('terra:is_spell', {
        onUse(e) {
            // destructure event data for easier access
            const { player } = e;

            // define the player's equipment
            const equipment = e.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const offhandWand = equipment.getEquipment(`Offhand`);
            
            // run a command if the condition (i.e. item held in mainhand and offhand) is met
            if (selectedItem?.typeId === 'terra:spell_levitation4' && offhandWand?.typeId === 'terra:wand') {
                e.runCommandAsync("effect @s levitation 4 1 true ");
            } else return;

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