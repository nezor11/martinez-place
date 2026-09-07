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
    <header className="flex place-content-between lg:mb-16">
      <div className="header__main flex flex-col items-start justify-center basis-2/3 lg:basis-3/4">
        {renderTitle(user?.name || defaultName)}
        <div className="flex flex-col lg:flex-row flex-wrap lg:items-center">
          {renderSubtitle(user?.jobTitle || defaultJobTitle)}
          {user?.iconsData && (
            <div className="header__aux-gallery-details">
              <IconGallery iconsData={user.iconsData} />
            </div>
          )}
        </div>
      </div>
      <div className="header__aux flex items-start justify-end basis-1/3 lg:basis-1/4 lg:items-center">
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
