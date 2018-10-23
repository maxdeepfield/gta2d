class Utils {
    static randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    static distance(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static radians(degrees) {
        return degrees * Math.PI / 180;
    }

    static degrees(radians) {
        return radians * 180 / Math.PI;
    }
    static log(...x) {
        console.log(new Date(),x);
    }
    static getKeys(input){
        return {
            up:   input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            e: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            q: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            b: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
            i: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            g: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
            m: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
            space: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            enter: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
            f2: input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2)
        };
    }
}

export default Utils;