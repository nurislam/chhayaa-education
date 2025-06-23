 
import Head from "next/head";

// either Static metadata

interface IHeadContentParams {
  title?: string;
} 



const HeadContent: React.FC<IHeadContentParams> = ({ title }) => {
  return ( 
    <Head>
      <title>{title ? "Custom - " + title : "Custom CMS"}</title>
      <meta name="description" content="Custom NextJS CMS" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Head>
  );
};
export default HeadContent;
