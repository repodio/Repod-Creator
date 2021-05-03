import Head from "next/head";
import { ConsoleSideDrawer } from "components/Navigation";

const ConsoleLayout = ({ children }) => {
  console.log("ConsoleLayout Rerender");
  return (
    <div>
      <Head>
        <title>Repod Console</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex flex-row w-full h-full">
        <ConsoleSideDrawer />
        <div className="flex flex-col flex-1 bg-repod-canvas">{children}</div>
      </div>
    </div>
  );
};

export default ConsoleLayout;
