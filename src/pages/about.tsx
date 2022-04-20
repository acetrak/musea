import type { NextPage } from 'next';
import { Box, Link, Typography } from '@mui/material';
import * as React from 'react';
import Head from 'next/head';
import PageLayout from '../components/PageLayout';
import { appName } from '../constant';

const About: NextPage = (props) => {


  return (
    <PageLayout>
      <Head>
        <title>{appName } - 关于</title>
      </Head>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" mt="20vh" color="grey.400">
          关于本站
        </Typography>
        <Typography py={4} variant="h6">本网站基于NextJs开发,API来源自开源社区。仅供学习交流，不用于商业用途。</Typography>


        <Box py={2}>
          <Typography>API:</Typography>
          <Link href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">Binaryify</Link>
        </Box>
        <Typography color="grey.500">Power By <Link
          href="https://nextjs.org/" target="_blank"
        >Nextjs</Link></Typography>
      </Box>
    </PageLayout>

  );
};

export default About;

