// This file was made by Poggy (@XxPoggyisLitxX), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

import { world } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('terra:leaves_decay', {
        beforeOnPlayerPlace: e => {
            e.permutationToPlace = e.permutationToPlace.withState('terra:should_decay', 1);
        },
        onRandomTick: e => {
            const validLogBlocks = [
                "minecraft:oak_log",
                "minecraft:oak_wood",
                "minecraft:birch_log",
                "minecraft:birch_wood",
                "minecraft:spruce_log",
                "minecraft:spruce_wood",
                "minecraft:acacia_log",
                "minecraft:acacia_wood",
                "minecraft:dark_oak_log",
                "minecraft:dark_oak_wood",
                "minecraft:cherry_log",
                "minecraft:cherry_wood",
                "minecraft:mangrove_log",
                "minecraft:mangrove_wood",
                "minecraft:jungle_log",
                "minecraft:jungle_wood",
                "terra:blue_mahoe_log",
                "terra:blue_mahoe_wood",
                "terra:bulnesia_log",
                "terra:bulnesia_wood",
                "terra:poplar_log",
                "terra:poplar_wood",
                "terra:yellowheart_log",
                "terra:yellowheart_wood",
            ]
            const loc = e.block.location;
            const radius = 3; // Change this value to adjust the radius

            function isWithinSphere(blockLoc, center, radius) {
                const dx = blockLoc.x - center.x;
                const dy = blockLoc.y - center.y;
                const dz = blockLoc.z - center.z;
                const distanceSquared = dx * dx + dy * dy + dz * dz;
                return distanceSquared <= radius * radius;
            }

            let foundLog = false; // Flag to track if a log is found
            // Iterate through blocks within a spheric area
            for (let xOffset = -radius; xOffset <= radius; xOffset++) {
                for (let yOffset = -radius; yOffset <= radius; yOffset++) {
                    for (let zOffset = -radius; zOffset <= radius; zOffset++) {
                        const blockLoc = {
                            x: loc.x + xOffset,
                            y: loc.y + yOffset,
                            z: loc.z + zOffset,
                        };
                        // Check if the block is within the sphere radius
                        if (isWithinSphere(blockLoc, loc, radius)) {
                            const block = e.block.dimension.getBlock(getMaterial(blockLoc)); // Get block using getMaterial
                            const foundValidLog = validLogBlocks.find(logType => logType === block?.typeId);
                            // Check for any log type (modify as needed)
                            if (foundValidLog) {
                                foundLog = true; // Set flag if a log is found
                                break; // Exit the inner loop if a log is found within this layer
                            }
                        }
                    }
                }
                // Check the flag after processing a layer
                if (foundLog) {
                    break; // Exit the outermost loop if a log is found in any layer
                }
            }
            // Set block to air and spawn loot table only if no log was found
            if (!foundLog) {
                if (e.block.permutation.getState('terra:should_decay') === 0) {
                    e.block.setType('air');
                    // specify loot drop depending on leaves (for saplings and what not)
                    if (e.block?.typeId === 'terra:bulnesia_leaves') e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/custom_leaves"`);
                    if (e.block?.typeId === 'terra:blue_mahoe_leaves') e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/custom_leaves"`);
                    if (e.block?.typeId === 'terra:poplar_leaves') e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/custom_leaves"`);
                    if (e.block?.typeId === 'terra:yellowheart_leaves') e.block.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot "blocks/custom_leaves"`);
                }
            }

            // Helper function to potentially avoid unnecessary block lookups
            function getMaterial(blockLoc) {
                return blockLoc;
            }
        },
        // drop the block only if mined with shears
        onPlayerDestroy: (e) => {
            // destructure event data for easier access
            const { player } = e;
            const { destroyedBlockPermutation: perm } = e;

            // define constants
            const selectedItem = player.getComponent('equippable').getEquipment(`Mainhand`);
            const location = e.block.location;
            const dimension = e.block.dimension;

            // check if the selected item are shears
            if (selectedItem.typeId !== 'minecraft:shears') return;

            // use destroyedBlockPermutation to get the ItemStack directly, and spawn the item at the destroyed block location
            const leaf = perm.getItemStack(1);
            if (leaf) dimension.spawnItem(leaf, location);
        }
    });
});


