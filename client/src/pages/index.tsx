import React, { FC } from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Lolly from "../components/lolly";

const IndexPage: FC = () => {
  const exampleLollies = [
    { topColor: "#e97393", middleColor: "#d23a62", bottomColor: "#bb1161" },
    { topColor: "#d52358", middleColor: "#e95946", bottomColor: "#deaa43" },
    { topColor: "#97e665", middleColor: "#8ccb4c", bottomColor: "#a8d838" },
    { topColor: "#feefd6", middleColor: "#b65ae4", bottomColor: "#c116c1" },
    { topColor: "#cd2753", middleColor: "#d5cfd1", bottomColor: "#5ba3da" },
  ];

  return (
    <Layout>
      <SEO title="Home" />
      <div className="thumbs">
        {exampleLollies.map((lolly, index) => (
          <div className="lolly example" key={index}>
            <Lolly
              topColor={lolly.topColor}
              middleColor={lolly.middleColor}
              bottomColor={lolly.bottomColor}
            />
          </div>
        ))}
      </div>
      <p>
        <Link to="/create-new" className="btn">
          Make a new lolly to send to a friend
        </Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
