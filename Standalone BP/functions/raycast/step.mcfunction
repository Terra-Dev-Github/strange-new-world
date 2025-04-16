## Countdown Ray Steps from Defined 'Ray Limit' to Zero
scoreboard players remove @s ray_limit 1

## Call Function on Reaching Ray Limit
execute if score @s ray_limit matches 0 run function raycast/on_hit/ray_limit

## Call Precision Function on Detecting an Entity
execute if score @s ray_limit matches 1.. positioned ^^^0.3 if entity @e[tag=!caster, r=2, y=~-1, dy=0, c=1] positioned ^^^-0.3 run function raycast/precision

## Loop Function if Did Not Reach Ray Limit or Detect a Block/Entity
execute if score @s ray_limit matches 1.. positioned ^^^0.3 unless entity @e[tag=!caster, r=2, y=~-1, dy=0] if block ~~~ air run function raycast/step