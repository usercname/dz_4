import { useState, useEffect, useRef } from 'react';
import './Timer.scss';

const INITIAL_SECONDS = 59 * 60 + 59;

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function Timer({ onClose }) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isFinished) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isFinished]);

  const handleToggle = () => { if (!isFinished) setIsRunning(prev => !prev); };

  const handleRestart = () => {
    if (isFinished) {
      setSeconds(INITIAL_SECONDS);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setSeconds(INITIAL_SECONDS);
    }
  };

  return (
    <div className="timer">
      <button className="timer__close" onClick={onClose} aria-label="Close">×</button>
      <div className="timer__display">{isFinished ? 'таймер истёк' : formatTime(seconds)}</div>
      <div className="timer__controls">
        <button className="timer__btn timer__btn--toggle" onClick={handleToggle} disabled={isFinished}>
          {isRunning ? 'стоп' : 'возобновить'}
        </button>
        <button className={`timer__btn timer__btn--restart ${isFinished ? 'timer__btn--restart--active' : ''}`} onClick={handleRestart}>
          рестарт
        </button>
      </div>
    </div>
  );
}

export default Timer;