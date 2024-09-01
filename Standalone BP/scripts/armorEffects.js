// This file was made, modified and compiled by Heavenly (@heavenly7493) for TERRA.
// Do not distribute without permission.

// import necessary modules from Minecraft server API
import { system, world } from "@minecraft/server";

// run code block every second (4 ticks)
system.runInterval(() => {
    let players = world.getAllPlayers();
    for (let player of players) {
        // define equipment and slots
        const equipment = player.getComponent('equippable');
        const helmet = equipment.getEquipment(`Head`);
        const chestplate = equipment.getEquipment(`Chest`);
        const leggings = equipment.getEquipment(`Legs`);
        const boots = equipment.getEquipment(`Feet`);

        // effect manager if conditions are met
        if (helmet?.typeId == 'terra:nethersteel_helmet' && chestplate?.typeId == 'terra:nethersteel_chestplate' && leggings?.typeId == 'terra:nethersteel_leggings' && boots?.typeId == 'terra:nethersteel_boots') {
            player.addEffect('strength', 1, { amplifier: e, showParticles: true });
            player.addEffect('slowness', 1, { amplifier: 2, showParticles: true });
        }
    }
}, 4);