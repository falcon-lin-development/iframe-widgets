import Image from 'next/image';

type Props = {
  iconImageUrl?: string;
  className?: string;
};

const AppIcon: React.FC<Props> = ({ iconImageUrl, className }) => {
  if (iconImageUrl) {
    return (
      <Image
        style={{
          backgroundColor: 'transparent',
          width: 112,
          height: 36,
          objectFit: 'contain',
        }}
        className={className}
        src={iconImageUrl}
        height={36}
        width={112}
        alt="app-icon"
        priority
      />
    );
  }

  return <></>;
};

export default AppIcon;
