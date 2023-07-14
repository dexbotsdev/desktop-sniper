/* eslint-disable prettier/prettier */
import cheerio from 'cheerio';
import { ethers } from 'ethers';

const axios = require('axios');

// eslint-disable-next-line consistent-return
export default async function getEthereumABIFromContractAddress(contractAddress: string): Promise<ethers.ContractInterface | void> {
    try {
        const { data } = await axios.get(`https://etherscan.io/token/${contractAddress}#code`);
        const $ = cheerio.load(data);
        return JSON.parse($.html()
            .split('<pre class="wordwrap js-copytextarea2 scrollbar-custom" id="js-copytextarea2" style="height: 200px; max-height: 400px; margin-top: 5px;">')[1]
            .split('</pre>')[0]
        )
    } catch (e: any) {
        console.error(`Error while fetching data for ${contractAddress} - ${e.message}`);
        process.exit();
    }
}

// export async function getGoerliABIFromContractAddress(contractAddress: string): Promise<ethers.ContractInterface> {
//     try {
//         const { data } = await axios.get(`https://goerli.etherscan.io/address/${contractAddress}#code`);
//         const $ = cheerio.load(data);
//         console.log(`https://goerli.etherscan.io/address/${contractAddress}#code`)
//         return JSON.parse($.html()
//             .split('<pre class="wordwrap js-copytextarea2 scrollbar-custom" id="js-copytextarea2" style="height: 200px; max-height: 400px; margin-top: 5px;">')[1]
//             .split('</pre>')[0]
//         )
//     } catch (e: any) {
//         console.error(`Error while fetching data for ${contractAddress} - ${e.message}`);
//         process.exit();
//     }
// }

