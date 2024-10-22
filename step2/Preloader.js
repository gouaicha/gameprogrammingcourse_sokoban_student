export class Preloader extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Preloader'
        });
    }

    preload ()
    {
        //this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.setPath("../assets");

        this.load.image("volume-icon", "ui/volume-icon.png");
        this.load.image("volume-icon_off", "ui/volume-icon_off.png");
        this.load.image("background");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-0", "cards/card-0.png");
        this.load.image("card-1", "cards/card-1.png");
        //this.load.image("card-2", "cards/card-2.png");
        //this.load.image("card-3", "cards/card-3.png");
        //this.load.image("card-4", "cards/card-4.png");
        //this.load.image("card-5", "cards/card-5.png");
        //this.load.image("card-6", "cards/card-5.png");
        //this.load.image("card-7", "cards/card-5.png");
        //this.load.image("card-8", "cards/card-5.png");
        //this.load.image("card-9", "cards/card-5.png");
        this.load.image("heart", "ui/heart.png");


    }

    create ()
    {
        this.scene.start("Play");
    }
}