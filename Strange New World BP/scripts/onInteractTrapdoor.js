// This file was made by Kaiōga (@Kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world, BlockPermutation } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named terra:on_trapdoor_interact for trapdoor interaction
    eventData.blockComponentRegistry.registerCustomComponent('terra:on_trapdoor_interact', {
        // Define the behavior when a player interacts with the trapdoor block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Get the current state of the 'terra:open' block trait
            const currentState = block.permutation.getState('terra:open');

            // Determine the new state of the 'terra:open' block trait (toggle between true and false)
            const newOpenState = !currentState;

            // Resolve the new block permutation based on the current block type and updated states
            const newPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'terra:open': newOpenState
            });

            // Set the block permutation to the newly resolved permutation
            block.setPermutation(newPermutation);

            // Determine the sound effect to play based on the current state of the trapdoor
            const sound = currentState ? 'open.wooden_trapdoor' : 'close.wooden_trapdoor';

            // Play the corresponding sound effect for opening or closing the trapdoor
            player.playSound(sound);

            // Check if the selected item is a water bucket
            if (selectedItem?.typeId === 'minecraft:water_bucket') {
                // Play sound effect
                player.playSound('bucket.empty_water');
                // If not in creative mode, replace water bucket with empty bucket
                if (player.getGameMode() !== "creative") {
                    equipment.setEquipment('Mainhand', new ItemStack('minecraft:bucket', 1));
                }
            }

            // Array of trapdoors
            const trapdoorIds = [
                'terra:blue_mahoe_trapdoor',
                'terra:bulnesia_trapdoor',
                'terra:poplar_trapdoor',
                'terra:yellowheart_trapdoor'
            ]

            // Check if the block interacted is a terra:trapdoor and the player is using a water bucket
            if (block.typeId === trapdoorIds && selectedItem?.typeId === 'minecraft:water_bucket') {
                // Save the current block states
                const currentStates = block.permutation.getAllStates();

                // Get the structure file with our trapdoor block waterlogged
                const trapdoorType = block.typeId.split(':')[1];
                const structureName = `trapdoors:${trapdoorType}`;

                // Place the structure
                const { x, y, z } = block.location;
                world.structureManager.place(structureName, e.dimension, { x, y, z });

                // Get the new block at the same location
                const newBlock = e.dimension.getBlock({ x, y, z });

                // Reapply the old block states to the new block
                const newStates = { ...newBlock.permutation.getAllStates(), ...currentStates };
                const newPermutation = BlockPermutation.resolve(newBlock.typeId, newStates);
                newBlock.setPermutation(newPermutation);
            }
        }
    });
    // Register a separate component named terra:on_lab_trapdoor_interact for the laboratory trapdoor interaction
    eventData.blockComponentRegistry.registerCustomComponent('terra:on_lab_trapdoor_interact', {
        // Define the behavior when a player interacts with the trapdoor block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;

            // Get the current state of the 'terra:open' block trait
            const currentState = block.permutation.getState('terra:open');

            // Determine the new state of the 'terra:open' block trait (toggle between true and false)
            const newOpenState = !currentState;

            // Resolve the new block permutation based on the current block type and updated states
            const newPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'terra:open': newOpenState
            });

            // Set the block permutation to the newly resolved permutation
            block.setPermutation(newPermutation);

            // Determine the sound effect to play based on the current state of the trapdoor
            const sound = currentState ? 'open.laboratory_door' : 'close.laboratory_door';

            // Play the corresponding sound effect for opening or closing the trapdoor
            player.playSound(sound);
        }
    });
});