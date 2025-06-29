// This file was made by Kaiōga (@Kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world, BlockPermutation, ItemStack } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named terra:on_log_interact for log interaction
    eventData.blockComponentRegistry.registerCustomComponent('terra:on_log_interact', {
        // Define the behavior when a player interacts with the block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;

            // Get the selected item from the player's equipment
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // Use a guard clause to check if the selected item is an axe
            if (!selectedItem?.hasTag('minecraft:is_axe')) return;

            // Get the current block state
            const blockState = block.permutation.getState("minecraft:block_face");

            // If block state exists, resolve the stripped log permutation based on the block face
            if (blockState && block?.typeId === 'terra:blue_mahoe_log') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_blue_mahoe_log', { "minecraft:block_face": blockState });

                // Set the block permutation to the stripped log
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:blue_mahoe_wood') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_blue_mahoe_wood', { "minecraft:block_face": blockState });
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:bulnesia_log') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_bulnesia_log', { "minecraft:block_face": blockState });

                // Set the block permutation to the stripped log
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:bulnesia_wood') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_bulnesia_wood', { "minecraft:block_face": blockState });
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:poplar_log') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_poplar_log', { "minecraft:block_face": blockState });

                // Set the block permutation to the stripped log
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:poplar_wood') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_poplar_wood', { "minecraft:block_face": blockState });
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:yellowheart_log') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_yellowheart_log', { "minecraft:block_face": blockState });
                block.setPermutation(strippedLog);
            };
            if (blockState && block?.typeId === 'terra:yellowheart_wood') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_yellowheart_wood', { "minecraft:block_face": blockState });
                block.setPermutation(strippedLog);
            }
            /**
            if (blockState && block?.typeId === 'terra:new_log') {
                const strippedLog = BlockPermutation.resolve('terra:stripped_new_log', {"minecraft:block_face": blockState});
                block.setPermutation(strippedLog);
            }
            **/

            // Play wood step sound effect
            player.playSound('step.wood');

            // Get the durability component of the selected item
            const durability = selectedItem.getComponent('durability');

            // Check if the item has a durability component and if its damage is less than the maximum durability
            if (durability && durability.damage < durability.maxDurability) {
                // Increment the damage of the item, reducing its durability
                durability.damage++;

                // Update the equipment in the player's main hand with the modified item
                equipment.setEquipment(`Mainhand`, selectedItem);
            }

            // Check if the item has a durability component and if its damage is greater than or equal to the maximum durability
            if (durability && durability.damage >= durability.maxDurability) {
                // Play the sound effect for breaking an item
                player.playSound('random.break');

                // Replace the item in the player's main hand with an air block (i.e., remove the item)
                equipment.setEquipment(`Mainhand`, new ItemStack('minecraft:air', 1));
            }
        }
    });
});