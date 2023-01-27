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
    return new NFTStorage({ token: nftStorageApiKey });
  },
  upload: async (api, options) => {
    const { path, verbose } = options;
    const files = filesFromPath(path, {
      pathPrefix: fsPath.resolve(path),
      hidden: true,
    });
    if (verbose) console.log(`nft.storage: storing file(s) from ${path}`);
    const cid = await api.storeDirectory(files);
    if (verbose) console.log(`nft.storage: top-level directory cid is ${cid}. WARNING: files or a directory pinned to ipfs by the nft.storage javascript client may have different cidv1s than the same identical files or directory pinned to another service, such as pinata or infura. This is because the generated cid depends not only on the files' contents, but also at least on the selected multihash algorthm and chunk size. For this reason, the nft.storage service produces different cidv1s than other services in this workflow action. See https://stackoverflow.com/a/59184086`);
    const status = await api.status(cid);
    if (verbose) console.log(`nft.storage: upload status ${status}`);
    return {
      cid,
      ipfs: cid,
    };
  },
};
