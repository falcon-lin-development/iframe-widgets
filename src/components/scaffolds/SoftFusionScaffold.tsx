import AppIcon from '@/components/AppIcon';
import React, { ReactNode } from 'react';
import { Box } from '@mui/system';
import Image from 'next/image';

type Props = {
  iconUrl: string;
  loginImageUrl: string;
  mainContent: ReactNode;
};

interface BackgroundProps {
  bgImageUrl: string;
  imageUrl: string;
  alt?: string;
}

const SoftFusionScafford: React.FC<Props> = ({
  iconUrl,
  loginImageUrl,
  mainContent,
}) => {
  return (
    <>
      <div
        className={`tw-bg-defautBackground tw-flex tw-flex-col tw-h-screen `}
      >
        <main className="tw-flex-grow tw-overflow-y-auto tw-relative tw-flex tw-flex-col">
          <div className="tw-flex tw-bg-appbar  tw-text-appbarTitle tw-items-center tw-px-4 tw-py-2.5">
            <AppIcon iconImageUrl={iconUrl} className="tw-z-10" />
          </div>
          <FusionImageSection
            bgImageUrl={loginImageUrl}
            imageUrl={loginImageUrl}
            alt={'community login logo'}
          />
          <div
            className="
                    tw-flex-grow 
                    tw-bg-gradient-to-b 
                    tw-from-transparent 
                    tw-to-white  

                    tw-flex 
                    tw-flex-col
                    tw-items-center
                    tw-h-full 
                    tw-px-[1rem]
                "
          >
            {mainContent}
          </div>
        </main>
      </div>
    </>
  );
};

export default SoftFusionScafford;

const FusionImageSection: React.FC<BackgroundProps> = ({
  bgImageUrl,
  imageUrl,
  alt,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: `url('${bgImageUrl}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(40px)',
          opacity: 0.6,
          zIndex: 1,
        },
      }}
    >
      <div
        style={{
          position: 'relative',
          marginTop: '0.75rem',
          marginBottom: '0.75rem',
          width: '16rem',
          height: '16rem',
          zIndex: 2,
        }}
      >
        <Image
          src={imageUrl}
          alt={alt ?? ''}
          width={256}
          height={256}
          style={{ width: 256, height: 256, filter: 'blur(8px)' }}
          priority
        />
      </div>
    </Box>
  );
};
