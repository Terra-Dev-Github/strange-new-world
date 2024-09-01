// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:leaves_decay' for the block behavior
    eventData.blockComponentRegistry.registerCustomComponent('terra:leaves_decay', {
        // grow the crop on random tick
        onRandomTick: (e) => {
            // destructure event data for easier access
            const { block } = e;

            // define block states
            const location = e.block.location;
            const dimension = e.block.dimension;
            const perm = block.permutation
            const shouldDecay = perm.getState("terra:should_decay");
            const decayTier = perm.getState("terra:decay_tier");

            // define a valid list of logs to detect and prevent decay
            const logs = [
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
            ];

            // define the method of checking for logs in the enviroment, or leaves of the same type
            const adjacentBlocks = {
                north: block.north(),
                east: block.east(),
                south: block.south(),
                west: block.west(),
                above: block.above(),
                below: block.below()
            };
            const logCheck = logs.includes(adjacentBlocks?.typeId);

            // if there is decay, run the code. if not, stop the whole thing
            if (shouldDecay === 0) {
                // reset decay progress if a newly placed log is detected
                if ((decayTier === 0 || decayTier === 1 || decayTier === 2 || decayTier === 3) && logCheck) {
                    block.setPermutation(block.permutation.withState(decayTier, 4))
                };
                // decay mechanic
                if (decayTier === 0) {
                    let decayTag = "decay_tier_1";
                    if (adjacentBlocks?.typeId === block.typeId && adjacentBlocks?.hasTag(decayTag)) block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier + 1));
                    else { // spawn loot
                        dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air`);
                        dimension.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "blocks/custom_leaves"`);
                    };
                };
                if (decayTier === 1) {
                    let decayTag = "decay_tier_2";
                    if (adjacentBlocks?.typeId === block.typeId && adjacentBlocks?.hasTag(decayTag)) block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier + 1));
                    else block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier - 1));
                };
                if (decayTier === 2) {
                    let decayTag = "decay_tier_3";
                    if (adjacentBlocks?.typeId === block.typeId && adjacentBlocks?.hasTag(decayTag)) block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier + 1));
                    else block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier - 1));
                };
                if (decayTier === 3) {
                    let decayTag = "decay_tier_4";
                    if (adjacentBlocks?.typeId === block.typeId && adjacentBlocks?.hasTag(decayTag)) block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier + 1))
                    else block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier - 1));
                };
                if (decayTier === 4) {
                    let decayTag = "decay_tier_4";
                    if (adjacentBlocks?.typeId === block.typeId && adjacentBlocks?.hasTag(decayTag)) block.setPermutation(block.permutation.withState('terra:decay_tier', 4))
                    else block.setPermutation(block.permutation.withState('terra:decay_tier', 3));
                    if (!logCheck) { block.setPermutation(block.permutation.withState('terra:decay_tier', decayTier - 1)) } else return;
                };
            } else if (shouldDecay === 1) return;
        },
        // change decay state to false
        onPlayerPlace: (e) => {
            const { block } = e;
            block.setPermutation(block.permutation.withState("terra:should_decay", 1))
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