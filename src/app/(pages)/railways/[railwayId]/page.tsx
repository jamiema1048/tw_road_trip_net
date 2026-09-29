import RailwayDetailPage, {
  generateMetadata as getRailwayMetadata,
  generateStaticParams as getRailwayStaticParams,
} from "@/src/features/railways/components/RailwayDetail/RailwayDetailPage";

export default RailwayDetailPage;

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getRailwayStaticParams();
}

export async function generateMetadata(
  props: Parameters<typeof getRailwayMetadata>[0],
) {
  return getRailwayMetadata(props);
}
