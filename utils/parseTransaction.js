export function parseTransaction(input, accounts) {
  try {
    const words = input.split(' ');
    let amount = 0;
    let description = [];
    let categories = [];
    let accountName = '';

    // Process each word
    for (let word of words) {
      if (word.startsWith(':')) {
        // Handle account
        accountName = word.substring(1).trim();
        continue;
      }

      if (word.startsWith('#')) {
        // Handle category
        categories.push(word.substring(1));
        continue;
      }

      // Check if it's a number
      const num = parseFloat(word);
      if (!isNaN(num) && amount === 0) {
        amount = Math.abs(num);
        continue;
      }

      // If none of above, it's part of description
      description.push(word);
    }

    return {
      amount,
      description: description.join(' ').trim(),
      categories,
      accountName,
      accountId: null // Let HomeScreen handle finding the accountId
    };
  } catch (error) {
    console.error('Parse error:', error);
    return { 
      amount: 0, 
      description: '', 
      categories: [], 
      accountName: '',
      accountId: null 
    };
  }
}
