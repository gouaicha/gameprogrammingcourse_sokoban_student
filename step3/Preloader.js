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
        this.load.setPath("../assets");
        this.load.image("background");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-0", "cards/card-0.png");
        this.load.image("card-1", "cards/card-1.png");
        this.load.image("heart", "ui/heart.png");
    }

    create ()
    {
        this.scene.start("Play");
    }
}