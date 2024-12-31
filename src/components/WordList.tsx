import { PlacedWord } from '../types';

interface WordListProps {
  words: string[];
  wordBankFontSize: number;
  font: string;
  placedWords?: PlacedWord[];
}

export function WordList({ words, wordBankFontSize, font, placedWords }: WordListProps) {
  const wordsPerColumn = Math.ceil(words.length / 3);

  const getWordDisplay = (word: string) => {
    if (!placedWords) return word;
    const placedWord = placedWords.find(pw => pw.word === word);
    return placedWord?.isBackwards ? `${word} ←` : word;
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
      {Array.from({ length: 3 }).map((_, colIndex) => (
        <div key={colIndex} className="space-y-2">
          {words
            .slice(colIndex * wordsPerColumn, (colIndex + 1) * wordsPerColumn)
            .map((word, index) => (
              <div
                key={`${word}-${index}`}
                className="text-center"
                style={{
                  fontFamily: font,
                  fontSize: `${wordBankFontSize}px`,
                }}
              >
                {getWordDisplay(word)}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}