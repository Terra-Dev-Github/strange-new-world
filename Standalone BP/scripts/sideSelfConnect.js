// This file was made by Kaiōga (@Kaioga5), and modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// Import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named terra:side_self_connect for blocks that only connect to themselves in a horizontal plane
    eventData.blockTypeRegistry.registerCustomComponent('terra:side_self_connect', {
        onTick(e) {
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
});