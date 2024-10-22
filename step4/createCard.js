/**
 * Create a card game object
 */
export const createCard = ({
    scene,
    x,
    y,
    frontTexture,
    cardName,
    scale
}) => {

    let isFlipping = false;
    const rotation = { y: 0 };
    const backTexture = "card-back";
    const card = scene.add.plane(x, y, frontTexture)
        .setName(cardName)
        .setScale(scale)
        .setInteractive();
    
   

    const flipCard = (callbackComplete) => {return ;};
    

    const destroy = () => {
        scene.add.tween({
            targets: [card],
            y: card.y - 1000,
            easing: Phaser.Math.Easing.Elastic.In,
            duration: 500,
            onComplete: () => {
                card.destroy();
            }
        })
    }

    return {
        gameObject: card,
        flip: flipCard,
        destroy,
        cardName
    }
}