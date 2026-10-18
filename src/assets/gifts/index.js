import gift1 from './gift_1.png';
import gift2 from './gift_2.jpg';
import gift3 from './gift_3.jpg';
import gift4 from './gift_4.jpg';
import gift5 from './gift_5.jpg';
import gift6 from './gift_6.jpg';
import gift7 from './gift_7.jpg';
import gift8 from './gift_8.jpg';
import gift9 from './gift_9.jpg';
import gift10 from './gift_10.jpg';
import gift11 from './gift_11.jpg';
import gift12 from './gift_12.jpg';
import gift13 from './gift_13.jpg';
import gift14 from './gift_14.jpg';
import gift15 from './gift_15.jpg';
import gift16 from './gift_16.jpg';
import gift17 from './gift_17.jpg';
import gift18 from './gift_18.jpg';

// Fallback for missing gifts
const dummyGift = 'https://via.placeholder.com/150?text=Gift'; 
// Or use the one from parent assets if we can, but easier to just use a placeholder or re-import the dummy if needed. 
// Actually, let's try to import the dummy from one level up or just keep it simple.
// Since existing code used `../assets/dummy_gift.png`, I can import it here if I want, 
// OR simpler: just export the map and let the component handle the fallback.
// But the plan said "pre-fill 2-18 with dummy".
// Let's import the dummy from the parent folder (../dummy_gift.png) if possible, 
// or I can assume the component handles the default.
// The component update plan says: `const getGiftImage = (id) => giftImages[id] || dummyGift;`
// So this file just needs to export what we HAVE.

const giftImages = {
  1: gift1,
  2: gift2,
  3: gift3,
  4: gift4,
  5: gift5,
  6: gift6,
  7: gift7,
  8: gift8,
  9: gift9,
  10: gift10,
  11: gift11,
  12: gift12,
  13: gift13,
  14: gift14,
  15: gift15,
  16: gift16,
  17: gift17,
  18: gift18,
};

export default giftImages;
