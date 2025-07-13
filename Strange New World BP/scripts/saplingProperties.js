// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:sapling_properties' for the block behavior
    eventData.blockComponentRegistry.registerCustomComponent('terra:sapling_properties', {
        // grow the sapling on random tick
        onRandomTick: (e) => {
            // destructure event data for easier access
            const { block } = e;

            // define block states
            const perm = block.permutation
            const aboveBlock = block.above()
            const growthStage = perm.getState("terra:growth_stage");
            if (growthStage === undefined || typeof growthStage !== "number") {
                return;
            }

            // define saplings and their growth limit (since not all will be the same)
            const sapling = [
                { id: 'terra:blue_mahoe_sapling' },
                { id: 'terra:bulnesia_sapling' },
                { id: 'terra:poplar_sapling' },
                { id: 'terra:yellowheart_sapling' }
            ];
            const saplingId = sapling.find(sapling => sapling.id === block.typeId);
            const maxStage = 2

            // if the sapling reaches the max stage, it gets replaced with a structure
            if ((growthStage === maxStage) && aboveBlock?.typeId === 'minecraft:air') {
                // split the block identifier and use only the part after the colon
                const saplingStr = saplingId.split(':')[1];
                // define tree structures, and fetch a random number between 0-1 for the variants
                const chance = Math.floor(Math.random() * 1);
                const dimension = block.dimension;
                const structureName = `trees:${saplingStr}_tree${chance}`;
                const { x, y, z } = block;
                // poplar tree is exempt of any of the chance technicalities
                if (block?.typeId === 'terra:poplar_sapling') {
                    world.structureManager.place('trees:poplar_sapling_tree', dimension, { x: x - 1, y, z: z - 1 });
                };
                // specify rest of the trees' offsets
                if (block?.typeId === 'terra:blue_mahoe_sapling') {
                    if (chance === 0) {
                        world.structureManager.place(structureName, dimension, { x: x - 2, y, z: z - 2 });
                    };
                    if (chance === 1) {
                        world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 5 });
                    };
                };
                if (block?.typeId === 'terra:bulnesia_sapling') {
                    if (chance === 0) {
                        world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 6 });
                    };
                    if (chance === 1) {
                        world.structureManager.place(structureName, dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                    };
                };
                // yellowheart only has one tree structure
                if (block?.typeId === 'terra:yellowheart_sapling') {
                    if (chance === 0) {
                        world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 2, y, z: z - 2 });
                    };
                    if (chance === 1) {
                        world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                    };
                };
            } else if ((growthStage === maxStage) && aboveBlock?.typeId !== 'minecraft:air') {
                // if there's a block preventing the sapling growth, return to 0
                block.setPermutation(perm.withState("terra:growth_stage", 0));
            };

            // if a random number is less than 60, then make the sapling grow
            if (Math.floor(Math.random() * 100) < 60) {
                block.setPermutation(perm.withState("terra:growth_stage", growthStage + 1));
            };
        },

        // grow the sapling right when it's a max level
        onTick: (e) => {
            // destructure event data for easier access
            const { block } = e;

            // define block states
            const perm = block.permutation
            const aboveBlock = block.above()
            const growthStage = perm.getState("terra:growth_stage");
            if (growthStage === undefined || typeof growthStage !== "number") {
                return;
            }

            // define saplings and their growth limit (since not all will be the same)
            const sapling = [
                { id: 'terra:blue_mahoe_sapling' },
                { id: 'terra:bulnesia_sapling' },
                { id: 'terra:poplar_sapling' },
                { id: 'terra:yellowheart_sapling' }
            ];
            const saplingId = sapling.find(sapling => sapling.id === block.typeId);
            const maxStage = 2

            // if the sapling reaches the max stage, it gets replaced with a structure
            if ((growthStage === maxStage) && aboveBlock?.typeId === 'minecraft:air') {
                // split the block identifier and use only the part after the colon
                const saplingStr = saplingId.split(':')[1];
                // define tree structures, and fetch a random number between 0-1 for the variants
                const chance = Math.floor(Math.random() * 1);
                const dimension = block.dimension;
                const structureName = `trees:${saplingStr}_tree${chance}`;
                const { x, y, z } = block;
                // poplar tree is exempt of any of the chance technicalities
                if (block?.typeId === 'terra:poplar_sapling') {
                    world.structureManager.place('trees:poplar_sapling_tree', dimension, { x: x - 1, y, z: z - 1 });
                };
                // specify rest of the trees' offsets
                if (block?.typeId === 'terra:blue_mahoe_sapling') {
                    if (chance === 0) {
                        world.structureManager.place(structureName, dimension, { x: x - 2, y, z: z - 2 });
                    };
                    if (chance === 1) {
                        world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 5 });
                    };
                };
                if (block?.typeId === 'terra:bulnesia_sapling') {
                    if (chance === 0) {
                        world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 6 });
                    };
                    if (chance === 1) {
                        world.structureManager.place(structureName, dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                    };
                };
                // yellowheart only has one tree structure
                if (block?.typeId === 'terra:yellowheart_sapling') {
                    if (chance === 0) {
                        world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 2, y, z: z - 2 });
                    };
                    if (chance === 1) {
                        world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                    };
                };
            } else if ((growthStage === maxStage) && aboveBlock?.typeId !== 'minecraft:air') {
                // if there's a block preventing the sapling growth, return to 0
                block.setPermutation(perm.withState("terra:growth_stage", 0));
            };
        },

        // grow the sapling when bonemealed
        onPlayerInteract: (e) => {
            // destructure event data for easier access
            const { block, player, dimension } = e;
            const location = e.block.location

            // define block states
            const perm = block.permutation
            const aboveBlock = block.above()
            const growthStage = perm.getState("terra:growth_stage");
            if (growthStage === undefined || typeof growthStage !== "number") {
                return;
            }

            // define saplings and their growth limit (since not all will be the same)
            const sapling = [
                { id: 'terra:blue_mahoe_sapling' },
                { id: 'terra:bulnesia_sapling' },
                { id: 'terra:poplar_sapling' },
                { id: 'terra:yellowheart_sapling' }
            ];
            const saplingId = sapling.find(sapling => sapling.id === block.typeId);
            const maxStage = 2

            // get the selected item from the player
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // check if the selected item is bone meal and the sapling growth is not already capped
            if (selectedItem?.typeId === 'minecraft:bone_meal' && growthStage !== maxStage) {
                // reduce the player's item count if not in creative mode
                if (player.getGameMode() !== "creative") {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount -= 1;
                        equipment.setEquipment(`Mainhand`, selectedItem);
                    } else if (selectedItem.amount === 1) {
                        equipment.setEquipment(`Mainhand`, undefined); // clear the slot if only 1 item left
                    }
                }
                // set the block state
                block.setPermutation(perm.withState("terra:growth_stage", growthStage + 1));

                // if the sapling reaches the max stage, it gets replaced with a structure
                if ((growthStage === maxStage) && aboveBlock?.typeId === 'minecraft:air') {
                    // split the block identifier and use only the part after the colon
                    const saplingStr = saplingId.split(':')[1];
                    // define tree structures, and fetch a random number between 0-1 for the variants
                    const chance = Math.floor(Math.random() * 1);
                    const dimension = block.dimension;
                    const structureName = `trees:${saplingStr}_tree${chance}`;
                    const { x, y, z } = block;
                    // poplar tree is exempt of any of the chance technicalities
                    if (block?.typeId === 'terra:poplar_sapling') {
                        world.structureManager.place('trees:poplar_sapling_tree', dimension, { x: x - 1, y, z: z - 1 });
                    };
                    // specify rest of the trees' offsets
                    if (block?.typeId === 'terra:blue_mahoe_sapling') {
                        if (chance === 0) {
                            world.structureManager.place(structureName, dimension, { x: x - 2, y, z: z - 2 });
                        };
                        if (chance === 1) {
                            world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 5 });
                        };
                    };
                    if (block?.typeId === 'terra:bulnesia_sapling') {
                        if (chance === 0) {
                            world.structureManager.place(structureName, dimension, { x: x - 4, y, z: z - 6 });
                        };
                        if (chance === 1) {
                            world.structureManager.place(structureName, dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                        };
                    };
                    // yellowheart only has one tree structure
                    if (block?.typeId === 'terra:yellowheart_sapling') {
                        if (chance === 0) {
                            world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 2, y, z: z - 2 });
                        };
                        if (chance === 1) {
                            world.structureManager.place('trees:yellowheart_sapling_tree', dimension, { x: x - 3, y, z: z - 2 }, { rotation: StructureRotation.Rotate180 });
                        };
                    };
                } else if ((growthStage === maxStage) && aboveBlock?.typeId !== 'minecraft:air') {
                    // if there's a block preventing the sapling growth, return to 0
                    block.setPermutation(perm.withState("terra:growth_stage", 0));
                };

                // play sound effect & spawn particles
                dimension.playSound('item.bone_meal.use', location);
                dimension.runCommand(`particle minecraft:crop_growth_emitter ${location.x} ${location.y} ${location.z}`);
            }
        }
    });
});