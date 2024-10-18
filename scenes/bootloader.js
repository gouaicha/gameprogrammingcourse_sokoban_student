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
        this.load.setPath("../assets");
        this.loadFonts();
        this.loadImages();
    }

    create ()
    {
        this.scene.start("Splash");
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