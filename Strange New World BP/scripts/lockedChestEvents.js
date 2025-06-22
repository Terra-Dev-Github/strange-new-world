// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// subscribe to the `worldInitialize` event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named `terra:on_locked_chest_interact` for the block behavior
    eventData.blockComponentRegistry.registerCustomComponent('terra:on_locked_chest_interact', {
        // grow the crop when bonemealed
        onPlayerInteract: (e) => {
            // destructure event data for easier access
            const { block, player, dimension } = e;
            const location = e.block.location;

            // define block states
            const chance = Math.random();
            const perm = block.permutation;
            const lockedState = perm.getState("terra:is_unlocked");

            // get the selected item from the player
            const equipment = player.getComponent(`equippable`);
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // whole code
            // check if the selected item is the corresponding key and the crate is locked
            if (block?.typeId === `terra:deepslate_crate_locked` && lockedState === 0) {
                if (selectedItem?.typeId === `terra:deepslate_key`) {
                    // reduce the player's item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment(`Mainhand`, selectedItem);
                        } else if (selectedItem.amount === 1) {
                            equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                        }
                    };

                    // set the block state to unlocked
                    block.setPermutation(perm.withState("terra:is_unlocked", lockedState + 1));
                    // play sound effect & spawn particles
                    dimension.playSound(`item.key.use`, location);
                    dimension.runCommandAsync(`particle terra:chestlock_open ${location.x} ${location.y} ${location.z}`);

                    if (chance <= 2 / 3) { // spawn loot and drop an empty crate variant
                        dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                        dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/deepslate_locked"`);
                        dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/deepslate_empty"`);
                    } else if (chance <= 1 / 3) {  // a third chance of turning into a chesthound
                        dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                        dimension.runCommandAsync(`summon terra:chesthound_deepslate ${location.x} ${location.y} ${location.z}`);
                    }
                } else if (selectedItem.typeId !== `terra:deepslate_key`) {
                    // remind the player that the crate is locked
                    dimension.runCommandAsync(`function notif/crate_is_locked`);
                }
            } else if (block?.typeId === `terra:deepslate_crate_locked` && lockedState === 1) {
                if (chance <= 2 / 3) { // spawn loot and drop an empty crate variant
                    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/deepslate_locked"`);
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/deepslate_empty"`);
                } else if (chance <= 1 / 3) {  // a third chance of turning into a chesthound
                    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                    dimension.runCommandAsync(`summon terra:chesthound_deepslate ${location.x} ${location.y} ${location.z}`);
                }
            };

            // check if the selected item is the corresponding key and the crate is locked
            if (block?.typeId === `terra:outsider_crate_locked` && lockedState === 0) {
                if (selectedItem?.typeId === `terra:outsider_key`) {
                    // reduce the player's item count if not in creative mode
                    if (player.getGameMode() !== "creative") {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment(`Mainhand`, selectedItem);
                        } else if (selectedItem.amount === 1) {
                            equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                        }
                    };

                    // set the block state to unlocked
                    block.setPermutation(perm.withState("terra:is_unlocked", lockedState + 1));
                    // play sound effect & spawn particles
                    dimension.playSound(`item.key.use`, location);
                    dimension.runCommandAsync(`particle terra:chestlock_open ${location.x} ${location.y} ${location.z}`);

                    if (chance <= 2 / 3) { // spawn loot and drop an empty crate variant
                        dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                        dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/outsider_locked"`);
                        dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/outsider_empty"`);
                    } else if (chance <= 1 / 3) {  // a third chance of turning into a chesthound
                        dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                        dimension.runCommandAsync(`summon terra:chesthound_outsider ${location.x} ${location.y} ${location.z}`);
                    }
                } else if (selectedItem.typeId !== `terra:outsider_key`) {
                    // remind the player that the crate is locked
                    dimension.runCommandAsync(`function notif/crate_is_locked`);
                }
            } else if (block?.typeId === `terra:outsider_crate_locked` && lockedState === 1) {
                if (chance <= 2 / 3) { // spawn loot and drop an empty crate variant
                    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/outsider_locked"`);
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "chestlock/outsider_empty"`);
                } else if (chance <= 1 / 3) {  // a third chance of turning into a chesthound
                    dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                    dimension.runCommandAsync(`summon terra:chesthound_outsider ${location.x} ${location.y} ${location.z}`);
                }
            };

            // default chesthound spawn
            if (block?.typeId === `terra:chesthound_block`) {
                dimension.runCommandAsync(`particle terra:chestlock_open ${location.x} ${location.y} ${location.z}`);
                dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                dimension.runCommandAsync(`summon terra:chesthound ${location.x} ${location.y} ${location.z}`);
            } else if (block.typeId !== `terra:chesthound_block`) return;
        },

        onPlayerDestroy: (e) => {
            // destructure event data for easier access
            const { block, dimension } = e;
            const location = e.block.location;

            // return if the block isn't a default chesthound
            if (block.typeId !== 'terra:chesthound_block') return;

            // default chesthound spawn
            if (block?.typeId === 'terra:chesthound_block') {
                dimension.runCommandAsync(`particle terra:chestlock_open ${location.x} ${location.y} ${location.z}`);
                dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                dimension.runCommandAsync(`summon terra:chesthound ${location.x} ${location.y} ${location.z}`);
            }
        }
    });
});