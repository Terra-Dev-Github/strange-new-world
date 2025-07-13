// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { ItemStack, BlockPermutation, world } from '@minecraft/server';

// vanilla jukebox shenanigans (replaces with the placeholder on custom disc interact)
world.afterEvents.itemUseOn.subscribe(eventData2 => {
    // destructure event data for easier access
    const { source: player, block, itemStack } = eventData2;
    const equipment = player.getComponent(`equippable`);

    const hoeArray = [
        'minecraft:wooden_hoe',
        'minecraft:stone_hoe',
        'minecraft:golden_hoe',
        'minecraft:iron_hoe',
        'minecraft:diamond_hoe',
        'minecraft:netherite_hoe'
    ]

    if (block?.typeId === 'minecraft:sand') {
        switch (itemStack?.typeId) {
            case hoeArray.includes(itemStack?.typeId):
                // get the durability component of the selected item
                const durability = selectedItem.getComponent('durability');
                // check if the item has a durability component and if its damage is less than the maximum durability
                if (durability && durability.damage < durability.maxDurability) {
                    durability.damage++; // increment the damage of the item, reducing its durability
                    equipment.setEquipment(`Mainhand`, selectedItem); // update the equipment in the player's main hand with the modified item
                };
                // check if the item has a durability component and if its damage is greater than or equal to the maximum durability
                if (durability && durability.damage >= durability.maxDurability) {
                    // play the sound effect for breaking an item
                    player.playSound('random.break');
                    // replace the item in the player's main hand with an air block (i.e., remove the item)
                    equipment.setEquipment(`Mainhand`, new ItemStack('minecraft:air', 1));
                }
                // load the new block
                block.setPermutation(BlockPermutation.resolve('terra:wavy_sand'));
                break;
        }
    };
    if (block?.typeId === 'minecraft:red_sand') {
        switch (itemStack?.typeId) {
            case hoeArray.includes(itemStack?.typeId):
                // get the durability component of the selected item
                const durability = selectedItem.getComponent('durability');
                // check if the item has a durability component and if its damage is less than the maximum durability
                if (durability && durability.damage < durability.maxDurability) {
                    durability.damage++; // increment the damage of the item, reducing its durability
                    equipment.setEquipment(`Mainhand`, selectedItem); // update the equipment in the player's main hand with the modified item
                };
                // check if the item has a durability component and if its damage is greater than or equal to the maximum durability
                if (durability && durability.damage >= durability.maxDurability) {
                    // play the sound effect for breaking an item
                    player.playSound('random.break');
                    // replace the item in the player's main hand with an air block (i.e., remove the item)
                    equipment.setEquipment(`Mainhand`, new ItemStack('minecraft:air', 1));
                }
                // load the new block
                block.setPermutation(BlockPermutation.resolve('terra:wavy_red_sand'));
                break;
        }
    };
});