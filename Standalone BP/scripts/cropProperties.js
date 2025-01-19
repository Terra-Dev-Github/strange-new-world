// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:crop_properties' for the block behavior
    eventData.blockComponentRegistry.registerCustomComponent('terra:crop_properties', {
        // grow the crop on random tick
        onRandomTick: (e) => {
            // destructure event data for easier access
            const { block } = e;

            // define block states
            const perm = block.permutation
            const growthStage = perm.getState("terra:growth_stage");
            if (growthStage === undefined || typeof growthStage !== "number") {
                return;
            }

            // define crops and their growth limit (since not all will be the same)
            const crops = [
                { id: 'terra:grape_vine', max: 2 },
                { id: 'terra:lemon_crop', max: 2 },
                { id: 'terra:orange_crop', max: 2 },
                { id: 'terra:pineapple_crop', max: 5 },
                { id: 'terra:tomato_crop', max: 5 }
            ];
            const cropId = crops.find(crop => crop.id === block.typeId);
            const maxStage = cropId.max

            // cap the crop growth if current stage and max stage match
            if (growthStage === maxStage) {
                return;
            }

            // if a random number is less than 60, then make the crop grow
            if (Math.floor(Math.random() * 100) < 60) {
                block.setPermutation(perm.withState("terra:growth_stage", growthStage + 1));
            };
        },
        // grow the crop when bonemealed
        onPlayerInteract: (e) => {
            // destructure event data for easier access
            const { block, player, dimension } = e;
            const location = e.block.location

            // define block states
            const perm = block.permutation
            const growthStage = perm.getState("terra:growth_stage");
            if (growthStage === undefined || typeof growthStage !== "number") {
                return;
            }

            // define crops and their growth limit (since not all will be the same)
            const crops = [
                { id: 'terra:grape_vine', max: 2 },
                { id: 'terra:lemon_crop', max: 2 },
                { id: 'terra:orange_crop', max: 2 },
                { id: 'terra:pineapple_crop', max: 5 },
                { id: 'terra:tomato_crop', max: 5 }
            ];
            const cropId = crops.find(crop => crop.id === block.typeId);
            const maxStage = cropId.max

            // interact with vines to harvest (placed before the bonemeal usage otherwise it won't work)
            if (block?.typeId === 'terra:grape_vine' && growthStage === maxStage) {
                // set the block state
                block.setPermutation(perm.withState("terra:growth_stage", 0));

                // play sound effect & spawn particles
                dimension.playSound('block.sweet_berry_bush.pick', location);
                dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "blocks/grape_vine"`);
            };

            // cap the crop growth if current stage and max stage match
            if (growthStage === maxStage) {
                return;
            }

            // get the selected item from the player
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);

            // check if the selected item is bone meal and the crop growth is not already capped
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

                // play sound effect & spawn particles
                dimension.playSound('item.bone_meal.use', location);
                dimension.runCommandAsync(`particle minecraft:crop_growth_emitter ${location.x} ${location.y} ${location.z}`);
            }
        },
        // small grape vine manager
        onTick: (e) => {
            // destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();
            const belowBlock = block.below();

            // to prevent messy code shenanigans
            if (!block.typeId === 'terra:grape_vine') return;

            // update block states based on the block below
            if (aboveBlock?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:vine_body_stage', aboveBlock ? 1 : 0));
            else block.setPermutation(block.permutation.withState('terra:vine_body_type', 1));

            if (belowBlock?.typeId === block.typeId) block.setPermutation(block.permutation.withState('terra:vine_body_stage', belowBlock ? 0 : 1));
            else block.setPermutation(block.permutation.withState('terra:vine_body_type', 1));
        }
    });
});