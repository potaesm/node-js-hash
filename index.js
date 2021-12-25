const { HMAC_SHA1 } = require('./HMAC');
const SHA256 = require('./SHA256');

console.log(HMAC_SHA1('Suthinan', 'Musitmani') === '0f29db6c26543789da91b6b6754659e5c8256fa4');
console.log(SHA256('SuthinanMusitmani') === 'd2a4efe0ae1f728ae51b65763f623dd824cfd709fee3e7ad99f5255e77d8b354');
