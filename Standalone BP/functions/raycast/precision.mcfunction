### from this point, the ray will be cast with ×6 precision for accuracy.
### precision = Ray Step Size / 6
### --> precision = 0.3 / 6 = 0.05

## Call Function on Hitting an Entity with Precision
execute positioned ^^^0.05 at @e [tag=!caster, r=2, y=~-1, dy=0, c=1] run function raycast/on_hit/entity

## Loop Function if Precision Incomplete (Failed to Hit the Block/Entity)
execute positioned ^^^0.05 unless entity @e [tag=!caster, r=2, y=~-1, dy=0] if block ~~~ air run function raycast/precision