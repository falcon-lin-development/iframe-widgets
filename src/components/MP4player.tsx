// Import React and MUI components
'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';

const Mp4Player: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({ src, style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  //   const [progress, setProgress] = useState(0);

  //   const handlePlay = () => {
  //     if (videoRef.current) {
  //       videoRef.current.play();
  //     }
  //   };

  //   const handlePause = () => {
  //     if (videoRef.current) {
  //       videoRef.current.pause();
  //     }
  //   };

  //   const handleTimeUpdate = () => {
  //     if (videoRef.current) {
  //       const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
  //       setProgress(currentProgress);
  //     }
  //   };

  //   useEffect(() => {
  //     const video = videoRef.current;
  //     if (video) {
  //       video.addEventListener('timeupdate', handleTimeUpdate);
  //       return () => {
  //         video.removeEventListener('timeupdate', handleTimeUpdate);
  //       };
  //     }
  //   }, []);

  return (
    <>
      <video ref={videoRef} width="100%" controls style={style}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <div style={{ maxWidth: 645, margin: 'auto', paddingTop: '50px' }}>
                    <Card>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            React MP4 Player
                        </Typography>
                        <video ref={videoRef} width="100%" controls>
                            <source src={src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <LinearProgress variant="determinate" value={progress} />
                        </CardContent>
                        <CardActions>
                        <Button size="small" onClick={handlePlay}>Play</Button>
                        <Button size="small" onClick={handlePause}>Pause</Button>
                        </CardActions>
                    </Card>
                </div> */}
    </>
  );
};

export default Mp4Player;
