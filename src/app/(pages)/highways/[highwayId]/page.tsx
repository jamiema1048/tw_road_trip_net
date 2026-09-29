import HighwayDetailPage, {
  generateMetadata as getHighwayMetadata,
  generateStaticParams as getHighwayStaticParams,
} from "@/src/features/highways/components/HighwayDetail/HighwayDetailPage";

export default HighwayDetailPage;

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getHighwayStaticParams();
}

export async function generateMetadata(
  props: Parameters<typeof getHighwayMetadata>[0],
) {
  return getHighwayMetadata(props);
}
