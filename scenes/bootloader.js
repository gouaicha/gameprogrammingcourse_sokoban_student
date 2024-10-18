export class Bootloader extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Bootloader'
        });
    }

    preload ()
    {
        //graphical representation
        this.createLoadingBars();
        this.setLoadEvents();
        //
        //The actual loading
        this.load.setPath("../gameprogrammingcourse_sokoban_student/assets");
        this.loadFonts();
        this.loadImages();
        //NEW
        this.loadGameConfig();
        this.loadLevels();

    }

    create ()
    {
    }

    setLoadEvents() {
        this.load.on(
        "progress",
        function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xa6f316, 1);
        this.progressBar.fillRect(
        this.cameras.main.width / 4,
        this.cameras.main.height / 2 - 16,
        (this.cameras.main.width / 2) * value,16
        );
        },
        this
        );
        
        this.load.on(
        "complete",
        () => {
        this.scene.start("Splash");
        },
        this
        );
        }

        loadFonts() {
            this.load.bitmapFont(
            "mario",
            "fonts/mario.png",
            "fonts/mario.xml"
            );
            }

        loadImages() {
            this.load.image("floor", "floor-wood.png");
            this.load.image("heart", "ui/heart.png");
            this.load.image("game-background", "sea_background.png");
            
        }
 

        //New
        loadGameConfig()
        {
            this.load.json(`gameConfig`, `./gameConfig.json`);
        }
        //New
        loadLevels()
        {
            //TODO change this
            for(let i =0 ; i < 8 ; ++i )
                { 
                this.load.json(`levelData${i}`, `./levels/level${i}.json`);
                }  
        }
        createLoadingBars() {
            this.loadBar = this.add.graphics();
            this.loadBar.fillStyle(0xffe066, 1);
            this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
            );
            this.progressBar = this.add.graphics();
            }

}