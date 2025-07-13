// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { world, ItemStack } from '@minecraft/server';

// subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // register a custom component named 'terra:gun_events' for item behavior (conditioned events on item use)
    eventData.itemComponentRegistry.registerCustomComponent('terra:gun_events', {
        onUse(e) {
            // destructure event data for easier access
            const player = e.source
            const dimension = player.dimension

            // define the player's equipment and inventory
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment(`Mainhand`);
            const durability = selectedItem.getComponent('durability');
            const inventory = player.getComponent('inventory').container;

            // behavior for unloaded blaster usage
            if (selectedItem?.typeId === 'terra:blaster_unloaded') {
                if (inventory) {
                    for (let i = 0; i < inventory.size; i++) {
                        const item = inventory.getItem(i);
                        // test for a radioactive vial in the inventory
                        if (item?.typeId === 'terra:vial_radioactive') {
                            // if true, reload the blaster automatically
                            player.playSound('item.blaster.recharge');
                            player.runCommand("function notif/gun_reloading")
                            player.runCommand("function notif/gun_reloading")
                            equipment.setEquipment(`Mainhand`, new ItemStack('terra:blaster', 1));
                            selectedItem.getComponent('cooldown').startCooldown(player);
                        } else { // else, notify the player if their blaster is unloaded (if they somehow haven't noticed)
                            player.dimension.playSound('item.blaster.unloaded', player.location);
                            player.runCommand("function notif/gun_unloaded")
                        }
                    }
                }
            };

            // behavior for loaded blaster usage
            if (selectedItem?.typeId === 'terra:blaster') {
                player.dimension.playSound('item.blaster.shoot', player.location);
                // define and adjust spawn location
                const { x, y, z } = player.getHeadLocation();
                const spawnLoc = { x: x, y: y, z: z }
                const viewDir = player.getViewDirection();
                // define projectile to shoot and projectile owner (to prevent being damaged)
                const projectile = dimension.spawnEntity("terra:gun_pellet", spawnLoc);
                const projectileCheck = projectile.getComponent("projectile");
                projectileCheck.owner = player;
                // shoot
                projectileCheck?.shoot(viewDir);
                selectedItem.getComponent('cooldown').startCooldown(player);
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
                    // play sound effect and replace the item for the unloaded version
                    player.playSound('random.break');
                    equipment.setEquipment(`Mainhand`, new ItemStack('terra:blaster_unloaded', 1));
                }
            }
        }
    });
});