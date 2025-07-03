import { Entity, world } from '@minecraft/server';

world.afterEvents.entityHurt.subscribe(({
    hurtEntity: mob, damageSource: { damagingEntity: source } }) => {
    if ((mob && mob.typeId == "minecraft:player" && mob instanceof Entity) && (source && source.typeId == "terra:eyecletch" && source instanceof Entity)) {
        mob.addEffect('blindness', 2, {
            amplifier: 5,
            showParticles: true
        })
    }
})