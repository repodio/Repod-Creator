import Head from "next/head";
import { ConsoleSideDrawer } from "components/Console";

const ConsoleLayout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Repod Console</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex flex-row w-full h-full">
        <ConsoleSideDrawer />
        <div className="flex flex-col flex-grow bg-repod-canvas overflow-x-hidden ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConsoleLayout;
