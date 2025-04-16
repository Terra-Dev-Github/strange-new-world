// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { system, world } from '@minecraft/server';

/*
world.afterEvents.dataDrivenEntityTrigger.subscribe(eventData => {
    const entity = eventData.entity;
    const event = eventData.eventId;
    const startStare = event('terra:stare')
    if (!entity.typeId === 'terra:stalker') return;

    if (startStare) {
        const raycast = entity.getEntitiesFromViewDirection({ maxDistance: 12 });
        const target = raycast[0].entity;
        if (target.typeId === 'minecraft:player') {
            do {
                system.runInterval(() => {
                    target.runCommandAsync(`effect @s mining_fatigue 3 2 false`);
                }, 40)
            } while (raycast)
        } else return;
    }
});
*/

system.runInterval(() => {
    const entity = world.getEntity();
    if (!entity) return;
    if (entity.typeId !== 'terra:stalker') return;

    const startStare = entity.hasComponent('minecraft:is_shaking')
    if (startStare) {
        const raycast = entity.getEntitiesFromViewDirection({ maxDistance: 12 });
        const target = raycast[0].entity;
        for (const player of world.getAllPlayers()) {
            if (target.typeId === player.typeId) {
                do {
                    target.runCommandAsync(`effect @s mining_fatigue 3 2 false`);
                } while (raycast)
            } else return;
        }
    } else return;
}, 40)