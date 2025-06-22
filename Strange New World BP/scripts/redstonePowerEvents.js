// this file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// create a map to keep track of processed blocks
const blockStates = new Map();

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:redstone_events' for powering blocks with redstone
    eventData.blockComponentRegistry.registerCustomComponent('terra:redstone_events', {
        // define behavior when a player places the block
        beforeOnPlayerPlace: e => {
            e.permutationToPlace = e.permutationToPlace.withState('terra:redstone_powered', 0);
        },
        onTick: (e) => {
            // destructure event data for easier access
            const { block } = e;
            const hasRedstonePower = block.getRedstonePower();

            if (hasRedstonePower > 0) { // if value greater than 0
                block.setPermutation(block.permutation.withState('terra:redstone_powered', 1)); // enable the power
            };
            if (hasRedstonePower <= 0) { // if value less than or equal to 0
                block.setPermutation(block.permutation.withState('terra:redstone_powered', 0)); // disable the power
            };
        }
    });
});