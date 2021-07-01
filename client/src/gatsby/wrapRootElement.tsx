import React from "react";
import { WrapRootElementBrowserArgs } from "gatsby";

import { AmplifyClient } from "../context/amplifyClient";
import { LollyContextProvider } from "../context/lollyContext";

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <AmplifyClient>
    <LollyContextProvider>{element}</LollyContextProvider>
  </AmplifyClient>
);
