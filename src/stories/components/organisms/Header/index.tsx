import { SubtitleCopy } from "@/stories/components/atoms/SubtitleCopy";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import {
  ContactDetail,
  type ContactDetailTexts,
} from "@/stories/components/molecules/ContactDetails";
import {
  FrameImage,
  type FrameImageProps,
} from "@/stories/components/molecules/FrameImage";
import {
  IconGallery,
  type IconGalleryProps,
} from "@/stories/components/molecules/IconGallery";
import type { FC } from "react";
import "./index.css";

export interface User extends IconGalleryProps {
  name: string;
  jobTitle?: string;
  contactDetail?: ContactDetailTexts;
  imageDetail?: FrameImageProps;
}

export interface HeaderProps {
  user: User | null;
}

const renderTitle = (name: string) => (
  <TitleCopy
    as="h1"
    text={name}
    mods="font-medium text-header leading-none mb-2"
  />
);

const renderSubtitle = (jobTitle: string) => (
  <SubtitleCopy
    subtitle="h2"
    text={jobTitle}
    mods="text-subheader uppercase text-gray-600 dark:text-gray-400"
  />
);

export const Header: FC<HeaderProps> = ({ user }) => {
  const defaultName = "Rodrigor";
  const defaultJobTitle = "Papaar papaar";

  return (
    <header className="grid grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] lg:mb-16">
      <div className="header__main col-start-1 row-start-1 flex flex-col items-start justify-end lg:justify-center">
        {renderTitle(user?.name || defaultName)}
        {renderSubtitle(user?.jobTitle || defaultJobTitle)}
      </div>
      {user?.iconsData && (
        <div className="header__aux-gallery-details col-span-2 row-start-2 mt-2 min-w-0 lg:col-span-1 lg:col-start-1 lg:mt-0">
          <IconGallery iconsData={user.iconsData} />
        </div>
      )}
      <div className="header__aux col-start-2 row-start-1 flex items-start justify-end lg:row-span-2 lg:items-center">
        {user?.imageDetail && (
          <div className="header__aux-image-details flex items-end justify-end">
            <FrameImage image={user.imageDetail.image} />
          </div>
        )}
        {user?.contactDetail && (
          <div className="header__aux-contact-details items-center justify-center hidden lg:flex">
            <ContactDetail contactDetail={user.contactDetail} />
          </div>
        )}
      </div>
    </header>
  );
};
