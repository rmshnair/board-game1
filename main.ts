namespace SpriteKind {
    export const DieSprites = SpriteKind.create()
    export const Dice = SpriteKind.create()
}
function isValidTile (col: number, row: number) {
    if (tiles.tileIs(tiles.getTileLocation(col, row), assets.tile`regular spot`) || tiles.tileIs(tiles.getTileLocation(col, row), assets.tile`tile11`) || tiles.tileIs(tiles.getTileLocation(col, row), assets.tile`tile12`)) {
        return true
    }
    return false
}
function next_player_turn () {
    current_player_number = (current_player_number + 1) % 4
    current_player = board_game_characters[current_player_number]
    roll_die()
}
function roll_die () {
    die = sprites.create(img`
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        `, SpriteKind.Dice)
    big_character = sprites.create(big_picture[current_player_number], SpriteKind.DieSprites)
    big_character.setPosition(74, 94)
    game_phase = "dice rolling"
}
function do_business_office_event () {
    game_phase = "event"
    if (is_star_tile(tiles.locationXY(tiles.locationOfSprite(current_player), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(current_player), tiles.XY.row))) {
        current_player.say("yay", 500)
        effects.confetti.startScreenEffect(1000)
        pause(1000)
        game.splash("SPECIAL!")
    }
    next_player_turn()
}
sprites.onOverlap(SpriteKind.Dice, SpriteKind.DieSprites, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy()
    go(dice_pictures.indexOf(die.image) + 1)
})
function is_star_tile (col: number, row: number) {
    if (tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`tile12`)) {
        return true
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`tile19`)) {
        return true
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`tile20`)) {
        return true
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`tile18`)) {
        return true
    }
    return false
}
function find_tile_to_go_to (spaces: number): any {
    if (spaces == 0) {
        return current_position
    } else {
        if (tiles.tileIs(current_position, assets.tile`tile22`) || tiles.tileIs(current_position, assets.tile`tile9`) || tiles.tileIs(current_position, assets.tile`tile19`)) {
            current_position = tiles.locationInDirection(current_position, CollisionDirection.Left)
        } else if (tiles.tileIs(current_position, assets.tile`tile23`) || (tiles.tileIs(current_position, assets.tile`tile`) || tiles.tileIs(current_position, assets.tile`tile12`))) {
            current_position = tiles.locationInDirection(current_position, CollisionDirection.Top)
        } else if (tiles.tileIs(current_position, assets.tile`tile17`) || tiles.tileIs(current_position, assets.tile`tile0`) || tiles.tileIs(current_position, assets.tile`tile20`)) {
            current_position = tiles.locationInDirection(current_position, CollisionDirection.Right)
        } else if (tiles.tileIs(current_position, assets.tile`tile21`) || tiles.tileIs(current_position, assets.tile`tile8`) || tiles.tileIs(current_position, assets.tile`tile18`)) {
            current_position = tiles.locationInDirection(current_position, CollisionDirection.Bottom)
        } else {
        	
        }
        return find_tile_to_go_to(spaces - 1)
    }
}
function go (spaces: number) {
    game_phase = "moving"
    current_player.say(spaces, 2000)
    current_position = tiles.locationOfSprite(current_player)
    future_home_of_this_player = find_tile_to_go_to(spaces)
    story.queueStoryPart(function () {
        story.spriteMoveToLocation(current_player, tiles.locationXY(future_home_of_this_player, tiles.XY.x), tiles.locationXY(future_home_of_this_player, tiles.XY.y), 60)
    })
    story.queueStoryPart(function () {
        do_business_office_event()
    })
}
let future_home_of_this_player: any = null
let current_position: tiles.Location = null
let game_phase = ""
let big_character: Sprite = null
let die: Sprite = null
let current_player: Sprite = null
let current_player_number = 0
let board_game_characters: Sprite[] = []
let dice_pictures: Image[] = []
let big_picture: Image[] = []
scene.setBackgroundColor(13)
tiles.setSmallTilemap(tilemap`level1`)
let player1 = sprites.create(assets.image`ramen packet`, SpriteKind.Player)
let player2 = sprites.create(img`
    . 4 . . . . 4 . 
    4 f 4 d d 4 f 4 
    4 f 4 4 4 4 f 4 
    e 4 d 4 4 d 4 4 
    4 4 f 4 4 f 4 f 
    e 4 4 4 4 4 4 e 
    e d 4 f f 4 d e 
    d d e a a e d d 
    `, SpriteKind.Player)
let player3 = sprites.create(img`
    . f f f . . . . 
    4 f 1 f . . . . 
    . f f f . . f . 
    . f f f f f f . 
    . f f f f f f . 
    . . f f f f f . 
    . . f f f f . . 
    . . . . 4 . . . 
    `, SpriteKind.Player)
let player4 = sprites.create(img`
    . . . . 8 8 d . 
    . . . . 8 8 8 8 
    . . . . 6 6 f . 
    . . . . 6 6 6 4 
    b c a b a a a . 
    b b c c b b b . 
    . b b b b b . . 
    . . . 4 . 4 . . 
    `, SpriteKind.Player)
tiles.placeOnRandomTile(player1, assets.tile`tile`)
tiles.placeOnRandomTile(player2, assets.tile`tile0`)
tiles.placeOnRandomTile(player3, assets.tile`tile8`)
tiles.placeOnRandomTile(player4, assets.tile`tile9`)
big_picture = [
img`
    ................................
    ................................
    ................................
    ................................
    .....777...............777......
    .....7777.............77777.....
    ....77777............777777.....
    ....71117777........7771117.....
    ....7ff17777777777777771ff7.....
    ....7ff17777777777777771ff7.....
    ....77777777777777777777777.....
    ....7777777766777667777777......
    ....7777777777666677777777......
    .....777777777777777777777......
    ..66.77777777777777777777.......
    ..666677777777777777777776666...
    .66666677777777777777777766666..
    .66666667777777777777777666666..
    .66666667777777777777777666666..
    .66666667777777777777777666666..
    .66666667777777777777777666666..
    .66666667777777677777777666666..
    .66666667777777667777776666666..
    .66666667777777667777776666666..
    .66666667777777676777776666666..
    .66666667777777676777776666666..
    ..6666667777777676777776666666..
    ..666666777777767667777666666...
    ..66666677777776776777776666666.
    6666666677777776776777776666666.
    ........7777776677667..7........
    ..............6.................
    `,
img`
    fff........5.5.5.5.......fffff..
    f44fff.....5255353.....ff4444f..
    .f444ff....a57a525.....f44334f..
    .f4344ff...fffffff....f444344f..
    .f43344fffff44444ffff.f433344f..
    .f44334ff44444444444fff44344ff..
    .ff4444444444444444444f4444f....
    ..ff4444444444444444444444f.....
    ...ff44444444444444444444ff.....
    ...f444444f444444f4444444f......
    ...f444444f444444f4444444f......
    ...f44ddd44444444444dd44f.......
    ...f44dddd44444444dddd44ff......
    ...f44ddddddfffdddddddd44f......
    .fff44dddddddfddddddddd44ff.....
    .f4444ddddffddddffddddd444f.....
    .f444ddddddffffffdddddd41ff.....
    .f111dddddddddddddddddd11f......
    .f2111d1ddddddddddd11d111f......
    f222111111ddddddd11111112f......
    f22222211ddddddd121122222ff.....
    f22222222ddddddd2222222222ff....
    .f2222222dddddddd2222224444ff...
    .f44dddddddddddddddd444d4444ff..
    .ff44ddddddddddddddd4444d44444ff
    ..f44fdddddddddfdd444f44d444444f
    ..f44ffdddddddfddd44ff444444444f
    ..ff44fddddddfddd444f444444444df
    ...f44ffdddddfd44444444444f44ddf
    ..fff4dfffffffd44fff44444ff4dddf
    ..f444ff.....fd4ffffffffff4ddfff
    ..fffff......ffff........fffff..
    `,
assets.image`2`,
img`
    ...................8888888......
    ..................888888ddd.....
    .................8888888dddd....
    .................8888888dddd....
    .................888888888888888
    ...........c.....88888888888....
    .....cc....c.....cc66888666c....
    .....ccc..ccc....c666666ff6c....
    ....ccbc..cbc....c666666ff6c44..
    ....cbbccccbcc...c666666666c444.
    ....cbbbcbbbbcc..c666666666c4444
    ...cbbbbbcbbbbcc.c666666666c....
    ...cbbbbbcbbbbbccca6666666cc....
    ...cbbbbbbccbbbbbcaa6666aac.....
    ...cbbbbbbbcccbbccaaaaaaaac.....
    ...cbbbbbbbbbccccaaaaaaaaac.....
    ...cbbbbbbbbbbbbbbbaaaaaabc.....
    ...cbbbbbbbbbbbbbbbbbbbbbbc.....
    ...ccbbbbbbbbbbbbbbbbbbbbbc.....
    ....ccbbbbbbbbbbbbbbbbbbbc......
    .....ccbbbbbbbbbbbbbbbbbbc......
    ......cccbbbbbbbbbbbbbbbbc......
    .....ccbbbbbbbbbbbbbbbbbcc......
    ...ccbbbbbbbbbbbbbbbbbbbc.......
    cccbbbbbbbbbbbbbbbbbbbbcc.......
    cbbbbbbbbbbbbbbbbbbcccc.........
    .cbbbbbbbbbbbbbbbc4c............
    ..ccccccccbbbccccc4.............
    ..........cccc.4..4.............
    ..............44.44.............
    .............44.44..............
    .............4..4...............
    `
]
dice_pictures = [
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `,
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 f f f 1 1 1 1 1 1 1 1 1 
    1 1 1 1 f f f 1 1 1 1 1 1 1 1 1 
    1 1 1 1 f f f 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `,
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 f f f 1 
    1 1 1 1 1 1 1 1 1 1 1 1 f f f 1 
    1 1 1 1 1 1 1 1 1 1 1 1 f f f 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `,
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `,
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 f f f 1 1 1 1 1 1 f f f 1 1 
    1 1 f f f 1 1 1 1 1 1 f f f 1 1 
    1 1 f f f 1 1 1 1 1 1 f f f 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 f f f 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 f f f 1 1 1 1 1 1 1 1 1 1 1 
    1 1 f f f 1 1 1 1 1 1 f f f 1 1 
    1 1 f f f 1 1 1 1 1 1 f f f 1 1 
    1 1 1 1 1 1 1 1 1 1 1 f f f 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `,
img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 f f f 1 1 1 1 f f f 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
    `
]
board_game_characters = [
player1,
player2,
player3,
player4
]
let mySprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
current_player_number = 0
next_player_turn()
game.onUpdateInterval(100, function () {
    if (game_phase == "dice rolling") {
        if (controller.A.isPressed()) {
            big_character.vy = -180
            big_character.ay = 300
        } else {
            die.setImage(dice_pictures._pickRandom())
        }
    }
})
