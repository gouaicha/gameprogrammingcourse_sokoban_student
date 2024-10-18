
export  class Transition extends Phaser.Scene {
    constructor() {
      super({ key: "Transition" });
    }
  
    init(data) {
      this.name = data.name;
      this.number = data.number;
    }
  
  
    create() {
      //TODO: make this more generic
      const messages = this.cache.json.get(`gameConfig`).levels
      /*
      const messages = [
        "Tutorial",
        "Stage 1",
        "Stage 2",
        "Stage 3",
        "Stage 4",
        "Stage 5",
        "Stage 6",
        "Stage 7",
        "Credits",
      ];
      */
      this.lastStageNumber = messages.length-1
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.cameras.main.setBackgroundColor(0x3c97a6);
  
      if (this.number === this.lastStageNumber) {
        this.scene.start("Credit", { name: this.name, number: this.number });
      }
  
      this.add
        .bitmapText(
          this.center_width,
          this.center_height - 20,
          "mario",
          messages[this.number],
          40
        )
        .setOrigin(0.5)
        .setTint(0xa6f316)
        .setDropShadow(2, 3, 0x75b947, 0.7);
      this.add
        .bitmapText(
          this.center_width,
          this.center_height + 20,
          "mario",
          "Ready?",
          50
        )
        .setOrigin(0.5)
        .setTint(0xa6f316)
        .setDropShadow(2, 3, 0x75b947, 0.7);
      this.time.delayedCall(1500, () => this.loadNext(), null, this);
    }
  
    loadNext() {
      this.scene.start("Game", {
        name: this.name,
        number: this.number,
        limitedTime: 10 + this.number * 3,
      });
    }
  }