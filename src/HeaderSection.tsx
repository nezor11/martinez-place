// HeaderSection.tsx
import { Header } from "@/stories/components/organisms/Header";
import type {
  ContactDetails,
  ImageDetails,
  Section,
} from "@/utils/types/section";

interface Props {
  section: Section;
}

const HeaderSection = ({ section }: Props) => {
  // Transformamos los íconos a la estructura esperada
  const iconsData = (section.icons ?? [])
    .map((iconGallery) => iconGallery.iconDetails)
    .map((icon) => ({
      name: icon.name,
      width: icon.width ? `${icon.width}px` : "1em", // Asume "1em" como valor predeterminado si no está especificado
      height: icon.height ? `${icon.height}px` : "1em", // Asume "1em" como valor predeterminado si no está especificado
    }));

  const contactInfo: ContactDetails = section.contactDetails
    ? {
        title: section.contactDetails.title,
        phone: section.contactDetails.phone,
        email: section.contactDetails.email,
        address: section.contactDetails.address,
      }
    : {
        title: "",
        phone: "",
        email: "",
        address: "",
      };

  const imageDetails: ImageDetails | null = section.imageDetails
    ? {
        url: section.imageDetails.url,
        metadata: {
          dimensions: {
            width: section.imageDetails.metadata.dimensions.width,
            height: section.imageDetails.metadata.dimensions.height,
          },
        },
      }
    : null;

  return (
    <Header
      key={section._key}
      user={{
        name: section.name ?? "",
        jobTitle: section.jobDescHeader,
        iconsData: iconsData,
        contactDetail: contactInfo,
        imageDetail: imageDetails ? { image: imageDetails.url } : undefined,
      }}
    />
  );
};

export default HeaderSection;
