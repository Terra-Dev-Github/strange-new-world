// This file was made by Kaiōga (@Kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named terra:side_self_connect for blocks that only connect to themselves in a horizontal plane
    eventData.blockComponentRegistry.registerCustomComponent('terra:side_self_connect', {
        onTick: (e) => {
            // Destructure event data for easier access
            const { block } = e;

            // Get adjacent blocks
            const north = block.north();
            const east = block.east();
            const south = block.south();
            const west = block.west();

            // Update block states based on the presence of adjacent blocks that match the one placed
            if (north?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:south_connect', north ? 1 : 0));
            else block.setPermutation(block.permutation.withState('terra:south_connect', 0));

            if (south?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:north_connect', south ? 1 : 0));
            else block.setPermutation(block.permutation.withState('terra:north_connect', 0));

            if (east?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:west_connect', east ? 1 : 0));
            else block.setPermutation(block.permutation.withState('terra:west_connect', 0));

            if (west?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:east_connect', west ? 1 : 0));
            else block.setPermutation(block.permutation.withState('terra:east_connect', 0));
        }
    });
    // Register a custom component named 'terra:panel_connect' for wall blocks that only connect in a horizontal plane
    eventData.blockComponentRegistry.registerCustomComponent('terra:panel_connect', {
        onTick: (e) => {
            // Destructure event data for easier access
            const { block } = e;

            // Get adjacent blocks
            const north = block.north();
            const east = block.east();
            const south = block.south();
            const west = block.west();

            // Define an array of block types to exclude from connections
            const excludeBlocksArray = [
                'minecraft:air',
                'minecraft:snow_layer',
                'minecraft:wooden_door',
                'minecraft:iron_door',
                'minecraft:acacia_door',
                'minecraft:birch_door',
                'minecraft:crimson_door',
                'minecraft:dark_oak_door',
                'minecraft:jungle_door',
                'minecraft:oak_door',
                'minecraft:spruce_door',
                'minecraft:warped_door',
                'minecraft:mangrove_door',
                'minecraft:cherry_door',
                'minecraft:bamboo_door',
                'minecraft:iron_trapdoor',
                'minecraft:acacia_trapdoor',
                'minecraft:birch_trapdoor',
                'minecraft:crimson_trapdoor',
                'minecraft:dark_oak_trapdoor',
                'minecraft:jungle_trapdoor',
                'minecraft:oak_trapdoor',
                'minecraft:spruce_trapdoor',
                'minecraft:warped_trapdoor',
                'minecraft:mangrove_trapdoor',
                'minecraft:cherry_trapdoor',
                'minecraft:bamboo_trapdoor',
                'minecraft:trapdoor',
                // excluded custom blocks from other add-ons
                'terra:blue_mahoe_door',
                'terra:blue_mahoe_trapdoor',
                'terra:bulnesia_door',
                'terra:bulnesia_trapdoor',
                'terra:poplar_door',
                'terra:poplar_trapdoor',
                'terra:yellowheart_door',
                'terra:yellowheart_trapdoor',
                'terra:laboratory_door',
                'terra:laboratory_trapdoor'
                // Add other block types you want to exclude
            ];

            // Check if the adjacent block is not in the excludeBlocksArray
            const northConnects = !excludeBlocksArray.includes(north?.typeId);
            const eastConnects = !excludeBlocksArray.includes(east?.typeId);
            const southConnects = !excludeBlocksArray.includes(south?.typeId);
            const westConnects = !excludeBlocksArray.includes(west?.typeId);

            // Update block states based on the presence of adjacent blocks
            block.setPermutation(block.permutation.withState('terra:north', northConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('terra:south', southConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('terra:east', eastConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('terra:west', westConnects ? 1 : 0));
        }
    })
});