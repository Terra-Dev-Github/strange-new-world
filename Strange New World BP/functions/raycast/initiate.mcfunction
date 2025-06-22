## Remove Previous Tags
tag @e remove caster
execute as @e[type=terra:stalker] run tag @s add caster

## Create Raycast Max Distance Objective
scoreboard objectives add ray_limit dummy

## Define Raycast Max Distance (editable)
scoreboard players set @s ray_limit 100
### distance = Ray Limit × Ray Step Size
### --> distance = 100 × 0.3 = 30 blocks
### Ray Step Size is 0.3 blocks. This can be edited in raycast/step.mcfunction

## Initiate Raycasting
execute anchored eyes run function raycast/step