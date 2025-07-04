// src/hooks/useAudioPlayer.jsx
import { useRef, useState, useEffect } from 'react';

export default function useAudioPlayer(tracks) {
  const audioRef = useRef(new Audio(tracks[0]));
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true; // loop current track
    audio.volume = volume;
    return () => audio.pause(); // cleanup
  }, []);

  useEffect(() => {
    audioRef.current.src = tracks[currentTrack];
    if (isPlaying) audioRef.current.play();
  }, [currentTrack]);

  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const next = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prev = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const changeVolume = (v) => {
    audioRef.current.volume = v;
    setVolume(v);
  };

  return {
    play, pause, next, prev, changeVolume,
    isPlaying, currentTrack, volume
  };
}
