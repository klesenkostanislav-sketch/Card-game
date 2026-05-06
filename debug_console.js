// Debug script to run in browser console
// Open http://localhost:8080 and paste this in the console

console.log('🔍 === MYSTIC REALMS DEBUG CONSOLE ===');

// Check if game is running
if (window.mysticRealms) {
    console.log('✅ Game instance found!');
    console.log('📊 State:', window.mysticRealms.state);
    console.log('🎮 Engine:', window.mysticRealms.engine);
    console.log('🎨 Renderer:', window.mysticRealms.renderer);
    
    // Check player hand
    const human = window.mysticRealms.state?.players?.human;
    console.log('👤 Human player:', {
        hp: human?.hp,
        mana: human?.mana,
        handSize: human?.hand?.length,
        deckSize: human?.deck?.length,
        cards: human?.hand?.map(c => c.name)
    });
} else {
    console.error('❌ Game instance NOT found! Check if main.js loaded.');
}

// Check DOM elements
const elements = [
    'player-hand',
    'opponent-hand', 
    'player-hp',
    'player-mana',
    'game-container'
];

elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        console.log(`✅ Element #${id} found`, el);
    } else {
        console.error(`❌ Element #${id} NOT FOUND!`);
    }
});

// Check CSS
const styles = document.styleSheets;
console.log('📄 Stylesheets:', styles.length);

console.log('🔍 === END DEBUG ===');
