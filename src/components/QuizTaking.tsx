import React, { useState } from 'react';
import { SystemButton } from './SystemUI';
import { cn } from '../lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

const questions = [
  { id: 1, question: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], correct: 1 },
  { id: 2, question: 'What is the integral of 1/x?', options: ['ln|x|', 'x^2', '1', 'e^x'], correct: 0 },
  { id: 3, question: 'Which of these is a prime number?', options: ['4', '6', '8', '7'], correct: 3 },
];

export const QuizTaking = ({ onExit }: { onExit: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (optionIdx: number) => {
    setSelected(optionIdx);
    if (optionIdx === questions[currentIdx].correct) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      setSelected(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <div className="bg-black/40 border border-system-purple/30 p-12 text-center text-white space-y-8 animate-in zoom-in duration-500">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Quiz Complete</h2>
        <p className="text-xl">Your Score: {score} / {questions.length}</p>
        <SystemButton onClick={onExit} className="px-12 py-4 bg-system-purple/20">
          EXIT
        </SystemButton>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="bg-black/40 border border-white/10 p-8 space-y-6">
      <div className="flex justify-between items-center text-xs font-mono text-neutral-500">
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <h3 className="text-2xl font-bold text-white">{q.question}</h3>
      <div className="grid grid-cols-1 gap-4">
        {q.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selected !== null}
            className={cn(
              "p-4 text-left border rounded transition-all",
              selected === null ? "bg-white/5 border-white/10 hover:bg-white/10" :
              selected === idx ? (idx === q.correct ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500") :
              idx === q.correct ? "bg-green-500/20 border-green-500" : "bg-white/5 border-white/10 opacity-50"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
