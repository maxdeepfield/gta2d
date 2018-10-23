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
}

export default Utils;