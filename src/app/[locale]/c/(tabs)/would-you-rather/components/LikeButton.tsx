import { SxProps, Theme } from '@mui/material';
import { Heart } from 'lucide-react';

type LikeButtonProps = {
  isLiked: boolean;
  size?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  onClick,
  size = 24,
  style,
}) => {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="heartGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(208, 149, 236, 1)" />
            <stop offset="100%" stopColor="rgba(234, 89, 165, 1)" />
          </linearGradient>
        </defs>
      </svg>
      <Heart
        size={size}
        color={isLiked ? 'url(#heartGradient)' : 'currentColor'}
        fill={isLiked ? 'url(#heartGradient)' : 'none'}
        onClick={onClick}
        style={{
          ...style,
        }}
      />
    </>
  );
};

export { LikeButton };
