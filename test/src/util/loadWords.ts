// Functions to extract words from a json file and randomly generate colors
// words.json is just a list of strings! Taken from the Pixelary docs.

import Words from '../data/words.json' assert { type: "json" };

export const loadWords = async (): Promise<string[]> => {
    return Words; 
};
  
export const getRandomWords = (words: string[], count: number): string[] => {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const assignColors = (count: number): string[] => {
    const colors = new Array(count).fill('white');
    const redIndices = new Set<number>();
    const blueIndices = new Set<number>();

    while (redIndices.size < 8) {
        redIndices.add(Math.floor(Math.random() * count));
    }

    while (blueIndices.size < 9) {
        const index = Math.floor(Math.random() * count);
        if (!redIndices.has(index)) {
        blueIndices.add(index);
        }
    }

    redIndices.forEach(index => colors[index] = 'PureGray-500');
    blueIndices.forEach(index => colors[index] = 'AlienBlue-500');

    return colors;
};