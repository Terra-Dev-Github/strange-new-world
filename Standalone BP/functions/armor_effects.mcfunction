## Nethersteel
scoreboard players set @a nethersteelArmor 0
scoreboard players add @a[hasitem={item=terra:nethersteel_boots,location=slot.armor.feet}] nethersteelArmor 1
scoreboard players add @a[hasitem={item=terra:nethersteel_leggings,location=slot.armor.legs}] nethersteelArmor 1
scoreboard players add @a[hasitem={item=terra:nethersteel_chestplate,location=slot.armor.chest}] nethersteelArmor 1
scoreboard players add @a[hasitem={item=terra:nethersteel_helmet,location=slot.armor.head}] nethersteelArmor 1
tag @a[scores={nethersteelArmor=4}] add nethersteelSetEffect
tag @a[scores={nethersteelArmor=..3}] remove nethersteelSetEffect
effect @a[tag=nethersteelSetEffect] strength 1 3 true
effect @a[tag=nethersteelSetEffect] slowness 1 2 true