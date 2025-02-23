// This file was made by Kaiōga (@kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world, BlockPermutation } from '@minecraft/server';

// Create a Map to keep track of processed blocks
const processedBlocks = new Map();

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named 'terra:door_events' for door interaction
    eventData.blockComponentRegistry.registerCustomComponent('terra:door_events', {
        // Define the behavior when a player interacts with the door block
        onPlayerInteract: (e) => {
            // Destructure event data for easier access
            const { block, player } = e;
            const isUpperBlock = block.permutation.getState('terra:upper_block_bit');

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Determine the target block to update
            const targetBlock = isUpperBlock ? block.below() : block.above();

            // Get the current state of the 'terra:open_bit' block trait for both the interacted block and the target block
            const currentOpenState = block.permutation.getState('terra:open_bit');
            const targetOpenState = targetBlock.permutation.getState('terra:open_bit');

            // Determine the new state of the 'terra:open_bit' block trait (toggle between true and false)
            const newOpenState = !currentOpenState;
            const newTargetOpenState = !targetOpenState;

            // Resolve the new block permutation based on the current block type and updated states
            const newBlockPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'terra:open_bit': newOpenState
            });

            const newTargetBlockPermutation = BlockPermutation.resolve(targetBlock.typeId, {
                ...targetBlock.permutation.getAllStates(),
                'terra:open_bit': newTargetOpenState
            });

            // Set the block permutations to the newly resolved permutations
            block.setPermutation(newBlockPermutation);
            targetBlock.setPermutation(newTargetBlockPermutation);

            // Determine the sound effect to play based on the current state of the door
            const sound = currentOpenState ? 'close.wooden_door' : 'open.wooden_door';

            // Play the corresponding sound effect for opening or closing the door
            player.playSound(sound);

            // Check if the selected item is a water bucket
            if (selectedItem?.typeId === 'minecraft:water_bucket') {
                // Play sound effect
                player.playSound('bucket.empty_water');
                // If not in creative mode, replace water bucket with empty bucket
                if (player.getGameMode() !== "creative") {
                    equipment.setEquipment('Mainhand', new ItemStack('minecraft:bucket', 1));
                };
                // Save the current block states
                const currentStates = block.permutation.getAllStates();

                // Split the block identifier and use only the part after the colon
                const doorName = block.typeId.split(':')[1];

                // Get the structure file with our door block waterlogged
                const structureName = `doors:${doorName}`;

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
        },
        // Define behavior when a player places the block
        onPlace: (e) => {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();
            const northBlock = block.north(); // Get the block to the east
            const southBlock = block.south(); // Get the block to the east
            const eastBlock = block.east(); // Get the block to the east
            const westBlock = block.west(); // Get the block to the east
            const { x, y, z } = block.location;

            // Check if the block has already been processed
            if (processedBlocks.has(`${x},${y},${z}`)) {
                return; // Exit early if block has already been processed
            }

            // Get all current block states
            const currentStates = block.permutation.getAllStates();

            // Get the cardinal direction of the block
            const cardinalDirection = currentStates['minecraft:cardinal_direction'];

            // Check if the block above is air
            if (aboveBlock.typeId === 'minecraft:air' && !block.permutation.getState('terra:upper_block_bit')) {
                // Create a new permutation for the block above with the cardinal direction
                const aboveBlockPermutation = BlockPermutation.resolve(block.typeId, {
                    'terra:upper_block_bit': true,
                    'minecraft:cardinal_direction': cardinalDirection
                });
                aboveBlock.setPermutation(aboveBlockPermutation);

                // Update the block's permutation with the new state
                const newPermutation = BlockPermutation.resolve(block.typeId, currentStates);

                // Apply the new permutation to the block
                block.setPermutation(newPermutation);
            } // Check if the block above is not air and the current block is not an upper block



            // Check if the cardinal direction of the block is south
            if (cardinalDirection === 'south' && eastBlock?.typeId === block?.typeId) {
                const eastBlockStates = eastBlock.permutation.getAllStates();
                // Check if the east block is the same with terra:door_hinge_bit set to false
                if (!eastBlockStates['terra:door_hinge_bit']) {
                    // Change the terra:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'terra:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the east of the above block is the same
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const eastBlockAbove = aboveBlock.east();
                if (
                    aboveBlockCardinalDirection === 'south' &&
                    eastBlockAbove?.typeId === block?.typeId
                ) {
                    const eastBlockAboveStates = eastBlockAbove.permutation.getAllStates();
                    // Check if the east block above is the same with terra:door_hinge_bit set to false
                    if (!eastBlockAboveStates['terra:door_hinge_bit']) {
                        // Change the terra:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...eastBlockAboveStates,
                            'terra:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is east
            if (cardinalDirection === 'east' && northBlock?.typeId === block?.typeId) {
                const northBlockStates = northBlock.permutation.getAllStates();
                // Check if the north block is the same with terra:door_hinge_bit set to false
                if (!northBlockStates['terra:door_hinge_bit']) {
                    // Change the terra:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'terra:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the north of the above block is the same
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const northBlockAbove = aboveBlock.north();
                if (
                    aboveBlockCardinalDirection === 'east' &&
                    northBlockAbove?.typeId === block?.typeId
                ) {
                    const northBlockAboveStates = northBlockAbove.permutation.getAllStates();
                    // Check if the north block above is the same with terra:door_hinge_bit set to false
                    if (!northBlockAboveStates['terra:door_hinge_bit']) {
                        // Change the terra:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...northBlockAboveStates,
                            'terra:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is north
            if (cardinalDirection === 'north' && westBlock?.typeId === block?.typeId) {
                const westBlockStates = westBlock.permutation.getAllStates();
                // Check if the west block is the same with terra:door_hinge_bit set to false
                if (!westBlockStates['terra:door_hinge_bit']) {
                    // Change the terra:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'terra:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the west of the above block is the same
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const westBlockAbove = aboveBlock.west();
                if (
                    aboveBlockCardinalDirection === 'north' &&
                    westBlockAbove?.typeId === block?.typeId
                ) {
                    const westBlockAboveStates = westBlockAbove.permutation.getAllStates();
                    // Check if the west block above is the same with terra:door_hinge_bit set to false
                    if (!westBlockAboveStates['terra:door_hinge_bit']) {
                        // Change the terra:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...westBlockAboveStates,
                            'terra:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is west
            if (cardinalDirection === 'west' && southBlock?.typeId === block?.typeId) {
                const southBlockStates = southBlock.permutation.getAllStates();
                // Check if the south block is the same with terra:door_hinge_bit set to false
                if (!southBlockStates['terra:door_hinge_bit']) {
                    // Change the terra:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'terra:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the south of the above block is the same
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const southBlockAbove = aboveBlock.south();
                if (
                    aboveBlockCardinalDirection === 'west' &&
                    southBlockAbove?.typeId === block?.typeId
                ) {
                    const southBlockAboveStates = southBlockAbove.permutation.getAllStates();
                    // Check if the south block above is the same with terra:door_hinge_bit set to false
                    if (!southBlockAboveStates['terra:door_hinge_bit']) {
                        // Change the terra:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...southBlockAboveStates,
                            'terra:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Mark the block as processed
            processedBlocks.set(`${x},${y},${z}`, true);
        },

        onTick: (e) => {
            // Destructure event data for easier access
            const { block } = e;
            const { x, y, z } = block.location;
            const blockKey = `${x},${y},${z}`;
            const currentState = block.permutation.getState('terra:open_bit');
            const sound = currentState ? 'open.wooden_trapdoor' : 'close.wooden_trapdoor';

            // Get adjacent blocks
            const adjacentBlocks = {
                north: block.north(),
                east: block.east(),
                south: block.south(),
                west: block.west(),
                above: block.above(),
                below: block.below()
            };

            // Define blocks excluded from redstone functionality
            const excludedBlocks = [
                'minecraft:wooden_door', 'minecraft:iron_door', 'minecraft:acacia_door', 'minecraft:birch_door',
                'minecraft:crimson_door', 'minecraft:dark_oak_door', 'minecraft:jungle_door', 'minecraft:oak_door',
                'minecraft:spruce_door', 'minecraft:warped_door', 'minecraft:mangrove_door', 'minecraft:cherry_door',
                'minecraft:bamboo_door', 'minecraft:iron_trapdoor', 'minecraft:acacia_trapdoor', 'minecraft:birch_trapdoor',
                'minecraft:crimson_trapdoor', 'minecraft:dark_oak_trapdoor', 'minecraft:jungle_trapdoor', 'minecraft:oak_trapdoor',
                'minecraft:spruce_trapdoor', 'minecraft:warped_trapdoor', 'minecraft:mangrove_trapdoor', 'minecraft:cherry_trapdoor',
                'minecraft:bamboo_trapdoor', 'minecraft:trapdoor', 'minecraft:observer', 'minecraft:unpowered_repeater',
                'minecraft:powered_repeater', 'minecraft:unpowered_comparator', 'minecraft:powered_comparator'
            ];

            // Check if any adjacent blocks have redstone power, excluding certain block types
            const hasRedstonePower = Object.values(adjacentBlocks).some(adjacentBlock =>
                !excludedBlocks.includes(adjacentBlock?.typeId) && adjacentBlock?.getRedstonePower() > 0
            );

            // Check if there's a redstone torch directly above the block
            const isRedstoneTorchTop = adjacentBlocks.above?.typeId === 'minecraft:redstone_torch' &&
                adjacentBlocks.above.permutation.getState('torch_facing_direction') === 'top';

            // Define blocks that should be destroyed when receiving redstone power and in a specific position
            const destroyableBlocksArray = [
                'minecraft:wooden_button', 'minecraft:stone_button', 'minecraft:oak_button', 'minecraft:spruce_button',
                'minecraft:birch_button', 'minecraft:jungle_button', 'minecraft:acacia_button', 'minecraft:dark_oak_button',
                'minecraft:crimson_button', 'minecraft:warped_button', 'minecraft:polished_blackstone_button', 'minecraft:mangrove_button',
                'minecraft:cherry_button', 'minecraft:bamboo_button', 'minecraft:wooden_pressure_plate', 'minecraft:stone_pressure_plate',
                'minecraft:light_weighted_pressure_plate', 'minecraft:heavy_weighted_pressure_plate', 'minecraft:acacia_pressure_plate',
                'minecraft:birch_pressure_plate', 'minecraft:crimson_pressure_plate', 'minecraft:dark_oak_pressure_plate',
                'minecraft:jungle_pressure_plate', 'minecraft:spruce_pressure_plate', 'minecraft:warped_pressure_plate',
                'minecraft:mangrove_pressure_plate', 'minecraft:cherry_pressure_plate', 'minecraft:bamboo_pressure_plate',
                'minecraft:polished_blackstone_pressure_plate'
            ];

            // Check if the block above is a destroyable block and is powered
            const destroyableBlocks = destroyableBlocksArray.includes(adjacentBlocks.above?.typeId) &&
                adjacentBlocks.above?.getRedstonePower() > 0;

            // Check if an adjacent observer is facing the block and is powered
            const observerFacingBlock = [
                { block: adjacentBlocks.north, direction: 'north' },
                { block: adjacentBlocks.east, direction: 'east' },
                { block: adjacentBlocks.south, direction: 'south' },
                { block: adjacentBlocks.west, direction: 'west' },
                { block: adjacentBlocks.above, direction: 'up' },
                { block: adjacentBlocks.below, direction: 'down' }
            ].some(({ block, direction }) => block?.typeId === 'minecraft:observer' &&
                block?.permutation.getState('minecraft:facing_direction') === direction && block?.getRedstonePower() > 1);

            // Check if an adjacent powered repeater is facing the block
            const poweredRepeater = [
                { block: adjacentBlocks.north, direction: 'north' },
                { block: adjacentBlocks.east, direction: 'east' },
                { block: adjacentBlocks.south, direction: 'south' },
                { block: adjacentBlocks.west, direction: 'west' }
            ].some(({ block, direction }) => block?.typeId === 'minecraft:powered_repeater' &&
                block?.permutation.getState('minecraft:cardinal_direction') === direction);

            // Check if an adjacent powered comparator is facing the block
            const poweredComparator = [
                { block: adjacentBlocks.north, direction: 'north' },
                { block: adjacentBlocks.east, direction: 'east' },
                { block: adjacentBlocks.south, direction: 'south' },
                { block: adjacentBlocks.west, direction: 'west' }
            ].some(({ block, direction }) => block?.typeId === 'minecraft:powered_comparator' &&
                block?.permutation.getState('minecraft:cardinal_direction') === direction);

            // Retrieve the previous state of the block from the Map
            const previousState = blockStates.get(blockKey) || false;

            // Determine if the block should open or close based on redstone power and other conditions
            const shouldOpen = (hasRedstonePower || observerFacingBlock || poweredRepeater || poweredComparator) && !previousState && !isRedstoneTorchTop;
            const shouldClose = (!hasRedstonePower && !observerFacingBlock && !poweredRepeater && !poweredComparator) && previousState && !isRedstoneTorchTop;

            // Update the block's state if necessary
            if (shouldOpen || shouldClose) {
                const newState = shouldOpen;
                block.setPermutation(block.permutation.withState('terra:open_bit', newState));
                block.dimension.playSound(sound, block.location);
                blockStates.set(blockKey, newState);

                // Additional logic to update the corresponding part of the door
                const isUpperBlock = block.permutation.getState('terra:upper_block_bit');
                const correspondingBlock = isUpperBlock ? adjacentBlocks.below : adjacentBlocks.above;

                if (correspondingBlock?.typeId === block?.typeId) {
                    correspondingBlock.setPermutation(correspondingBlock.permutation.withState('terra:open_bit', newState));
                }
            }

            // Destroy the block above if necessary
            if (destroyableBlocks) {
                block.dimension.runCommand(`/setblock ${x} ${y + 1} ${z} air destroy`);
            }
        }
    });
});

// Subscribe to the 'playerBreakBlock' event to remove processed block entry
world.afterEvents.playerBreakBlock.subscribe(eventData => {
    const { block } = eventData;
    const { x, y, z } = block.location;

    // Remove the block's entry from the processedBlocks map
    processedBlocks.delete(`${x},${y},${z}`);

    // Check if the block above or below the destroyed block is also the same
    const aboveBlock = block.above();
    const belowBlock = block.below();

    // Define an array of doors
    const doorArray = [
        'terra:blue_mahoe_door',
        'terra:bulnesia_door',
        'terra:poplar_door',
        'terra:yellowheart_door',
        'terra:laboratory_door'
    ];
    
    if (doorArray.includes(belowBlock?.typeId)) {
        belowBlock.setType('minecraft:air');
        processedBlocks.delete(`${x},${y - 1},${z}`); // Remove the below block's entry
    } else if (doorArray.includes(aboveBlock?.typeId)) {
        aboveBlock.setType('minecraft:air');
        processedBlocks.delete(`${x},${y + 1},${z}`); // Remove the above block's entry
    }
});

world.beforeEvents.playerPlaceBlock.subscribe(event => {
    const { block } = event;
    const aboveBlock = block.above();
    const doorArray = [
        'terra:blue_mahoe_door',
        'terra:bulnesia_door',
        'terra:poplar_door',
        'terra:yellowheart_door',
        'terra:laboratory_door'
    ];

    if (doorArray.includes(block?.typeId) && aboveBlock.typeId !== 'minecraft:air') {
        event.cancel = true;
    }
});