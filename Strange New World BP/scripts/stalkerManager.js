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

        const target = entity.getEntitiesFromViewDirection({ maxDistance: 12 })[0].entity
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

// run code block every two seconds (1s = 20 ticks)
system.runInterval(() => {
    // get stalkers in the world
    let entity = world.getEntity('terra:stalker')
    if (!entity) return; // prevents code breaking
    // get stalkers again, but only if they're 'staring at a player' through a dummy component
    let stalker = world.getEntity('terra:stalker').getComponent('minecraft:is_shaking');
    if (!stalker) return; // prevents code breaking

    // get the player if found on view direction
    const target = stalker.getEntitiesFromViewDirection({ maxDistance: 12 })[0]?.entity
    if (!target) return; // prevents code breaking
    if (target?.typeId === 'minecraft:player') {
        target.addEffect('mining_fatigue', 60, { amplifier: 2, showParticles: true })
    } else return;
}, 40);