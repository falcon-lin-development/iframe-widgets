// Internal Project Components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';

import colors from '@/styles/colors.config';

const DINotValidPage: React.FC = () => {
  return (
    <Scaffold
      appbar={
        <AppBar title="Delusion Index Report" backButton={<BackIconButton />} />
      }
      mainBody={
        <MainBody
          style={{
            color: colors.accentError,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Data not valid
        </MainBody>
      }
    />
  );
};

export default DINotValidPage;
