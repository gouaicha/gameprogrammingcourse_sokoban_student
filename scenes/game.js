export class Game extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Game'
        });
    }

    //TODO
    init ()
    {
       
    }

    //TODO
    addExit() 
    {
        
    }

    //TODO
    create ()
    {
        
    }

    //TODO
    update(t, dt) {
	   
	}

    showTexts() 
    {
            const texts = [
            "Game Scene",
            "To be implemented...",
            "Hit [x] to exit",
            ];
            texts.forEach((text, i) => {
            this.add
            .bitmapText(300, 425 + 35 * i, "mario", text, 15)
            .setOrigin(0.5)
            .setTint(0xffe066)
            .setDropShadow(1, 2, 0xbf2522, 0.7);
            });
    }
}