const { NFTStorage } = require('nft.storage');
const { filesFromPath } = require('files-from-path');
const fsPath = require('path');

module.exports = {
  name: "nft.storage",
  builder: async (options) => {
    const { nftStorageApiKey } = options;
    if (!nftStorageApiKey) {
      throw new Error("[nft.storage] API key is empty. (input nftStorageApiKey");
    }
    return new NFTStorage({ nftStorageApiKey });
  },
  upload: async (api, options) => {
    const { path, verbose } = options;
    const files = filesFromPath(path, {
      pathPrefix: fsPath.resolve(path),
      hidden: true,
    });
    if (verbose) console.log(`nft.storage: storing file(s) from ${path}`);
    const cid = await api.storeDirectory(files);
    if (verbose) console.log(`nft.storage: top-level directory cid is ${cid}`);
    const status = await api.status(cid);
    if (verbose) console.log(`nft.storage: upload status ${status}`);
    return {
      cid,
      ipfs: cid,
    };
  },
};
