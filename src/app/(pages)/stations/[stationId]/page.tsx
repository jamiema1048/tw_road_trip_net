import StationDetailPage, {
  generateMetadata as getStationMetadata,
  generateStaticParams as getStationStaticParams,
} from "@/src/features/stations/components/StationDetail/StationDetailPage";

export default StationDetailPage;

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getStationStaticParams();
}

export async function generateMetadata(
  props: Parameters<typeof getStationMetadata>[0],
) {
  return getStationMetadata(props);
}
