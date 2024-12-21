// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world, ItemStack } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:anchor_events' for item behavior (leap mechanic on item use)
    eventData.itemComponentRegistry.registerCustomComponent('terra:anchor_events', {
        onUse(e) {
            // destructure event data for easier access
            const player = e.source
            const location = player.location

            // define the player's equipment
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const durability = selectedItem.getComponent('durability');

            // behavior for anchor usage
            if (selectedItem?.typeId === 'terra:anchor') {
                player.playSound('anchor.launch');
                player.runCommandAsync(`particle terra:gun_blast_particle ${location.x} ${location.y} ${location.z}`);
                // define and get view direction and player velocuty
                const viewDir = player.getViewDirection();
                // const velocity = player.getVelocity();
                // define new velocity and apply it as knockback
                // const newVelocity = Math.sqrt(velocity * velocity) * 4.0;
                player.applyKnockback(viewDir.x, viewDir.z, 1.5, 0.5);
            };

            // get the durability component and decrease it unless the player is in creative
            if (player.getGameMode() !== "creative") {
                // check if the item has a durability component and if its damage is less than the max
                if (durability && durability.damage < durability.maxDurability) {
                    // increment the damage of the item, reducing its durability
                    durability.damage++;
                    equipment.setEquipment(`Mainhand`, selectedItem);
                }

                // check if the item has a durability component and if its damage is greater than or equal to the max
                if (durability && durability.damage >= durability.maxDurability) {
                    // play sound effect and replace the item with air
                    player.playSound('random.break');
                    equipment.setEquipment(`Mainhand`, undefined);
                }
            }
        }
    });
});