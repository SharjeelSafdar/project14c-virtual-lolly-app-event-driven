import React, { FC } from "react";
import { PageProps } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import DisplayLolly from "../components/displayLolly";
import { Lolly } from "../graphql/api";

const FrozenLolly: FC<PageProps<object, Lolly>> = ({ pageContext: lolly }) => {
  return (
    <Layout>
      <SEO title="Frozen Lolly" />
      <DisplayLolly {...lolly} />
    </Layout>
  );
};

export default FrozenLolly;
