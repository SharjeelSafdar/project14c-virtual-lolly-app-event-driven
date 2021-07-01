import React, { FC } from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import NewLollyForm from "../components/newLollyForm";

const CreateNew: FC = () => {
  return (
    <Layout>
      <SEO title="Create New Lolly" />
      <NewLollyForm />
    </Layout>
  );
};

export default CreateNew;
