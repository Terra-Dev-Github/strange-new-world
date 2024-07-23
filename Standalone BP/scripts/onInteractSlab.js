// This file was made by Kaiōga (@Kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world, ItemStack } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named terra:on_slab_interact for slab interaction 
    eventData.blockTypeRegistry.registerCustomComponent('terra:on_slab_interact', {
        // Define the behavior when a player interacts with the slab
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player, face } = e;

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // Check if the selected item is a slab and the block is not already double
            if (selectedItem?.typeId === block.typeId && !block.permutation.getState('terra:double')) {
                // Check if the interaction is valid based on vertical half and face
                const verticalHalf = block.permutation.getState('minecraft:vertical_half');
                const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
                const isTopDown = verticalHalf === 'top' && face === 'Down';
                if (isBottomUp || isTopDown) {
                    // Reduces item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment(`Mainhand`, selectedItem);
                        } else if (selectedItem.amount === 1) {
                            equipment.setEquipment(`Mainhand`, undefined); // Clear the slot if only 1 item left
                        }
                    }
                    // Set block to double and remove water if present
                    block.setPermutation(block.permutation.withState('terra:double', true));
                    block.setWaterlogged(false);
                    // Play sound effect
                    player.playSound('use.stone');
                }
            }

            // Check if the selected item is a water bucket and the block is not waterlogged or double
            if (selectedItem?.typeId === 'minecraft:water_bucket' && !block.permutation.getState('terra:waterlogged') && !block.permutation.getState('terra:double')) {
                // Play sound effect
                player.playSound('bucket.empty_water');
                // If not in creative mode, replace water bucket with empty bucket
                if (player.getGameMode() !== "creative") {
                    equipment.setEquipment(`Mainhand`, new ItemStack('minecraft:bucket', 1));
                }
                // Set block to waterlogged and place corresponding structure
                block.setPermutation(block.permutation.withState('terra:waterlogged', true));
                const verticalHalf = block.permutation.getState('minecraft:vertical_half');
                // Split the block identifier and use only the part after the colon
                const slabType = block.typeId.split(':')[1];
                // These structures contain the waterlogged slabs, made with an NBT editor
                const structureName = (verticalHalf === 'bottom') ? `slabs:${slabType}_bottomSlab` : `slabs:${slabType}_topSlab`;
                const { x, y, z } = block;
                world.structureManager.place(structureName, e.dimension, { x, y, z });
            }
        }
    });
});