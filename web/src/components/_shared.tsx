import { Image } from "@mantine/core";

import { FooterSimple } from "./Footer";

import { ReactComponent as DorkoduLogo } from "@assets/dorkodu_Logo.svg";
import DorkoduIDKeyIcon from "@assets/dorkodu-id_key.svg";

export const FormPage = {
  Header: () => (
    <>
      <Image
        src={DorkoduIDKeyIcon}
        width={100}
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </>
  ),
  Footer: () => (
    <FooterSimple
      links={[
        {
          link: "https://dorkodu.com",
          label: "About",
        },
        {
          link: "https://dorkodu.com/privacy",
          label: "Privacy",
        },
        {
          link: "https://garden.dorkodu.com",
          label: "Garden",
        },
        {
          link: "https://dorkodu.com/work",
          label: "Work",
        },
      ]}
      brand={<DorkoduLogo width={160} height={40} />}
    />
  ),
};
