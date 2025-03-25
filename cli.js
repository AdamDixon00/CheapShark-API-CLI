// 🌐 Import functions from api.js
import { searchByKeyword, getTopDeals, getGameDetailsById, getStoreList } from './api.js';


// 📦 Get command-line arguments
const args = process.argv.slice(2);
const command = args[0];
const keyword = args[1];

// 🔎 Handle 'search' command
if (command === 'search') {
  if (!keyword) {
    console.log('⚠️ Please provide a keyword: node cli.js search "<keyword>"');
    process.exit(1);
  }

  // 🧠 Call API to search games by keyword
  searchByKeyword(keyword)
    .then(results => {
      console.log('\n🔎 Search Results:\n');

      results.forEach((game, index) => {
        const title = game.external || 'Unknown Title';
        const price = game.cheapestPriceEver?.price ?? 'N/A';
        const gameID = game.gameID || '???'; // 👈 get the Game ID
      
        console.log(`${index + 1}. ${title} (Game ID: ${gameID}) - $${price}`);
      });
    })
    
    .catch(error => {
      console.error('❌ Error:', error.message);
    });


// 🔥 Handle 'topdeals' command
} else if (command === 'topdeals') {
  getTopDeals()
    .then(results => {
      console.log('\n🔥 Top Steam Deals:\n');
      results.forEach((deal, index) => {
        const title = deal.title || 'Unknown Game';
        const salePrice = deal.salePrice || 'N/A';
        const normalPrice = deal.normalPrice || 'N/A';
        const savings = deal.savings ? `${parseFloat(deal.savings).toFixed(2)}%` : '0%';

        console.log(`${index + 1}. ${title} - Sale: $${salePrice} (Normal: $${normalPrice}) - Savings: ${savings}`);
      });
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
    });


// 🧾 Handle 'game' command (get detailed info using game ID)
} else if (command === 'game') {
  if (!keyword) {
    console.log('⚠️ Please provide a game ID: node cli.js game <gameID>');
    process.exit(1);
  }

// 🧾 Get detailed info for the game & store list
Promise.all([
    getGameDetailsById(keyword),
    getStoreList()
  ])
  .then(([data, stores]) => {
    // 🗺️ Build a map: Store ID → Store Name
    const storeMap = {};
    stores.forEach(store => {
      storeMap[store.storeID] = store.storeName;
    });
  
    // 🎮 Display game info
    console.log(`\n🎮 ${data.info.title}`);
    console.log(`📝 ${data.info.description || 'No description available.'}\n`);
    console.log('💰 Deals:\n');
  
    // 💸 Show each deal with store name and link
    data.deals.forEach((deal, index) => {
      const storeName = storeMap[deal.storeID] || `Store #${deal.storeID}`;
      const price = deal.price;
      const retailPrice = deal.retailPrice;
      const savings = parseFloat(deal.savings).toFixed(2);
      const dealLink = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
  
      console.log(`${index + 1}. ${storeName}`);
      console.log(`   - Price: $${price}`);
      console.log(`   - Normal: $${retailPrice}`);
      console.log(`   - Savings: ${savings}%`);
      console.log(`   - 🔗 [Deal Link](${dealLink})\n`);
    });
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
  

// ❓ Handle unknown commands
} else {
  console.log('⚠️ Unknown command.\n\nAvailable Commands:\n');
  console.log('👉 node cli.js search "<keyword>"    → Search games by name');
  console.log('👉 node cli.js topdeals              → Show top 10 Steam game deals');
  console.log('👉 node cli.js game <gameID>         → Get detailed deals for a game by ID');
}
