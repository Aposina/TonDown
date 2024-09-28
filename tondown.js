const TonWeb = require('tonweb');
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const tonweb = new TonWeb();

// تولید عبارت بازیابی
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic:', mnemonic);

// تولید کلیدهای خصوصی و عمومی از عبارت بازیابی
const seed = bip39.mnemonicToSeedSync(mnemonic);
const hdWallet = hdkey.fromMasterSeed(seed);
const wallet = hdWallet.getWallet();
const privateKey = wallet.getPrivateKeyString();
const publicKey = wallet.getPublicKeyString();

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);

// ایجاد آدرس ولت
const walletAddress = tonweb.wallet.create({publicKey: publicKey}).getAddress();
console.log('Wallet Address:', walletAddress.toString(true, true, true));

// رمزنگاری کلید خصوصی
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

const encryptedPrivateKey = encrypt(privateKey);
console.log('Encrypted Private Key:', encryptedPrivateKey);

// ارسال تراکنش
async function sendTransaction(toAddress, amount) {
    const seqno = await tonweb.wallet.create({publicKey: publicKey}).methods.seqno().call();
    const transfer = tonweb.wallet.create({publicKey: publicKey}).methods.transfer({
        secretKey: privateKey,
        toAddress: toAddress,
        amount: TonWeb.utils.toNano(amount),
        seqno: seqno,
        sendMode: 3,
    });
    await transfer.send();
    console.log(`Sent ${amount} TON to ${toAddress}`);
}

// مثال ارسال تراکنش
sendTransaction('EQD...your_recipient_address...', 1);

// تابع برای ایجاد کیف پول جدید
function createNewWallet() {
    const mnemonic = bip39.generateMnemonic();
    console.log('Mnemonic:', mnemonic);

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const wallet = hdWallet.getWallet();
    const privateKey = wallet.getPrivateKeyString();
    const publicKey = wallet.getPublicKeyString();

    console.log('Private Key:', privateKey);
    console.log('Public Key:', publicKey);

    const walletAddress = tonweb.wallet.create({publicKey: publicKey}).getAddress();
    console.log('Wallet Address:', walletAddress.toString(true, true, true));

    return {
        mnemonic: mnemonic,
        privateKey: privateKey,
        publicKey: publicKey,
        walletAddress: walletAddress.toString(true, true, true)
    };
}

// مثال استفاده از تابع برای ایجاد کیف پول جدید برای کاربر جدید
const newUserWallet = createNewWallet();
console.log('New User Wallet:', newUserWallet);

