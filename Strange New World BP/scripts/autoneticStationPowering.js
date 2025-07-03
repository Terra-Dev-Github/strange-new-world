// this file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:autonetic_station_powering' for powering blocks with redstone
    eventData.blockComponentRegistry.registerCustomComponent('terra:autonetic_station_powering', {
        // define behavior when a player places the block
        beforeOnPlayerPlace: e => {
            e.permutationToPlace = e.permutationToPlace.withState('terra:is_powered', 0);
        },
        onPlayerInteract: (e) => {
            // destructure event data for easier access
            const { block, player, dimension } = e;
            const perm = block.permutation.getState('terra:is_powered');
            const equipment = player.getComponent(`equippable`);
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const location = block.location;

            if (perm > 0) { // if value greater than 0
                block.setPermutation(block.permutation.withState('terra:is_powered', 1)); // disable the power
                // drop the vial
                dimension.spawnItem('terra:vial_radioactive', location)
            };
            if (perm <= 0) { // if value less than or equal to 0
                if (selectedItem?.typeId === 'terra:vial_radioactive') {
                    // reduce the player's item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment(`Mainhand`, selectedItem);
                        } else if (selectedItem.amount === 1) {
                            equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                        }
                    };
                    block.setPermutation(block.permutation.withState('terra:is_powered', 1)); // enable the power
                }
            };
        }
    });
});