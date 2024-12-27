// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { BlockPermutation, world } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:jukebox_properties' for the block behavior (one-off jukebox replica)
    eventData.blockComponentRegistry.registerCustomComponent('terra:jukebox_properties', {
        onPlayerInteract: (e) => {
            // destructure event data for easier access
            const { block, player, dimension } = e;
            const location = e.block.location;

            // define block states
            const perm = block.permutation;
            const hasDisc = perm.getState("terra:has_disc");

            // get the selected item from the player
            const equipment = player.getComponent(`equippable`);
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // logic
            if (block?.typeId === 'terra:music_siren') {
                if (hasDisc === 0) {
                    if (selectedItem?.typeId === 'terra:record_wtb') {
                        // reduce the player's item count if not in creative mode
                        if (player.getGameMode() !== "creative") {
                            if (selectedItem.amount > 1) {
                                selectedItem.amount -= 1;
                                equipment.setEquipment(`Mainhand`, selectedItem);
                            } else if (selectedItem.amount === 1) {
                                equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                            }
                        };

                        // set the block state to load the corresponding disc
                        block.setPermutation(perm.withState("terra:has_disc", 1));
                        // play the music
                        dimension.playSound(`record.wtb`, location);
                        player.onScreenDisplay.setActionBar({ text: `§d`, translate: `record.nowPlaying`, with: `item.record_long_gone.desc` })
                    }
                };
                if (hasDisc === 1) {
                    // set the block state to empty, cancel the music
                    block.setPermutation(perm.withState("terra:has_disc", 0));
                    // does not accept value of 0, so i gotta really slim it down
                    dimension.playSound(`record.long_gone`, location, { volume: 0.0000000000000000001 })
                    // drop the disc
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/long_gone"`);
                }
            };

            if (block?.typeId === 'terra:jukebox_placeholder') {
                if (hasDisc === 0) { // is empty but i gotta get preventive
                    block.setPermutation(BlockPermutation.resolve('minecraft:jukebox'))
                    // does not accept value of 0, so i gotta really slim it down
                    dimension.playSound(`record.wtb`, location, { volume: 0.0000000000000000001 })
                };
                if (hasDisc === 1) {
                    block.setPermutation(BlockPermutation.resolve('minecraft:jukebox'))
                    // does not accept value of 0, so i gotta really slim it down
                    dimension.playSound(`record.long_gone`, location, { volume: 0.0000000000000000001 })
                    // drop the disc
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/wtb"`);
                };
                if (hasDisc === 2) {
                    block.setPermutation(BlockPermutation.resolve('minecraft:jukebox'))
                    // does not accept value of 0, so i gotta really slim it down
                    dimension.playSound(`record.long_gone`, location, { volume: 0.0000000000000000001 })
                    // drop the disc
                    dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/long_gone"`);
                }
            };
        },
        // spawns the loot
        onPlayerDestroy: (e) => {
            const { block, dimension } = e;
            const location = block.location;
            const hasDisc = block.permutation.getState("terra:has_disc");

            if (block?.typeId === 'terra:music_siren' && hasDisc === 1) {
                // does not accept value of 0, so i gotta really slim it down
                dimension.playSound(`record.long_gone`, location, { volume: 0.0000000000000000001 })
                // drop the disc
                dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/long_gone"`);
            };
            if (block?.typeId === 'terra:jukebox_placeholder' && hasDisc === 1) {
                // does not accept value of 0, so i gotta really slim it down
                dimension.playSound(`record.wtb`, location, { volume: 0.0000000000000000001 })
                // drop the disc
                dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/wtb"`);
            };
            if (block?.typeId === 'terra:jukebox_placeholder' && hasDisc === 2) {
                // does not accept value of 0, so i gotta really slim it down
                dimension.playSound(`record.long_gone`, location, { volume: 0.0000000000000000001 })
                // drop the disc
                dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "music_siren/long_gone"`);
            };
        },
        // particle manager
        onTick: (e) => {
            const { block, dimension } = e;
            const location = block.location;
            const hasDisc = block.permutation.getState("terra:has_disc");
            const particleLoc = { x: location.x, y: location.y + 1.2, z: location.z };

            if (hasDisc === 0) return;
            if (hasDisc === 1 || hasDisc === 2) dimension.spawnParticle('minecraft:note', particleLoc);
        }
    });
});

// vanilla jukebox shenanigans (replaces with the placeholder on custom disc interact)
world.afterEvents.itemUseOn.subscribe(eventData2 => {
    // destructure event data for easier access
    const { source: player, block, itemStack } = eventData2;
    const dimension = player.dimension
    const location = block.location;
    const equipment = player.getComponent(`equippable`);

    if (block?.typeId === 'minecraft:jukebox') {
        switch (itemStack?.typeId) {
            case 'terra:record_wtb':
                // reduce the player's item count if not in creative mode
                if (player.getGameMode() !== "creative") {
                    if (itemStack.amount > 1) {
                        itemStack.amount -= 1;
                        equipment.setEquipment(`Mainhand`, itemStack);
                    } else if (itemStack.amount === 1) {
                        equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                    }
                };
                // load the temp block, set the block state to load the corresponding disc
                block.setPermutation(BlockPermutation.resolve('terra:jukebox_placeholder', { "terra:has_disc": 1 }))
                // play the music
                dimension.playSound(`record.wtb`, location);
                player.onScreenDisplay.setActionBar({ text: `§d`, translate: `record.nowPlaying`, with: `item.record_wtb.desc` });
                break;

            case 'terra:record_long_gone':
                // reduce the player's item count if not in creative mode
                if (player.getGameMode() !== "creative") {
                    if (itemStack.amount > 1) {
                        itemStack.amount -= 1;
                        equipment.setEquipment(`Mainhand`, itemStack);
                    } else if (itemStack.amount === 1) {
                        equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                    }
                };
                // load the temp block, set the block state to load the corresponding disc
                block.setPermutation(BlockPermutation.resolve('terra:jukebox_placeholder', { "terra:has_disc": 2 }))
                // play the music
                dimension.playSound(`record.long_gone`, location);
                player.onScreenDisplay.setActionBar({ text: `§d`, translate: `record.nowPlaying`, with: `item.record_long_gone.desc` })
                break;
        }
    }
});