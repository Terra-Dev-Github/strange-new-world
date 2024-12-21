// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world, EquipmentSlot, ItemStack } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:gun_events' for item behavior (conditioned events on item use)
    eventData.itemComponentRegistry.registerCustomComponent('terra:on_consume', {
        onConsume(e) {
            // destructure event data for easier access
            const player = e.source

            // define the player's equipment
            const equipment = player?.getComponent('minecraft:equippable');
            const selectedItem = equipment.getEquipmentSlot(EquipmentSlot.Mainhand);

            // define what happens when a specific item is consumed
            if (selectedItem?.typeId === 'terra:salt_bottle') {
                player.dimension.spawnItem(new ItemStack('minecraft:bottle'), player.location)
                player.runCommandAsync("effect @s hunger 10 3 true");        
            };
        }
    });
});