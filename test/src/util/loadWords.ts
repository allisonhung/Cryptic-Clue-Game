import Words from '../data/words.json';

export const loadWords = async (): Promise<string[]> => {
    return Words; // Assuming `Words` is an array of strings.
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

    redIndices.forEach(index => colors[index] = 'red');
    blueIndices.forEach(index => colors[index] = 'blue');

    return colors;
};