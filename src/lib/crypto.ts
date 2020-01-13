import { createCipher, createDecipher } from 'crypto';
class __Crypto {
    static secretKey = '天冰，天上冰、亮晶晶！';
    static _aesEncrypt;
    set aesEncrypt(data) {
        let cipher = createCipher('aes-128-ecb', __Crypto.secretKey);
        __Crypto._aesEncrypt = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }
    get aesEncrypt() {
        return __Crypto._aesEncrypt;
    }
    aesEncryptPipe(data) {
        let cipher = createCipher('aes-128-ecb', __Crypto.secretKey);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }
    aesDecryptPipe(data) {
        let decipher = createDecipher('aes-128-ecb', __Crypto.secretKey);
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    }
}
export default new __Crypto();
